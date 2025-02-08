import { FirebaseUserData } from "@/features/auth/auth";
import useUser from "@/features/auth/hooks/use-user";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { db, storage } from "@/firebase/firebase-services";
import useDetectLocation from "@/hooks/use-detect-location";
import abbreviateText from "@/util/abbreviate-text";
import { Dispatch } from "@reduxjs/toolkit";
import { message } from "antd";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { ref, updateMetadata } from "firebase/storage";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  mobileMoveSelector,
  resetMobileMoveState,
  setMobileMoveFolderMoveErrorMessage,
  setMobileMoveStatus,
} from "../slice/mobile-move-slice";
import { moveFoldersAndFilesDataSelector, resetMoveDataState } from "../slice/move-folders-and-files-data-slice";
import { resetFileOptions } from "@/features/file/slice/file-options-slice";
import handleCheckIsStorageAvailable from "@/features/storage/handle-check-is-storage-available";
import { RootFileGetData, SubFileGetData } from "@/features/file/file";

interface HandleValidateBeforeMoveFile {
  fileWillBeMoved: RootFileGetData | SubFileGetData | null;
  user: FirebaseUserData | null;

  fileId: string | null;
  filesData: RootFileGetData[] | SubFileGetData[] | null;

  moveFromLocationPath: string | null;
  parentFolderData: RootFolderGetData | SubFolderGetData | null;

  isSubMovePage: boolean;
  isRootMovePage: boolean;

  dispatch: Dispatch;
  navigate: NavigateFunction;
  isStorageAvailable: boolean;
}

interface HandleChangeSubFileMetadata {
  fileId: string;
  fileWillBeMoved: RootFileGetData | SubFileGetData;
  parentFolderData: RootFolderGetData | SubFolderGetData;
}

interface HandleChangeFileMetadataToRootFile {
  fileId: string;
  newRootFolderUserId: string;
  fileWillBeMoved: RootFileGetData | SubFileGetData;
}

interface HandleNavigateAfterMovedToSubFolder {
  parentFolderData: RootFolderGetData | SubFolderGetData;
  user: FirebaseUserData;
  navigate: NavigateFunction;
}

interface HandleUpdateFileMetadataInFireabseStorage {
  fileName: string;
  fileId: string;
  rootFolderOwner: string | null;
}

interface HandleChangeUserStorageSize {
  userId: string;
  size: number;
  mode: "increment" | "decrement";
}

const MOBILE_SUCCESS_KEY = "file-move-success-message";

/**
 * Fetches a file by its ID and serializes its data for use in the React store.
 *
 * @param {string} fileId - The ID of the file to fetch.
 * @returns {Promise<RootFileGetData | SubFileGetData | null>} A promise that resolves to the file data, or null if the file does not exist.
 */
const handleGetFileById = async (fileId: string) => {
  const docRef = doc(db, "files", fileId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (JSON.parse(JSON.stringify(docSnap.data())) as SubFileGetData | RootFileGetData) : null;
};

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
 * Updates the root_folder_user_id of the file with the given fileId to the given parentFolderData.root_folder_user_id.
 * If the root_folder_user_id of the file is different from the given parentFolderData.root_folder_user_id, it will also decrement the storageUsed of the old root folder user and increment the storageUsed of the new root folder user by the size of the file.
 * @param {HandleChangeSubFileMetadata} params - An object containing the fileId of the file to update, the parentFolderData of the folder to move the file to, and the fileWillBeMoved which contains the file data to update.
 */
const handleChangeSubFileMetadata = async ({ fileId, parentFolderData, fileWillBeMoved }: HandleChangeSubFileMetadata) => {
  const fileRef = doc(db, "files", fileId);

  const isDifferentRootFolderOwner = fileWillBeMoved.root_folder_user_id !== parentFolderData.root_folder_user_id;
  const oldRootFolderOwner = fileWillBeMoved.root_folder_user_id;
  const newRootFolderOwner = parentFolderData.root_folder_user_id;

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
 * Updates the root_folder_user_id of the file with the given fileId to the given newRootFolderUserId.
 * If the root_folder_user_id of the file is different from the given newRootFolderUserId, it will also decrement the storageUsed of the old root folder user and increment the storageUsed of the new root folder user by the size of the file.
 * @param {HandleChangeFileMetadataToRootFile} params - An object containing the fileId of the file to update, the newRootFolderUserId to update the root_folder_user_id to, and the fileWillBeMoved which contains the file data to update.
 */
const handleChangeFileMetadataToRootFile = async ({
  fileId,
  newRootFolderUserId,
  fileWillBeMoved,
}: HandleChangeFileMetadataToRootFile) => {
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
 * Navigates to the appropriate folder location after a file move operation to a subfolder.
 *
 * This function checks the current user's authentication status and the
 * destination folder's data to determine the correct navigation path. If the
 * user is not authenticated, it navigates to their storage root. If the folder
 * is moved to the root, it navigates to the user's storage root. If moved to
 * a subfolder, it navigates to the subfolder's path, differentiating between
 * the user's own storage and shared storage based on folder ownership.
 *
 * @param {HandleNavigateAfterMovedToSubFolder} params - An object containing the parentFolderData of the folder to move the file to, the user object, and the navigate function to change routes.
 */
const handleNavigateAfterMovedToSubFolder = ({ parentFolderData, user, navigate }: HandleNavigateAfterMovedToSubFolder) => {
  const isRootFolderMine = parentFolderData.root_folder_user_id === user.uid;
  const navigateUrl = `/storage/folders/${parentFolderData!.folder_id}?st=${isRootFolderMine ? "my-storage" : "shared-with-me"}`;
  navigate(navigateUrl);
};

/**
 * Updates the root-folder-owner custom metadata of the file in Firebase Storage to the given rootFolderOwner.
 * @param {HandleUpdateFileMetadataInFireabseStorage} params - An object containing the fileId and fileName of the file to update, and the rootFolderOwner to update the root-folder-owner custom metadata to.
 */
const handleUpdateFileMetadataInFirebaseStorage = async ({
  fileId,
  fileName,
  rootFolderOwner,
}: HandleUpdateFileMetadataInFireabseStorage) => {
  const fileRef = ref(storage, `user-files/${fileId}/${fileName}`);
  const newMetadata = {
    customMetadata: {
      "root-folder-owner": rootFolderOwner || "",
    },
  };
  await updateMetadata(fileRef, newMetadata);
};

/**
 * Validates the user's authentication status and the destination folder's data
 * before moving a file. The validation checks if the user is authenticated,
 * if the file exists, if the user is the file owner, if the destination is a
 * subfolder or the root, and if the file already exists in the destination.
 * If the validation fails, it shows an error message and navigates the user
 * back to the move-from location.
 *
 * @param {HandleValidateBeforeMoveFile} params - An object containing the
 * user object, dispatch function, move-from location path, navigate function,
 * parent folder data, isSubMovePage boolean, isRootMovePage boolean, file ID,
 * files data, and file data.
 * @returns {boolean} - True if the validation passes, false otherwise.
 */
const handleValidateBeforeMoveFile = async (params: HandleValidateBeforeMoveFile) => {
  const {
    user,
    dispatch,
    moveFromLocationPath,
    navigate,
    parentFolderData,
    isSubMovePage,
    isRootMovePage,
    fileId,
    filesData,
    fileWillBeMoved,
    isStorageAvailable,
  } = params;

  /**
   * user, sub move validation,  root move condition, and check file exist
   */
  const isUserNotExist: boolean = !user;
  const isInvalidSubMove: boolean = !parentFolderData && isSubMovePage;
  const isInvalidRootMove: boolean = Boolean(parentFolderData && isRootMovePage);
  const isFileExist: boolean = !!filesData?.some((file) => file.file_id === fileId);

  /**
   * file owner validation and root folder mine condition
   */
  const isNotFileOwner: boolean = fileWillBeMoved?.owner_user_id !== user?.uid;

  const isRootMoveFolderOrFileLocation: boolean = !parentFolderData;
  const isSubMoveFolderOrFileLocation: boolean = Boolean(parentFolderData) && !isRootMoveFolderOrFileLocation;
  const isSubMoveSameRootFolder: boolean =
    isSubMoveFolderOrFileLocation && parentFolderData?.root_folder_id === fileWillBeMoved?.root_folder_id;

  const isRootMoveNotOwner = isRootMoveFolderOrFileLocation && isNotFileOwner;
  const isSubMoveNotOwner = isSubMoveFolderOrFileLocation && isNotFileOwner && !isSubMoveSameRootFolder;

  /**
   * storage not enough message
   */
  const createStorageMessage: string = `${
    parentFolderData?.root_folder_user_id === user!.uid ? "Your" : "owner"
  } storage is full`;

  const validations = [
    { condition: !fileId, message: "file not found, please try again" },
    { condition: isUserNotExist, message: "something went wrong, please try again" },
    { condition: isInvalidSubMove, message: "something went wrong, please try again" },
    { condition: isInvalidRootMove, message: "something went wrong, please try again" },
    { condition: !fileWillBeMoved, message: "file not found, please try again" },
    { condition: isFileExist, message: "file already exists" },
    { condition: isRootMoveNotOwner || isSubMoveNotOwner, message: "Only file owner can move to this location." },
    { condition: !isStorageAvailable, message: createStorageMessage },
  ];

  /**
   * failed validation
   */
  const failedValidation = validations.find((validation) => validation.condition);

  /**
   * error message
   */
  if (failedValidation) {
    message.open({ type: "error", content: failedValidation.message, className: "font-archivo text-sm" });
    dispatch(setMobileMoveFolderMoveErrorMessage(failedValidation.message));
    navigate(moveFromLocationPath || "/storage/my-storage");
    return false;
  }

  return true;
};

const useConfirmMobileMoveFile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useUser();
  const { fileId, fileName, moveFromLocationPath } = useSelector(mobileMoveSelector);
  const { parentFolderData, filesData } = useSelector(moveFoldersAndFilesDataSelector);
  const { isRootMoveFolderOrFileLocation, isSubMoveFolderOrFileLocation } = useDetectLocation();

  // Helper: Show success message
  const showSuccess = useCallback((content: string) => {
    message.open({
      type: "success",
      content,
      className: "font-archivo text-sm capitalize",
      key: MOBILE_SUCCESS_KEY,
    });
  }, []);

  const handleMoveFileToSubFolder = useCallback(
    async (fileWillBeMoved: RootFileGetData | SubFileGetData) => {
      /**
       * Set the loading state and validate before moving the file.
       */
      dispatch(setMobileMoveStatus("loading"));

      /**
       * Update the file metadata and navigate to the new location upon success.
       */
      await handleChangeSubFileMetadata({ fileId: fileId!, parentFolderData: parentFolderData!, fileWillBeMoved });
      handleNavigateAfterMovedToSubFolder({
        parentFolderData: parentFolderData!,
        user: user!,
        navigate,
      });

      /**
       * Show a success message and update the state after completion.
       */
      showSuccess(`${abbreviateText(fileName!, 15)} moved to ${abbreviateText(parentFolderData!.folder_name!, 15)}`);
      dispatch(resetMobileMoveState());
      dispatch(resetMoveDataState());
      dispatch(setMobileMoveStatus("success"));
      dispatch(resetFileOptions());
    },
    [parentFolderData, fileId, fileName, user, navigate, dispatch, showSuccess]
  );

  const handleMoveFileToRoot = useCallback(
    async (fileWillBeMoved: RootFileGetData | SubFileGetData) => {
      /**
       * validate before move to root
       */
      dispatch(setMobileMoveStatus("loading"));

      /*
       * update file to root file
       */
      await handleChangeFileMetadataToRootFile({
        fileId: fileId!,
        fileWillBeMoved,
        newRootFolderUserId: user!.uid,
      });
      navigate("/storage/my-storage");

      /**
       * reset state and show success message
       */
      showSuccess(`${abbreviateText(fileName!, 15)} moved to My Storage`);
      dispatch(resetMobileMoveState());
      dispatch(resetMoveDataState());
      dispatch(setMobileMoveStatus("success"));
      dispatch(resetFileOptions());
    },
    [fileId, user, dispatch, navigate, fileName, showSuccess]
  );

  /**
   * handle confirm move file
   */
  const confirmMoveFile = useCallback(async () => {
    try {
      /**
       * fetch file to be moved and fetch data storage
       */
      const fileWillBeMoved = await handleGetFileById(fileId || "");
      const isStorageAvailable = await handleCheckIsStorageAvailable({ parentFolderData });

      const isValidationPass = await handleValidateBeforeMoveFile({
        fileWillBeMoved,
        dispatch,
        moveFromLocationPath,
        navigate,
        parentFolderData,
        user,
        isSubMovePage: isSubMoveFolderOrFileLocation,
        isRootMovePage: isRootMoveFolderOrFileLocation,
        fileId,
        filesData,
        isStorageAvailable,
      });
      if (!isValidationPass) return;

      parentFolderData ? await handleMoveFileToSubFolder(fileWillBeMoved!) : await handleMoveFileToRoot(fileWillBeMoved!);

      /**
       * update file storage metadata
       */
      await handleUpdateFileMetadataInFirebaseStorage({
        fileId: fileId!,
        fileName: fileName!,
        rootFolderOwner: parentFolderData?.root_folder_user_id || null,
      });
    } catch (error) {
      console.error("error while moving file: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  }, [
    dispatch,
    fileId,
    isRootMoveFolderOrFileLocation,
    isSubMoveFolderOrFileLocation,
    moveFromLocationPath,
    navigate,
    parentFolderData,
    user,
    filesData,
    handleMoveFileToSubFolder,
    handleMoveFileToRoot,
    fileName,
  ]);

  return { confirmMoveFile };
};

export default useConfirmMobileMoveFile;
