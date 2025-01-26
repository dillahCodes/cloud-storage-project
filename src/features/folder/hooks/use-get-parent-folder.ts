import { resetBreadcrumb } from "@/features/breadcrumb/slice/breadcrumb-slice";
import { db } from "@/firebase/firebase-services";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SubFolderGetData } from "../folder";
import { setParentFolder, setParentFolderStatus } from "../slice/parent-folder-slice";

interface UseGetParentFolderProps {
  shouldFetch: boolean;
  folderId: string | undefined;
}

/**
 * Fetches parent folder data by its ID.
 *
 * @param {string} folderId - The ID of the folder to fetch.
 * @returns {Promise<SubFolderGetData | null>} A promise that resolves to the folder data, or null if the folder does not exist.
 */

const handleGetParentFolderData = async (folderId: string) => {
  const folderRef = doc(db, "folders", folderId);
  const folderSnapshot = await getDoc(folderRef);
  return folderSnapshot.exists() ? (JSON.parse(JSON.stringify(folderSnapshot.data())) as SubFolderGetData) : null;
};

const useGetParentFolder = ({ shouldFetch, folderId }: UseGetParentFolderProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isValidFolderId = useMemo(() => folderId && folderId.trim() !== "", [folderId]);

  /**
   * handle process parent folder if exists
   */
  const handleParentFolderExists = useCallback(
    (parentFolderData: SubFolderGetData) => {
      dispatch(setParentFolder({ isValidParentFolder: true, parentFolderData }));
    },
    [dispatch]
  );

  /**
   * handle process parent folder if not exists
   */
  const handleParentFolderNotExists = useCallback(() => {
    dispatch(resetBreadcrumb());
    navigate("/not-found", { replace: true, state: { message: "Folder not found." } });
    dispatch(setParentFolderStatus("failed"));
  }, [dispatch, navigate]);

  /**
   * handle process and fetch parent folder data
   */
  const handleProcessParentFolderData = useCallback(async () => {
    if (!isValidFolderId) return;

    try {
      const parentFolderData = await handleGetParentFolderData(folderId!);
      parentFolderData ? handleParentFolderExists(parentFolderData) : handleParentFolderNotExists();
    } catch (error) {
      console.error("Error processing parent folder data:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [folderId, isValidFolderId, handleParentFolderExists, handleParentFolderNotExists]);

  /**
   * fetch parent folder data on mount
   */
  useEffect(() => {
    if (shouldFetch && isValidFolderId) handleProcessParentFolderData();
  }, [handleProcessParentFolderData, shouldFetch, isValidFolderId]);
};

export default useGetParentFolder;
