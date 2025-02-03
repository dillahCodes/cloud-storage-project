import { FirebaseUserData } from "@/features/auth/auth";
import useUser from "@/features/auth/hooks/use-user";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import handleCheckIsStorageAvailable from "@/features/storage/handle-check-is-storage-available";
import { db, storage } from "@/firebase/firebase-services";
import { Dispatch } from "@reduxjs/toolkit";
import { message } from "antd";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { ref, updateMetadata } from "firebase/storage";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, dekstopMoveSelector, resetDektopMoveState, setDekstopMoveStatus } from "../slice/dekstop-move-slice";
import { moveFoldersAndFilesDataSelector } from "../slice/move-folders-and-files-data-slice";

interface HandleUpdateFileMetadataInFireabseStorage {
  fileName: string;
  fileId: string;
  rootFolderOwner: string | null;
}

interface HandleChangeSubFileMetadata {
  fileId: string;
  parentFolderData: RootFolderGetData | SubFolderGetData;
  fileWillBeMoved: RootFileGetData | SubFileGetData;
}

interface HandleChangeFileMetadataToRootFile {
  fileId: string;
  newRootFolderUserId: string;
  fileWillBeMoved: RootFileGetData | SubFileGetData;
}

interface HandleValidationMoveFile {
  user: FirebaseUserData | null;

  fileId: string | null;
  fileWillBeMoved: RootFileGetData | SubFileGetData | null;

  parentFolderData: RootFolderGetData | SubFolderGetData | null;
  filesData: RootFileGetData[] | SubFileGetData[] | null;

  dispatch: Dispatch;
  isStorageAvailable: boolean;
}

interface HandleChangeUserStorageSize {
  userId: string;
  size: number;
  mode: "increment" | "decrement";
}

/**
 * Updates the storage used by a user by a given size in bytes.
 * @param {string} userId - The ID of the user whose storage data is to be updated.
 * @param {number} size - The size of the file to be added or subtracted from the user's storage usage.
 * @param {"increment" | "decrement"} mode - The mode of the update operation. If set to "increment", the size will be added to the user's storage used. If set to "decrement", the size will be subtracted from the user's storage used.
 */
const handleChangeUserStorageSize = async ({ mode, size, userId }: HandleChangeUserStorageSize) => {
  const userStorageRef = doc(db, "users-storage", userId);
  await updateDoc(userStorageRef, {
    storageUsed: mode === "increment" ? increment(size) : increment(-size),
  });
};

/**
 * Updates the root-folder-owner custom metadata of the file in Firebase Storage to the given rootFolderOwner.
 * @param {HandleUpdateFileMetadataInFireabseStorage} params - An object containing the fileId and fileName of the file to update, and the rootFolderOwner to update the root-folder-owner custom metadata to.
 */
const handleUpdateFileMetadataInFirebaseStorage = async ({ fileId, fileName, rootFolderOwner }: HandleUpdateFileMetadataInFireabseStorage) => {
  const fileRef = ref(storage, `user-files/${fileId}/${fileName}`);
  const newMetadata = {
    customMetadata: {
      "root-folder-owner": rootFolderOwner || "",
    },
  };
  await updateMetadata(fileRef, newMetadata);
};

/**
 * Fetches a file by its ID and serializes its data for use in the React store.
 *
 * @param {string} fileId - The ID of the file to fetch.
 * @returns {Promise<RootFileGetData | SubFileGetData | null>} A promise that resolves to the file data, or null if the file does not exist.
 */
const handleGetFileInFireabseFirestore = async (fileId: string) => {
  const fileDoc = doc(db, "files", fileId);
  const fileSnap = await getDoc(fileDoc);
  return fileSnap.exists() ? (JSON.parse(JSON.stringify(fileSnap.data())) as RootFileGetData | SubFileGetData) : null;
};

/**
 * Updates the root_folder_user_id of a file in Firebase Firestore to the given new root folder user ID.
 * If the root_folder_user_id of the file is different from the given new root folder user ID, it will also decrement the storageUsed of the old root folder user and increment the storageUsed of the new root folder user by the size of the file.
 * @param {HandleChangeSubFileMetadata} params - An object containing the fileId of the file to update, the parentFolderData of the folder to move the file to, and the fileWillBeMoved which contains the file data to update.
 */
const handleChangeSubFileMetadata = async ({ fileId, parentFolderData, fileWillBeMoved }: HandleChangeSubFileMetadata) => {
  const fileRef = doc(db, "files", fileId);

  const isDifferentRootFolderOwner: boolean = fileWillBeMoved.root_folder_user_id !== parentFolderData.root_folder_user_id;
  const oldRootFolderOwner: string = fileWillBeMoved.root_folder_user_id;
  const newRootFolderOwner: string = parentFolderData.root_folder_user_id;

  const updatePromises = [];

  if (isDifferentRootFolderOwner) {
    updatePromises.push(
      handleChangeUserStorageSize({ mode: "decrement", size: parseInt(fileWillBeMoved.file_size), userId: oldRootFolderOwner }),
      handleChangeUserStorageSize({ mode: "increment", size: parseInt(fileWillBeMoved.file_size), userId: newRootFolderOwner })
    );
  }

  updatePromises.push(
    updateDoc(fileRef, {
      root_folder_user_id: newRootFolderOwner,
      parent_folder_id: parentFolderData.folder_id,
    })
  );

  await Promise.all(updatePromises);
};

/**
 * Updates the metadata of a file in Firebase Firestore by changing its root_folder_user_id to a new value.
 * If the new root_folder_user_id is different from the current one, it also updates the storage usage for
 * both the old and new root folder users by the size of the file.
 *
 * @param {HandleChangeFileMetadataToRootFile} params - An object containing:
 *   - fileId: The ID of the file to update.
 *   - fileWillBeMoved: The file data including the current root_folder_user_id and file size.
 *   - newRootFolderUserId: The new root folder user ID to assign to the file.
 */

const handleChangeFileMetadataToRootFile = async ({ fileId, fileWillBeMoved, newRootFolderUserId }: HandleChangeFileMetadataToRootFile) => {
  const fileRef = doc(db, "files", fileId);

  const isDifferentRootFolderOwner = fileWillBeMoved.root_folder_user_id !== newRootFolderUserId;
  const oldRootFolderOwner = fileWillBeMoved.root_folder_user_id;
  const newRootFolderOwner = newRootFolderUserId;

  const updatePromises = [];

  if (isDifferentRootFolderOwner) {
    updatePromises.push(
      handleChangeUserStorageSize({ mode: "decrement", size: parseInt(fileWillBeMoved.file_size), userId: oldRootFolderOwner }),
      handleChangeUserStorageSize({ mode: "increment", size: parseInt(fileWillBeMoved.file_size), userId: newRootFolderOwner })
    );
  }

  updatePromises.push(updateDoc(fileRef, { root_folder_user_id: newRootFolderOwner, parent_folder_id: null }));
  await Promise.all(updatePromises);
};

/**
 * Validates the move file operation based on the given parameters.
 *
 * This function checks for the following conditions:
 * - User is authenticated
 * - File exists
 * - User is the file owner
 * - File is not being moved to a location that the user does not have permission to access
 * - File does not already exist in the destination
 *
 * If any of these conditions fail, it dispatches an error message and sets the
 * desktop move status to "error". If all conditions pass, it returns true.
 *

 * @param {HandleValidationMoveFile} param - An object containing the user object, 
  file ID, file data, isSubSharedWithMeLocation boolean, parent folder data, array of file data, and dispatch function.
 * @returns {boolean} True if the validation passes, false otherwise.
 */
const handleValidationMoveFile = (param: HandleValidationMoveFile): boolean => {
  const { user, fileId, fileWillBeMoved, parentFolderData, filesData, dispatch, isStorageAvailable } = param;

  const isInvalidFile = !fileWillBeMoved;
  const isFileExist = !!filesData?.some((file) => file.file_id === fileId);

  const isNotFileOwner: boolean = user!.uid !== fileWillBeMoved!.owner_user_id;

  const isRootMoveFolderOrFileLocation: boolean = !parentFolderData;
  const isSubMoveFolderOrFileLocation: boolean = Boolean(parentFolderData) && !isRootMoveFolderOrFileLocation;
  const isSubMoveSameRootFolder: boolean = isSubMoveFolderOrFileLocation && parentFolderData?.root_folder_id === fileWillBeMoved?.root_folder_id;

  const isRootMoveNotOwner = isRootMoveFolderOrFileLocation && isNotFileOwner;
  const isSubMoveNotOwner = isSubMoveFolderOrFileLocation && isNotFileOwner && !isSubMoveSameRootFolder;

  /**
   * storage not enough message
   */
  const createStorageMessage: string = `${parentFolderData?.root_folder_user_id === user!.uid ? "Your" : "owner"} storage is full`;

  // define conditions
  const conditions = [
    {
      condition: !user,
      message: "Something went wrong, please try again.",
    },
    {
      condition: isInvalidFile,
      message: "File not found.",
    },
    {
      condition: isRootMoveNotOwner || isSubMoveNotOwner,
      message: "Only file owner can move to this location.",
    },
    {
      condition: isFileExist,
      message: "File already exists.",
    },
    {
      condition: !isStorageAvailable,
      message: createStorageMessage,
    },
    // add new conditions from here
  ];

  // find first failed validation
  const failedValidation = conditions.find((validation) => validation.condition);

  if (failedValidation) {
    dispatch(setDekstopMoveStatus("error"));
    message.open({ type: "error", content: failedValidation.message, className: "font-archivo text-sm" });
    return false;
  }
  return true;
};

const useConfirmDekstopMoveFile = () => {
  const dispatch = useDispatch();
  /**
   * parent folder and file state
   */
  const { fileName, fileId } = useSelector(dekstopMoveSelector);
  const { parentFolderData, filesData } = useSelector(moveFoldersAndFilesDataSelector);
  const { user } = useUser();

  /**
   * handle confirm move file
   */
  const handleConfirmDekstopMoveFile = useCallback(async () => {
    try {
      dispatch(setDekstopMoveStatus("loading"));
      dispatch(closeModal());

      /**
       * validate before move file
       */
      const fileWillBeMoved: RootFileGetData | SubFileGetData | null = await handleGetFileInFireabseFirestore(fileId || "");

      /**
       * check is storge enough
       */
      const isStorageAvailable = await handleCheckIsStorageAvailable({ parentFolderData });

      const validations: boolean = handleValidationMoveFile({
        fileWillBeMoved,
        user,
        fileId,
        parentFolderData,
        filesData,
        dispatch,
        isStorageAvailable,
      });
      if (!validations) return;

      /**
       * update file metadata
       */
      parentFolderData
        ? await handleChangeSubFileMetadata({ fileId: fileId!, parentFolderData, fileWillBeMoved: fileWillBeMoved! })
        : await handleChangeFileMetadataToRootFile({ fileId: fileId!, fileWillBeMoved: fileWillBeMoved!, newRootFolderUserId: user!.uid });

      /**
       * update file storage metadata
       */
      await handleUpdateFileMetadataInFirebaseStorage({ fileId: fileId!, fileName: fileName!, rootFolderOwner: user!.uid });
      dispatch(setDekstopMoveStatus("success"));
      dispatch(resetDektopMoveState());

      message.open({
        type: "success",
        content: "File moved successfully.",
        className: "font-archivo text-sm",
        key: "file-move-success-message",
      });
    } catch (error) {
      dispatch(setDekstopMoveStatus("error"));
      console.error("error while move file: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  }, [fileId, parentFolderData, user, dispatch, filesData, fileName]);

  return { handleConfirmDekstopMoveFile };
};

export default useConfirmDekstopMoveFile;
