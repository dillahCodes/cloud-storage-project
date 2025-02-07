import useUser from "@/features/auth/hooks/use-user";
import { RootFolderGetData, SharedWithMeData, SubFolderGetData } from "@/features/folder/folder";
import { parentFolderSelector } from "@/features/folder/slice/parent-folder-slice";
import { db } from "@/firebase/firebase-services";
import useDetectLocation from "@/hooks/use-detect-location";
import useScrollEnd from "@/hooks/use-scroll-end";
import {
  collection,
  doc,
  DocumentData,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  QueryConstraint,
  startAfter,
  where,
} from "firebase/firestore";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import handleCreateFileSearchResult from "../handle-create-file-search-result";
import handleCreateFolderSearchResult from "../handle-create-folder-search-result";
import { FolderResultSearch, ResultSearchState } from "../search";
import {
  resetResultSearch,
  resultSearchSelector,
  setDataLengthResultSearch,
  setDataResultSearch,
  setStatusFetchResultSearch,
} from "../slice/result-search-slice";
import { searchBarSelector } from "../slice/search-bar-slice";

interface UseSearchSharedWithMeLocationProps {
  shouldFetch: boolean;
}

interface QueryParams {
  lastDoc: DocumentData | null;
  isGetCount: boolean;
}

/**
 * Fetches all the shared with me folder metadata by their IDs.
 *
 * @param {string[]} folderIds - The IDs of the folders to fetch.
 * @param {string} userId - The ID of the user who shared the folders.
 * @returns {Promise<SharedWithMeData[]>} A promise that resolves to the shared with me folder metadata.
 */
const handleGetSharedWithMeFolderMetadataByFolderIds = async (folderIds: string[], userId: string) => {
  const promises = folderIds.map(async (folderId) => {
    const folderRef = doc(db, "sharedWithMeFolders", `${userId}_${folderId}`);
    const folderSnapshot = await getDoc(folderRef);
    return folderSnapshot.exists() ? (JSON.parse(JSON.stringify(folderSnapshot.data())) as SharedWithMeData) : null;
  });

  const folderData = await Promise.all(promises);
  const sharedFoldersMetadataNullFiltered = folderData.filter((folder) => folder !== null) as SharedWithMeData[];
  return sharedFoldersMetadataNullFiltered;
};

/**
 * Fetches all the folders in the given query and serializes the results for use in the React store.
 *
 * @param {Query<DocumentData, DocumentData>} query - The Firestore query to execute.
 * @returns {Promise<(SubFolderGetData | RootFolderGetData)[]>} A promise that resolves to the folders in the query, or an empty array if the query is empty.
 */
const handleGetFoldersByQuery = async (query: Query<DocumentData, DocumentData>) => {
  const folderSnapshot = await getDocs(query);
  const folderResults = folderSnapshot.empty
    ? []
    : folderSnapshot.docs.map((doc) => JSON.parse(JSON.stringify(doc.data())) as SubFolderGetData | RootFolderGetData);
  return folderResults;
};

/**
 * Custom hook for searching files and folders in shared with me location
 */
const useSearchSharedWithMeLocation = ({ shouldFetch }: UseSearchSharedWithMeLocationProps) => {
  const dispatch = useDispatch();

  // user hooks
  const { user } = useUser();
  const isUserExists = user !== null;

  // hooks detect location
  const { isSubSharedWithMeLocation } = useDetectLocation();

  // Redux state
  const { parentFolderData } = useSelector(parentFolderSelector);
  const { searchInputValue, selectedLocationName, selectedSearchCategoryName } = useSelector(searchBarSelector);
  const { data, dataLength } = useSelector(resultSearchSelector);

  // Refs to prevent unnecessary re-renders
  const lastVisibleDataRef = useRef<DocumentData | null>(null);
  const currentDataRef = useRef<ResultSearchState["data"] | null>(null);

  // Scroll state
  const scrollableElement = document.getElementById("result-search");
  const { isAtBottom } = useScrollEnd({ offset: 10, scrollableElement });

  const isParentFolderExists = parentFolderData !== null;
  const isSharedFolderSelectedLocation = selectedLocationName === "shared-with-me";
  const isValidSearch = searchInputValue.trim().length >= 3 && shouldFetch && isUserExists;

  //  if curr selected location is shared with me and parent folder isn't exists, then it is root shared with me location
  const isRootSharedWithMeLocationSearch = isSharedFolderSelectedLocation && !isParentFolderExists;

  //  if curr selected location is shared with me and parent folder exists, then it is sub shared with me location
  const isSubSharedWithMeLocationSearch = isSharedFolderSelectedLocation && isParentFolderExists && isSubSharedWithMeLocation;

  //  file search is available in sub shared with me location
  const isFileSelectedSearchCategory = selectedSearchCategoryName === "file";
  const isFileSearch = isFileSelectedSearchCategory && isSubSharedWithMeLocationSearch;

  // folder search is available in root shared with me location or sub shared with me location1
  const isFolderSelectedSearchCategory = selectedSearchCategoryName === "folder";
  const isFolderSearch = isFolderSelectedSearchCategory && (isSubSharedWithMeLocationSearch || isRootSharedWithMeLocationSearch);

  // if last visible data is not null and data length is less than dataLength, then there is more data
  const isHaveMoreData = lastVisibleDataRef.current !== null && data.length < dataLength;

  // sub and root shared with me folders can fetch logic conditions
  const canFetchRootSharedWithMeFolders = isRootSharedWithMeLocationSearch && isValidSearch && isFolderSearch;
  const canFetchSubSharedWithMeFolders = isSubSharedWithMeLocationSearch && isValidSearch;

  // infinite scroll only available in sub shared with me location
  const canLoadMore = isHaveMoreData && isAtBottom && shouldFetch && isUserExists && isSubSharedWithMeLocationSearch;

  const isFileSearchAndRootSharedWithMeLocationSearch = isFileSearch && isRootSharedWithMeLocationSearch;
  const shouldResetResultState = !isValidSearch || !shouldFetch || isFileSearchAndRootSharedWithMeLocationSearch;

  /**
   * Reset search state.
   */
  const resetSearchState = useCallback(() => {
    dispatch(resetResultSearch());
    lastVisibleDataRef.current = null;
  }, [dispatch]);

  const resetSearchStateWhenFetch = useCallback(() => {
    dispatch(setStatusFetchResultSearch("success"));
    dispatch(setDataResultSearch([]));
    lastVisibleDataRef.current = null;
  }, [dispatch]);

  /**
   * Get collection reference
   */
  const getCollectionRef = useCallback(() => {
    if (isRootSharedWithMeLocationSearch || (isSubSharedWithMeLocationSearch && isFolderSearch)) return collection(db, "folders");
    if (isSubSharedWithMeLocationSearch && isFileSearch) return collection(db, "files");
    return null;
  }, [isFileSearch, isRootSharedWithMeLocationSearch, isSubSharedWithMeLocationSearch, isFolderSearch]);

  /**
   * Get query conditions
   */
  const getQueryConditions = useCallback(
    ({ isGetCount, lastDoc }: QueryParams): QueryConstraint[] => {
      const conditions: QueryConstraint[] = [];
      const nameField = isFileSearch ? "file_name" : "folder_name";

      if (isRootSharedWithMeLocationSearch) {
        return [
          where("folder_name", ">=", searchInputValue),
          where("folder_name", "<=", searchInputValue + "\uf8ff"),
          orderBy("folder_name"),
          limit(7),
        ];
      }

      if (isSubSharedWithMeLocationSearch && parentFolderData) {
        conditions.push(
          where(nameField, ">=", searchInputValue),
          where(nameField, "<=", searchInputValue + "\uf8ff"),
          where("parent_folder_id", "==", parentFolderData.folder_id),
          orderBy(nameField)
        );

        if (!isGetCount) conditions.push(limit(7));
        if (lastDoc) conditions.push(startAfter(lastDoc));
      }

      return conditions;
    },
    [isSubSharedWithMeLocationSearch, isRootSharedWithMeLocationSearch, parentFolderData, searchInputValue, isFileSearch]
  );

  /**
   * handle build query
   * based on query conditions, lastDoc and isGetCount
   */
  const handleBuildQuery = useCallback(
    ({ isGetCount, lastDoc }: QueryParams) => {
      const collectionRef = getCollectionRef();
      if (!collectionRef) return null;

      const queryConditions = getQueryConditions({ isGetCount, lastDoc });
      return query(collectionRef, ...queryConditions);
    },
    [getCollectionRef, getQueryConditions]
  );

  /**
   * handle get data count
   */
  const handleGetDataCount = useCallback(async () => {
    const queryCount = handleBuildQuery({ isGetCount: true, lastDoc: null });
    if (!queryCount) return resetSearchStateWhenFetch();

    const countSnapshot = await getCountFromServer(queryCount);
    dispatch(setDataLengthResultSearch(countSnapshot.data().count));
  }, [dispatch, handleBuildQuery, resetSearchStateWhenFetch]);

  /**
   * fetch sub shared with me folders
   */
  const fetchSubSharedWithMeFolders = useCallback(
    async (loadMore: boolean = false) => {
      try {
        dispatch(setStatusFetchResultSearch("loading"));

        // Fetch data count on initial load
        if (!loadMore) await handleGetDataCount();

        // create query
        const querySnapshot = handleBuildQuery({ isGetCount: false, lastDoc: loadMore ? lastVisibleDataRef.current : null });
        if (!querySnapshot) return resetSearchStateWhenFetch();

        // Get data snapshot
        const dataSnapshot = await getDocs(querySnapshot);
        if (dataSnapshot.empty) return resetSearchStateWhenFetch();

        // Update last visible document
        lastVisibleDataRef.current = dataSnapshot.docs[dataSnapshot.docs.length - 1];

        // Map data to create result objects
        const mappedData = dataSnapshot.docs.map((doc) =>
          isFileSearch ? handleCreateFileSearchResult(doc) : handleCreateFolderSearchResult(doc)
        );

        // Update state with new data
        dispatch(setDataResultSearch(loadMore ? [...(currentDataRef.current ?? []), ...mappedData] : mappedData));
        dispatch(setStatusFetchResultSearch("success"));
      } catch (error) {
        console.error(
          "Error fetching sub shared with me folders: ",
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      }
    },
    [dispatch, handleBuildQuery, handleGetDataCount, isFileSearch, resetSearchStateWhenFetch]
  );

  /**
   * fetch root shared with me folders
   */
  const fetchRootSharedWithMeFolders = useCallback(async () => {
    try {
      // create query
      const folderQuery = handleBuildQuery({ isGetCount: false, lastDoc: null });
      if (!folderQuery) return resetSearchStateWhenFetch();

      // search  folders based on query
      const folderResults = await handleGetFoldersByQuery(folderQuery);
      if (!folderResults) return resetSearchStateWhenFetch();

      // extract folder id from search result
      const extractFolderResultsId = folderResults.map((folder) => folder.folder_id);

      // used extracted folder ids to get shared with me folders metadata
      const sharedFolderMetadata = await handleGetSharedWithMeFolderMetadataByFolderIds(extractFolderResultsId, user!.uid);
      const sharedFolderIds = new Set(sharedFolderMetadata.map((shared) => shared.folderId));
      const resultSharedWithMe = folderResults.filter((folder) => sharedFolderIds.has(folder.folder_id));

      // mapped data for create data type
      const mappedDataType = structuredClone(resultSharedWithMe as FolderResultSearch[]);
      mappedDataType.forEach((folder) => Object.assign(folder, { resultType: "folder" }));

      // Update state with new data
      dispatch(setDataResultSearch(mappedDataType));
      dispatch(setDataLengthResultSearch(mappedDataType.length));

      dispatch(setStatusFetchResultSearch("success"));
    } catch (error) {
      console.error(
        "Error fetching root shared with me folders:",
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  }, [user, resetSearchStateWhenFetch, dispatch, handleBuildQuery]);

  // Store current data in ref
  useEffect(() => {
    currentDataRef.current = data;
  }, [data]);

  // Fetch root shared with me folders
  useEffect(() => {
    if (canFetchRootSharedWithMeFolders) fetchRootSharedWithMeFolders();
  }, [
    canFetchRootSharedWithMeFolders,
    fetchRootSharedWithMeFolders,
    isFileSelectedSearchCategory,
    resetSearchState,
    isRootSharedWithMeLocationSearch,
  ]);

  // fetch sub shared with me folders
  useEffect(() => {
    if (canFetchSubSharedWithMeFolders) fetchSubSharedWithMeFolders();
  }, [canFetchSubSharedWithMeFolders, fetchSubSharedWithMeFolders]);

  // sub shared with me folders infinite scroll
  const debounceFetchMore = useMemo(() => debounce(() => fetchSubSharedWithMeFolders(true), 300), [fetchSubSharedWithMeFolders]);
  useEffect(() => {
    if (canLoadMore) debounceFetchMore();
    return () => debounceFetchMore.cancel();
  }, [debounceFetchMore, canLoadMore]);

  // Reset state if search input becomes invalid or location is not "shared-with-me"
  useEffect(() => {
    if (shouldResetResultState) resetSearchState();
  }, [shouldResetResultState, resetSearchState]);
};

export default useSearchSharedWithMeLocation;
