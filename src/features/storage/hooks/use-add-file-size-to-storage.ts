import useUser from "@/features/auth/hooks/use-user";
import { parentFolderSelector } from "@/features/folder/slice/parent-folder-slice";
import { db } from "@/firebase/firebase-services";
import useDetectLocation from "@/hooks/use-detect-location";
import { message } from "antd";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { useCallback } from "react";
import { useSelector } from "react-redux";

interface HandleUploadFileToStorageParams {
  file: File;
}

interface HandleCheckAvailableStorageParams {
  condition: boolean;
  message: string;
}

/**
 * Updates the user's storage data by incrementing the storage used with the given file size.
 *
 * @param fileSize - The size of the file to add to the user's storage usage.
 * @param userId - The ID of the user whose storage data is to be updated.
 */

const handleAddFileSize = async (fileSize: number, userId: string) => {
  const userStorageRef = doc(db, "users-storage", userId);
  await updateDoc(userStorageRef, {
    storageUsed: increment(fileSize),
  });
};

const handleGetUserStorageData = async (userId: string) => {
  const userStorageRef = doc(db, "users-storage", userId);
  const userStorageSnap = await getDoc(userStorageRef);
  const isStorageDataExist = userStorageSnap.exists();

  if (!isStorageDataExist) {
    return null;
  } else {
    return userStorageSnap.data() as StorageData;
  }
};

const useAddFileSizeToStorage = () => {
  const { user } = useUser();
  const { parentFolderData } = useSelector(parentFolderSelector);

  const { isMystorageLocation, isSubMyStorageLocation, isSubSharedWithMeLocation } = useDetectLocation();
  const isSubUserLocation = (isSubMyStorageLocation || isSubSharedWithMeLocation) && parentFolderData;

  const handleCheckAvailableStorage = useCallback(
    async (fileSize: number, userId: string): Promise<boolean> => {
      const isUserNotExist: boolean = !user;

      /**
       * storage condition
       */
      const userStorageData = await handleGetUserStorageData(userId);
      const isNotEnoughStorage: boolean = userStorageData!.storageUsed + fileSize > parseInt(import.meta.env.VITE_USE_STORAGE_CAPACITY);

      /**
       * location condition
       */
      const isSharedFolder: boolean = Boolean(parentFolderData && parentFolderData.root_folder_user_id !== user!.uid);

      /**
       * folder condition
       */
      const isMyRootNotEnoughStorage: boolean = isNotEnoughStorage && !parentFolderData && isMystorageLocation;
      const isMySubFolderNotEnoughStorage: boolean = isNotEnoughStorage && isSubMyStorageLocation;
      const isSharedFolderNotEnoughStorage: boolean = isNotEnoughStorage && isSharedFolder && isSubSharedWithMeLocation;

      const conditions: HandleCheckAvailableStorageParams[] = [
        {
          condition: isUserNotExist,
          message: "Something went wrong, Please Login again",
        },
        {
          condition: isMyRootNotEnoughStorage || isMySubFolderNotEnoughStorage,
          message: "Your storage is full",
        },
        {
          condition: isSharedFolderNotEnoughStorage,
          message: "Owner storage is full",
        },
      ];

      const isErrorCondition = conditions.find((condition) => condition.condition);

      if (isErrorCondition) {
        message.open({
          type: "error",
          content: isErrorCondition.message,
          className: "font-archivo text-sm",
          key: "not-enough-storage",
        });
        setTimeout(() => message.destroy("not-enough-storage"), 3000);
        return false;
      }

      return true;
    },
    [parentFolderData, user, isMystorageLocation, isSubMyStorageLocation, isSubSharedWithMeLocation]
  );

  const handleUploadFileSizeToStorage = useCallback(
    async (params: HandleUploadFileToStorageParams) => {
      const { file } = params;
      if (!user) return;

      try {
        if (isMystorageLocation) await handleAddFileSize(file.size, user.uid);
        if (isSubUserLocation) await handleAddFileSize(file.size, parentFolderData.root_folder_user_id);
      } catch (error) {
        console.error("error while updating storage data", error instanceof Error ? error.message : error);
      }
    },
    [isSubUserLocation, isMystorageLocation, user, parentFolderData]
  );

  return { handleUploadFileSizeToStorage, handleCheckAvailableStorage };
};
export default useAddFileSizeToStorage;
