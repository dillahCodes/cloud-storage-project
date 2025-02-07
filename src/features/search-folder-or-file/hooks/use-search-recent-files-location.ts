import useUser from "@/features/auth/hooks/use-user";
import { db } from "@/firebase/firebase-services";
import { collection, doc, DocumentData, getDoc, getDocs, limit, orderBy, Query, query, where } from "firebase/firestore";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileSearchResult } from "../search";
import {
  resetResultSearch,
  setDataLengthResultSearch,
  setDataResultSearch,
  setStatusFetchResultSearch,
} from "../slice/result-search-slice";
import { searchBarSelector } from "../slice/search-bar-slice";
import { RecentFile, RootFileGetData, SubFileGetData } from "@/features/file/file";

interface UseSearchRecentFilesLocationProps {
  shouldFetch: boolean;
}

/**
 * Fetches all the files in the given query and serializes the results for use in the React store.
 *
 * @param {Query<DocumentData, DocumentData>} query - The Firestore query to execute.
 * @returns {Promise<(SubFileGetData | RootFileGetData)[]>} A promise that resolves to the files in the query, or an empty array if the query is empty.
 */

const handleGetFilesByQuery = async (query: Query<DocumentData, DocumentData>) => {
  const filesSnaphot = await getDocs(query);
  const fileResult = filesSnaphot.empty
    ? []
    : filesSnaphot.docs.map((doc) => JSON.parse(JSON.stringify(doc.data())) as SubFileGetData | RootFileGetData);
  return fileResult;
};

/**
 * Fetches the recent files by given file ids and serializes the results for use in the React store.
 *
 * @param {string[]} fileIds - The IDs of the files to fetch.
 * @param {string} userId - The ID of the user who is performing the action.
 * @returns {Promise<RecentFile[]>} A promise that resolves to the recent files in the query, or an empty array if the query is empty.
 */
const handleGetRecentFilesByFileIds = async (fileIds: string[], userId: string) => {
  const promises = fileIds.map(async (fileId) => {
    const fileRef = doc(db, "recent-files", `${userId}_${fileId}`);
    const fileSnap = await getDoc(fileRef);
    return fileSnap.exists() ? (JSON.parse(JSON.stringify(fileSnap.data())) as RecentFile) : null;
  });

  const filesData = await Promise.all(promises);
  const sharedFoldersMetadataNullFiltered = filesData.filter((file) => file !== null) as RecentFile[];
  return sharedFoldersMetadataNullFiltered;
};

/**
 * custom hook for searching files in recent files location
 */
const useSearchRecentFilesLocation = ({ shouldFetch }: UseSearchRecentFilesLocationProps) => {
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
    const filesCollection = collection(db, "files");
    const filesQuery = query(
      filesCollection,
      where("file_name", ">=", searchInputValue),
      where("file_name", "<=", searchInputValue + "\uf8ff"),
      orderBy("file_name"),
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

      // get recent files snapshot
      const recentFilesSnapshot = await handleGetFilesByQuery(querySnapshot);
      if (!recentFilesSnapshot) return resetSearchStateWhenFetch();

      // extract recent filesIds
      const recentFilesIds = recentFilesSnapshot.map((file) => file.file_id);

      // get user recent files meta data
      const userRecentFilesMetadata = await handleGetRecentFilesByFileIds(recentFilesIds, user.uid);
      if (!recentFilesSnapshot) return resetSearchStateWhenFetch();

      // filter recent file snapshot based on user recent files meta data
      const recentFilesIdsSet = new Set(userRecentFilesMetadata.map((shared) => shared.fileId));
      const resultRecentFiles = recentFilesSnapshot.filter((file) => recentFilesIdsSet.has(file.file_id));

      // mapped data for create data type
      const mappedDataType = structuredClone(resultRecentFiles as FileSearchResult[]);
      mappedDataType.forEach((file) => Object.assign(file, { resultType: "file" }));

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

export default useSearchRecentFilesLocation;
