import useUser from "@/features/auth/hooks/use-user";
import { db, storage } from "@/firebase/firebase-services";
import useDetectLocation from "@/hooks/use-detect-location";
import { message } from "antd";
import { deleteDoc, doc, increment, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fileOptionsSelector, setActiveAction } from "../slice/file-options-slice";
import useSecuredFolderFileActions from "@/features/permissions/hooks/use-secured-folder-file-actions";

/**
 * Deletes a file from the Firestore database and the Firebase Storage bucket.
 * @param {RootFileGetData | SubFileGetData} activeFileData - The data of the active file to be deleted.
 * @returns {Promise<void>} A promise that resolves when the file is deleted.
 */
export const handleDeleteFile = async (activeFileData: RootFileGetData | SubFileGetData) => {
  const fileDocRef = doc(db, "files", activeFileData.file_id);
  const fileStorageRef = ref(storage, `user-files/${activeFileData.file_id}/${activeFileData.file_name}`);

  const handleDecrementStorage = handleDecrementUserStorageUsage(activeFileData.root_folder_user_id, parseInt(activeFileData.file_size));
  const handleDeleteFileMetadata = deleteDoc(fileDocRef);
  const handleDeleteFileObject = deleteObject(fileStorageRef);

  await Promise.all([handleDecrementStorage, handleDeleteFileMetadata, handleDeleteFileObject]);
};

/**
 * Decrements the storage used by a user by a given size in bytes.
 * @param {string} userId - The ID of the user whose storage data is to be updated.
 * @param {number} size - The size of the file to be deducted from the user's storage usage.
 */
const handleDecrementUserStorageUsage = async (userId: string, size: number) => {
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
  const { handleCheckIsUserCanDoThisAction } = useSecuredFolderFileActions();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCancel = () => dispatch(setActiveAction(null));
  const handleConfirm = useCallback(async () => {
    if (!activeFileData || !user) return;

    try {
      const isUserCanDoThisAction = handleCheckIsUserCanDoThisAction("dowload");
      if (!isUserCanDoThisAction) return;

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
  }, [activeFileData, dispatch, isRecentlyViewedLocation, user, handleCheckIsUserCanDoThisAction]);

  return { handleCancel, handleConfirm, isLoading };
};

export default useHandleDeleteFile;
