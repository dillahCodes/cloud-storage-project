import { auth, db } from "@/firebase/firebase-serices";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { useCallback, useEffect } from "react";
import { RootFolderGetData, SharedWithMeData, SubFolderGetData } from "../folder";
import useCurrentFolderSetState from "./use-current-folder-setstate";

interface UseGetSharedWithMeFolderDataProps {
  shouldFetch: boolean;
}

/**
 * Hook to get shared with me folder data.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.shouldFetch - Flag to determine if data should be fetched.
 */
const useGetSharedWithMeFolderData = ({ shouldFetch }: UseGetSharedWithMeFolderDataProps) => {
  const { setFolders, setStatus } = useCurrentFolderSetState();

  /**
   * Fetches all shared with me folder data.
   *
   * @returns {Promise<void>} A promise that resolves when the data is fetched.
   */
  const handleGetAllSharedWithMeFolderData = useCallback(async () => {
    try {
      setStatus("loading");
      const sharedFolderQuery = handleBuildQuery();
      const sharedFolderResult = await getDocs(sharedFolderQuery!);
      const sharedFolderList = sharedFolderResult.docs.map((doc) => handleSerializeSharedFoldersData(doc));
      const sharedFolderIdList = sharedFolderList.map((folder) => folder.folderId);

      if (!sharedFolderIdList) return;

      const sharedFolderData = await handleGetAllFolderDataById(sharedFolderIdList);
      const sharedFolderDataSerialized = sharedFolderData.map((folder) => handleSerializeFoldersData(folder));

      setFolders(sharedFolderDataSerialized as RootFolderGetData[] | SubFolderGetData[]);
      setStatus("succeded");
    } catch (error) {
      setStatus("failed");
      console.error("Error fetching shared with me folder data: ", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [setStatus, setFolders]);

  useEffect(() => {
    if (!shouldFetch) return;
    handleGetAllSharedWithMeFolderData();
  }, [shouldFetch, handleGetAllSharedWithMeFolderData]);
};

export default useGetSharedWithMeFolderData;

/**
 * Serializes folder data.
 *
 * @param {SubFolderGetData | RootFolderGetData} data - The folder data to serialize.
 * @returns {SubFolderGetData | RootFolderGetData} The serialized folder data.
 */
const handleSerializeFoldersData = (data: SubFolderGetData | RootFolderGetData) => {
  const folderDataSerialized = {
    ...data,
    created_at: JSON.parse(JSON.stringify(data.created_at)),
    updated_at: data.updated_at ? JSON.parse(JSON.stringify(data.updated_at)) : null,
  } as RootFolderGetData | SubFolderGetData;

  return folderDataSerialized;
};

/**
 * Serializes shared folder data.
 *
 * @param {QueryDocumentSnapshot<DocumentData>} data - The shared folder data to serialize.
 * @returns {SharedWithMeData} The serialized shared folder data.
 */
const handleSerializeSharedFoldersData = (data: QueryDocumentSnapshot<DocumentData>) => {
  const sharedFolderSerialize = {
    ...data.data(),
    createdAt: JSON.parse(JSON.stringify(data.data().createdAt)),
    updatedAt: data.data().updatedAt ? JSON.parse(JSON.stringify(data.data().updated_at)) : null,
  } as SharedWithMeData;

  return sharedFolderSerialize;
};

/**
 * Builds the query to fetch shared with me folders.
 *
 * @returns {Query<DocumentData> | null} The query to fetch shared with me folders or null if no current user.
 */
const handleBuildQuery = () => {
  const { currentUser } = auth;
  const folderSharedWithMeRef = collection(db, "sharedWithMeFolders");

  if (!currentUser) return null;

  const folderSharedWithMeQuery = query(folderSharedWithMeRef, orderBy("createdAt", "desc"), where("userId", "==", currentUser.uid));

  return folderSharedWithMeQuery;
};

/**
 * Deletes the starred folder by its ID.
 *
 * @param {string} folderId - The ID of the folder to delete.
 * @returns {Promise<void>} A promise that resolves when the folder has been deleted.
 */
const handleDeleteStarredFolderById = async (folderId: string): Promise<void> => {
  const { currentUser } = auth;
  if (!currentUser) return;

  const folderRef = doc(db, "sharedWithMeFolders", `${currentUser.uid}_${folderId}`);
  await deleteDoc(folderRef);
};

/**
 * Fetches all folder data by their IDs.
 *
 * @param {string[]} folderIds - The IDs of the folders to fetch.
 * @returns {Promise<SubFolderGetData[]>} A promise that resolves to the folder data.
 */
const handleGetAllFolderDataById = async (folderIds: string[]) => {
  const promises = folderIds.map(async (folderId: string) => {
    const folderRef = doc(db, "folders", folderId);
    const folderSnapshot = await getDoc(folderRef);

    if (!folderSnapshot.exists()) await handleDeleteStarredFolderById(folderId);

    return folderSnapshot.exists() ? (folderSnapshot.data() as SubFolderGetData) : null;
  });

  const folderData = await Promise.all(promises);
  return folderData.filter((folder) => folder !== null) as SubFolderGetData[];
};
