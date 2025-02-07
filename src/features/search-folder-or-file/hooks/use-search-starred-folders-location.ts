import useUser from "@/features/auth/hooks/use-user";
import { RootFolderGetData, StarredFolderData, SubFolderGetData } from "@/features/folder/folder";
import { db } from "@/firebase/firebase-services";
import { collection, doc, DocumentData, getDoc, getDocs, limit, orderBy, Query, query, where } from "firebase/firestore";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetResultSearch,
  setDataLengthResultSearch,
  setDataResultSearch,
  setStatusFetchResultSearch,
} from "../slice/result-search-slice";
import { searchBarSelector } from "../slice/search-bar-slice";
import { FolderResultSearch } from "../search";

interface UseSearchStarredFoldersLocationProps {
  shouldFetch: boolean;
}

/**
 * Fetches all the folders in the given query and serializes the results for use in the React store.
 *
 * @param {Query<DocumentData, DocumentData>} query - The Firestore query to execute.
 * @returns {Promise<(SubFolderGetData | RootFolderGetData)[]>} A promise that resolves to the folders in the query, or an empty array if the query is empty.
 */

const handleGetFoldersByQuery = async (query: Query<DocumentData, DocumentData>) => {
  const foldersSnap = await getDocs(query);
  const folderResults = foldersSnap.empty
    ? []
    : foldersSnap.docs.map((doc) => JSON.parse(JSON.stringify(doc.data())) as SubFolderGetData | RootFolderGetData);
  return folderResults;
};

/**
 * Fetches all the starred folders metadata by their IDs.
 *
 * @param {string[]} folderIds - The IDs of the folders to fetch.
 * @param {string} userId - The ID of the user who starred the folders.
 * @returns {Promise<StarredFolderData[]>} A promise that resolves to the starred folders metadata, or an empty array if the query is empty.
 */
const handleGetStarredFoldersMetadataByFolderIds = async (folderIds: string[], userId: string) => {
  const promises = folderIds.map(async (folderId) => {
    const folderRef = doc(db, "starredFolders", `${userId}_${folderId}`);
    const folderSnapshot = await getDoc(folderRef);
    return folderSnapshot.exists() ? (JSON.parse(JSON.stringify(folderSnapshot.data())) as StarredFolderData) : null;
  });

  const foldersData = await Promise.all(promises);
  const starredFoldersMetadataResult = foldersData.filter((folder) => folder !== null) as StarredFolderData[];
  return starredFoldersMetadataResult;
};

/**
 * custom hook for searching folders in starred folders
 */
const useSearchStarredFoldersLocation = ({ shouldFetch }: UseSearchStarredFoldersLocationProps) => {
  const dispatch = useDispatch();

  // user hooks
  const { user } = useUser();
  const isUserExists = user !== null;

  // Redux state
  const { searchInputValue } = useSelector(searchBarSelector);

  //   search conditions
  const isValidSearch = searchInputValue.trim().length >= 3 && shouldFetch && isUserExists;

  /**
   * Reset search state.
   */
  const resetSearchState = useCallback(() => {
    dispatch(resetResultSearch());
  }, [dispatch]);

  const resetSearchStateWhenFetch = useCallback(() => {
    dispatch(setStatusFetchResultSearch("success"));
    dispatch(setDataResultSearch([]));
  }, [dispatch]);

  /**
   * Build query
   */
  const handleBuildQuery = useCallback(() => {
    const filesCollection = collection(db, "folders");
    const filesQuery = query(
      filesCollection,
      where("folder_name", ">=", searchInputValue),
      where("folder_name", "<=", searchInputValue + "\uf8ff"),
      orderBy("folder_name"),
      limit(7)
    );
    return filesQuery;
  }, [searchInputValue]);

  const handleGetRecentFiles = useCallback(async () => {
    try {
      dispatch(setStatusFetchResultSearch("loading"));
      if (!user) return resetSearchStateWhenFetch();

      // create query
      const querySnapshot = handleBuildQuery();
      if (!querySnapshot) return resetSearchStateWhenFetch();

      // get recent folders snapshot
      const foldersSnap = await handleGetFoldersByQuery(querySnapshot);
      if (!foldersSnap) return resetSearchStateWhenFetch();

      // extract recent folder ids
      const recentFolderIds = foldersSnap.map((folder) => folder.folder_id);

      // get user recent files meta data
      const userStarredFoldersMetadata = await handleGetStarredFoldersMetadataByFolderIds(recentFolderIds, user.uid);
      if (!userStarredFoldersMetadata) return resetSearchStateWhenFetch();

      // filter folders snapshot based on user recent folders starred meta data
      const starredFoldersIdsSet = new Set(userStarredFoldersMetadata.map((starred) => starred.folderId));
      const resultFoldersStarred = foldersSnap.filter((folder) => starredFoldersIdsSet.has(folder.folder_id));

      // mapped data for create data type
      const mappedDataType = structuredClone(resultFoldersStarred as FolderResultSearch[]);
      mappedDataType.forEach((folder) => Object.assign(folder, { resultType: "folder" }));

      // Update state with new data
      dispatch(setDataResultSearch(mappedDataType));
      dispatch(setDataLengthResultSearch(mappedDataType.length));
      dispatch(setStatusFetchResultSearch("success"));
    } catch (error) {
      console.error("Error getting recent files:", error instanceof Error ? error.message : "An unknown error occurred");
    }
  }, [dispatch, handleBuildQuery, resetSearchStateWhenFetch, user]);

  // run in useEffect
  useEffect(() => {
    if (isValidSearch) handleGetRecentFiles();
    else resetSearchState();
  }, [isValidSearch, handleGetRecentFiles, resetSearchState]);
};

export default useSearchStarredFoldersLocation;
