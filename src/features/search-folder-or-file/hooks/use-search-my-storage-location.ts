import useUser from "@/features/auth/hooks/use-user";
import { parentFolderSelector } from "@/features/folder/slice/parent-folder-slice";
import { db } from "@/firebase/firebase-services";
import useScrollEnd from "@/hooks/use-scroll-end";
import {
  collection,
  DocumentData,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
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
import { ResultSearchState } from "../search";
import {
  resetResultSearch,
  resultSearchSelector,
  setDataLengthResultSearch,
  setDataResultSearch,
  setStatusFetchResultSearch,
} from "../slice/result-search-slice";
import { searchBarSelector } from "../slice/search-bar-slice";
import useDetectLocation from "@/hooks/use-detect-location";

/**
 * There is a bug when searching for a root folder or file in the location "my storage" while in a sub-shared folder.
 * If the user tries to search for a root folder or file, for example, "root",
 * the results will incorrectly show files or folders relative to the folder with the ID "e06687f2-1188-45c1-9414-464153b8420c".
 * This is incorrect. It should show the root folder or file in "my storage".
 * Example URL: http://localhost:5173/storage/folders/e06687f2-1188-45c1-9414-464153b8420c?st=shared-with-me
 */

/**
 * Custom hook for searching files and folders in storage.
 */
interface SearchMyStorageLocationProps {
  shouldFetch: boolean;
}
const useSearchMyStorageLocation = ({ shouldFetch }: SearchMyStorageLocationProps) => {
  const dispatch = useDispatch();
  const { user } = useUser();

  // location hook
  const { isSubMyStorageLocation } = useDetectLocation();

  // Redux state
  const { parentFolderData } = useSelector(parentFolderSelector);
  const { searchInputValue, selectedSearchCategoryName } = useSelector(searchBarSelector);
  const { data, dataLength } = useSelector(resultSearchSelector);

  // Refs to prevent unnecessary re-renders
  const lastVisibleDataRef = useRef<DocumentData | null>(null);
  const currentDataRef = useRef<ResultSearchState["data"] | null>(null);

  // Scroll state
  const scrollableElement = document.getElementById("result-search");
  const { isAtBottom } = useScrollEnd({ offset: 10, scrollableElement });

  // Search conditions
  const isValidSearch = searchInputValue.trim().length >= 3 && shouldFetch;
  const isFileSearch = selectedSearchCategoryName === "file" && shouldFetch;

  // Load more conditions
  const isHaveMoreData = data.length < dataLength && lastVisibleDataRef.current !== null;
  const canLoadMore = isHaveMoreData && isAtBottom && isValidSearch && shouldFetch;

  // location selected conditions
  const isSubMyStorageLocationSearch = parentFolderData !== null && shouldFetch && isSubMyStorageLocation;

  /**
   * Reset search state.
   */
  const resetSearchState = useCallback(() => {
    dispatch(resetResultSearch());
    lastVisibleDataRef.current = null;
  }, [dispatch]);

  const resetSearchStateInFetch = useCallback(() => {
    dispatch(setStatusFetchResultSearch("success"));
    dispatch(setDataResultSearch([]));
    lastVisibleDataRef.current = null;
  }, [dispatch]);

  /**
   * Get Firestore query filters based on selected location.
   */
  const getLocationQueryFilters = useCallback((): QueryConstraint[] => {
    if (!user?.uid) return [];

    return isSubMyStorageLocationSearch && parentFolderData
      ? [where("parent_folder_id", "==", parentFolderData.folder_id)]
      : [where("root_folder_user_id", "==", user.uid), where("owner_user_id", "==", user.uid)];
  }, [isSubMyStorageLocationSearch, user?.uid, parentFolderData]);

  /**
   * Build Firestore query based on search input and filters.
   */
  const buildQuery = useCallback(
    (lastDoc: DocumentData | null = null, isGetCount = false) => {
      if (!isValidSearch) return null;

      const collectionRef = collection(db, isFileSearch ? "files" : "folders");
      const nameField = isFileSearch ? "file_name" : "folder_name";

      const queryConditions: QueryConstraint[] = [
        where(nameField, ">=", searchInputValue),
        where(nameField, "<=", searchInputValue + "\uf8ff"),
        orderBy(nameField),
        ...getLocationQueryFilters(),
      ];

      if (lastDoc) queryConditions.push(startAfter(lastDoc));
      if (!isGetCount) queryConditions.push(limit(8));

      return query(collectionRef, ...queryConditions);
    },
    [isFileSearch, searchInputValue, getLocationQueryFilters, isValidSearch]
  );

  /**
   * Fetch total result count from Firestore.
   */
  const fetchDataCount = useCallback(async () => {
    const countQuery = buildQuery(null, true);
    if (!countQuery) return;

    const countSnapshot = await getCountFromServer(countQuery);
    dispatch(setDataLengthResultSearch(countSnapshot.data().count));
  }, [dispatch, buildQuery]);

  /**
   * Fetch data from Firestore.
   */
  const fetchData = useCallback(
    async (loadMore = false) => {
      try {
        dispatch(setStatusFetchResultSearch("loading"));

        // Fetch data count on initial load
        if (!loadMore) await fetchDataCount();

        // Build query
        const querySnapshot = buildQuery(loadMore ? lastVisibleDataRef.current : null);
        if (!querySnapshot) return resetSearchStateInFetch();

        // Get data snapshot
        const dataSnapshot = await getDocs(querySnapshot);
        if (dataSnapshot.empty) return resetSearchStateInFetch();

        // Update last visible document
        lastVisibleDataRef.current = dataSnapshot.docs[dataSnapshot.docs.length - 1];

        // Map data to create result objects
        const mappedData = dataSnapshot.docs.map((doc) =>
          isFileSearch ? handleCreateFileSearchResult(doc) : handleCreateFolderSearchResult(doc)
        );

        // Update state with new data
        dispatch(setDataResultSearch(loadMore ? [...(currentDataRef.current ?? []), ...mappedData] : mappedData));
        // loadMore && setIsAtBottom(false);
        dispatch(setStatusFetchResultSearch("success"));
      } catch (error) {
        dispatch(setStatusFetchResultSearch("error"));
        console.error("Error fetching data:", error instanceof Error ? error.message : "An unknown error occurred");
      }
    },
    [dispatch, buildQuery, isFileSearch, fetchDataCount, resetSearchStateInFetch]
  );

  // Store current data in ref
  useEffect(() => {
    currentDataRef.current = data;
  }, [data]);

  // Initial search effect
  useEffect(() => {
    if (isValidSearch) fetchData();
  }, [fetchData, isValidSearch]);

  // Infinite scroll effect
  const debounceFetchMore = useMemo(() => debounce(() => fetchData(true), 500), [fetchData]);
  useEffect(() => {
    if (canLoadMore) debounceFetchMore();
    return () => debounceFetchMore.cancel();
  }, [debounceFetchMore, canLoadMore]);

  // Reset state if search input becomes invalid or location is not "my-storage"
  useEffect(() => {
    if (!isValidSearch) resetSearchState();
  }, [isValidSearch, resetSearchState]);
};

export default useSearchMyStorageLocation;
