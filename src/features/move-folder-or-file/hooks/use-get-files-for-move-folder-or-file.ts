import useUser from "@/features/auth/hooks/use-user";
import { db } from "@/firebase/firebase-services";
import { collection, getDocs, orderBy, query, Query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { setMoveFilesData, setMoveFileStatus } from "../slice/move-folders-and-files-data-slice";
/**
 * Filters file data to ensure consistency between root and subfolder files.
 *
 * @param {RootFileGetData | SubFileGetData} file - File data to filter.
 * @returns {RootFileGetData | SubFileGetData} - Filtered file data.
 */
const handleFilteredDataFile = (file: RootFileGetData | SubFileGetData): RootFileGetData | SubFileGetData => {
  if (file.parent_folder_id) {
    return {
      ...file,
      updated_at: JSON.parse(JSON.stringify(file.updated_at)),
      created_at: JSON.parse(JSON.stringify(file.created_at)),
    } as SubFileGetData;
  }

  return {
    ...file,
    parent_folder_id: null,
    updated_at: JSON.parse(JSON.stringify(file.updated_at)),
    created_at: JSON.parse(JSON.stringify(file.created_at)),
  } as RootFileGetData;
};

/**
 * Constructs a Firestore query based on the current folder context.
 *
 * @returns {Query} - A Firestore query to fetch files from the root or subfolder.
 */
const buildQuery = (parentFolderId: string | null, userId: string): Query => {
  const filesRef = collection(db, "files");
  const isRoot = !parentFolderId;

  return isRoot
    ? query(filesRef, where("parent_folder_id", "==", null), where("owner_user_id", "==", userId), orderBy("created_at", "desc"))
    : query(filesRef, where("parent_folder_id", "==", parentFolderId), orderBy("created_at", "desc"));
};

/**
 * Fetches the files in a given folder and serializes the timestamps data for redux toolkit.
 *
 * @param {string | null} parentFolderId - The ID of the folder whose files are to be fetched, or null if fetching root files.
 * @param {string} userId - The ID of the user who is performing the action.
 * @returns {Promise<RootFileGetData[] | SubFileGetData[] | null>} A promise that resolves to the files in the folder, or null if the folder does not exist.
 */
const handleGetFilesData = async (parentFolderId: string | null, userId: string) => {
  const q = buildQuery(parentFolderId, userId);
  const fileSnapshot = await getDocs(q);
  return fileSnapshot.empty ? null : fileSnapshot.docs.map((doc) => handleFilteredDataFile(doc.data() as RootFileGetData | SubFileGetData));
};

interface UseGetFilesForMoveFolderOrFileProps {
  shouldFetch: boolean;
}

const useGetFilesForMoveFolderOrFile = ({ shouldFetch }: UseGetFilesForMoveFolderOrFileProps) => {
  const dispatch = useDispatch();
  const { user } = useUser();

  const { "0": searchParams } = useSearchParams();
  const [parentId, setParentId] = useState<string | null>(searchParams.get("parentId") || null);

  const handleGetAndUpdateParentId = useCallback(() => {
    const newParentId = searchParams.get("parentId") || null;
    if (newParentId === parentId) return;
    setParentId(newParentId);
  }, [parentId, searchParams]);

  const fetchFilesData = useCallback(async () => {
    if (!user) return;

    try {
      dispatch(setMoveFileStatus("loading"));

      const filesData = await handleGetFilesData(parentId, user.uid);
      parentId ? dispatch(setMoveFilesData(filesData as SubFileGetData[])) : dispatch(setMoveFilesData(filesData as RootFileGetData[]));

      dispatch(setMoveFileStatus("succeeded"));
    } catch (error) {
      dispatch(setMoveFileStatus("failed"));
      console.error("Error fetching file data:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [parentId, user, dispatch]);

  useEffect(() => {
    shouldFetch && fetchFilesData();
  }, [fetchFilesData, shouldFetch]);

  useEffect(() => {
    handleGetAndUpdateParentId();
  }, [handleGetAndUpdateParentId]);
};

export default useGetFilesForMoveFolderOrFile;
