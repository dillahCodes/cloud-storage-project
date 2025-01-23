import useUser from "@/features/auth/hooks/use-user";
import { db, storage } from "@/firebase/firebase-services";
import useDetectLocation from "@/hooks/use-detect-location";
import { message } from "antd";
import { deleteDoc, doc, increment, updateDoc } from "firebase/firestore";
import { deleteObject, getMetadata, ref } from "firebase/storage";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fileOptionsSelector, setActiveAction } from "../slice/file-options-slice";

export interface FileCostumeMetadata {
  "root-folder-owner": string;
  "file-size": string;
}

/**
 * Deletes a file from the database and storage, and decrements the storage used by the file owner based on the file's custom metadata.
 *
 * @param {RootFileGetData | SubFileGetData} activeFileData The file data to delete.
 * @returns {Promise<void>} A promise that resolves when the file has been deleted and the storage has been decremented.
 */
export const handleDeleteFile = async (activeFileData: RootFileGetData | SubFileGetData) => {
  const fileDocRef = doc(db, "files", activeFileData.file_id);
  const fileStorageRef = ref(storage, `user-files/${activeFileData.file_id}/${activeFileData.file_name}`);

  // Fetch metadata
  const fileMetadata = await getMetadata(fileStorageRef);
  const costumeMetadata = fileMetadata?.customMetadata;
  const isValidCostumeMetadata = costumeMetadata?.["root-folder-owner"] && typeof costumeMetadata?.["file-size"] === "string";

  // decrement storage used by the file owner metadata
  if (isValidCostumeMetadata) {
    const fileCustomMetadata: FileCostumeMetadata = {
      "root-folder-owner": costumeMetadata["root-folder-owner"],
      "file-size": costumeMetadata["file-size"],
    };
    await handleDecrementUserStorageUsage(fileCustomMetadata["root-folder-owner"], parseInt(fileCustomMetadata["file-size"]));
  }

  // Perform deletion
  await Promise.all([deleteDoc(fileDocRef), deleteObject(fileStorageRef)]);
};

/**
 * Decrements the storage used by a user by a given size in bytes.
 * @param {string} userId - The ID of the user whose storage data is to be updated.
 * @param {number} size - The size of the file to be deducted from the user's storage usage.
 */
export const handleDecrementUserStorageUsage = async (userId: string, size: number) => {
  const userStorageRef = doc(db, "users-storage", userId);
  await updateDoc(userStorageRef, {
    storageUsed: increment(-size),
  });
};

/**
 * Deletes a recent file record from the Firestore database.
 *
 * @param {RootFileGetData | SubFileGetData} activeFileData - The data of the active file to be deleted.
 * @param {string} userId - The ID of the user associated with the file.
 * @returns {Promise<void>} A promise that resolves when the recent file record is deleted.
 */

const handleDeleteRecentFile = async (activeFileData: RootFileGetData | SubFileGetData, userId: string) => {
  const recentFilesRef = doc(db, "recent-files", `${userId}_${activeFileData.file_id}`);
  await deleteDoc(recentFilesRef);
};

const useHandleDeleteFile = () => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { activeFileData } = useSelector(fileOptionsSelector);
  const { isRecentlyViewedLocation } = useDetectLocation();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCancel = () => dispatch(setActiveAction(null));
  const handleConfirm = useCallback(async () => {
    if (!activeFileData || !user) return;

    try {
      setIsLoading(true);
      isRecentlyViewedLocation ? await handleDeleteRecentFile(activeFileData, user.uid) : await handleDeleteFile(activeFileData);

      message.open({
        type: "success",
        content: "File deleted successfully.",
        className: "font-archivo text-sm",
        key: "file-delete-success",
        onClose: () => isRecentlyViewedLocation && window.location.reload(),
      });

      setIsLoading(false);
      dispatch(setActiveAction(null));
    } catch (error) {
      console.error("Error deleting file:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [activeFileData, dispatch, isRecentlyViewedLocation, user]);

  return { handleCancel, handleConfirm, isLoading };
};

export default useHandleDeleteFile;
