import useUser from "@/features/auth/hooks/use-user";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { auth, db, storage } from "@/firebase/firebase-services";
import { Dispatch } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  increment,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate, useSearchParams } from "react-router-dom";
import {
  mobileMoveSelector,
  resetMobileMoveState,
  setMobileMoveFolderMoveErrorMessage,
  setMobileMoveStatus,
} from "../slice/mobile-move-slice";
import { moveFoldersAndFilesDataSelector } from "../slice/move-folders-and-files-data-slice";
import { message } from "antd";
import useDetectLocation from "@/hooks/use-detect-location";
import { resetFolderOptions } from "@/features/folder/slice/folder-options-slice";
import { ref, updateMetadata } from "firebase/storage";
import handleCheckIsStorageAvailable from "@/features/storage/handle-check-is-storage-available";
import { SubFileGetData } from "@/features/file/file";

interface MoveFolderParams {
  folderIdWillBeMoved: string;
  newParentFolderId: string | null;
  newRootFolderId: string | null;
  newRootFolderOwnerUserId: string | null;
}

interface HandleMoveFolderFirstValidationParams {
  folderId: string | null;
  user: FirebaseUserData | null;
  moveFrom: string | null;
  dispatch: Dispatch;
  navigate: NavigateFunction;
}

interface HandleMoveFolderSecondValidationParams {
  user: FirebaseUserData | null;

  folderId: string | null;
  folderWillBeMoved: RootFolderGetData | SubFolderGetData | null;

  foldersData: RootFolderGetData[] | SubFolderGetData[] | null;
  parentFolderData: RootFolderGetData | SubFolderGetData | null;

  dispatch: Dispatch;
  navigate: NavigateFunction;

  searchParams: URLSearchParams;
  moveFromPath: string;

  isRootMovePage: boolean;
  isSubMovePage: boolean;
  isStorageAvailable: boolean;
}

interface MoveSubFoldersRecursivelyParams {
  subFoldersSnapshot: QuerySnapshot<DocumentData>;
  handleMoveFolderRecursively: (params: MoveFolderParams) => Promise<void>;
  newRootFolderId: string | null;
  newRootFolderOwnerUserId: string | null;
}

interface HandleUpdateFileMetadataInFireabseStorage {
  fileName: string;
  fileId: string;
  newRootFolderOwnerUserId: string | null;
}

interface HandleUpdateFilesPromises {
  files: SubFileGetData[];
  newRootFolderOwnerUserId: string | null;
}

interface HandleChangeUserStorageSize {
  userId: string;
  size: number;
  mode: "increment" | "decrement";
}

/**
 * Validates the folder ID, move-from location path, and user object before
 * moving a folder. If the validation fails, it shows an error message and
 * navigates the user back to the move-from location.
 *
 * @param {HandleMoveFolderFirstValidationParams} params - An object containing
 * the folder ID, move-from location path, user object, dispatch function, and
 * navigate function.
 * @returns {boolean} - True if the validation passes, false otherwise.
 */
const handleMoveFolderFirstValidation = (params: HandleMoveFolderFirstValidationParams): boolean => {
  const { folderId, moveFrom, user, dispatch, navigate } = params;

  const validations = [
    { condition: !folderId, message: "Folder not found." },
    { condition: !moveFrom, message: "Something went wrong, please try again." },
    { condition: !user, message: "Please log in to continue." },
  ];

  const failedValidation = validations.find((validation) => validation.condition);
  if (failedValidation) {
    dispatch(setMobileMoveFolderMoveErrorMessage(failedValidation.message));
    navigate(moveFrom || "/storage/my-storage");
    return false;
  }

  return true;
};

/**
 * Validates the move folder operation based on the given parameters.
 *
 * This function checks for the following conditions:
 * - Folder ID is valid
 * - Folder data is available
 * - User is the folder owner
 * - Folder is not being moved to its own location
 * - Folder is not being moved to its own subfolder
 * - Folder does not already exist in the destination
 * - User is not moving a shared folder to a location that the user does not have permission to access
 *
 * If any of these conditions fail, it displays an error message and navigates
 * the user back to the move-from location. If all conditions pass, it returns true.
 *
 * @param {HandleMoveFolderSecondValidationParams} params - An object containing the folder ID, folder data, array of folder data, searchParams, dispatch function, move-from location path, navigate function, parent folder data, user object, isRootMovePage boolean, and isSubMovePage boolean.
 * @returns {boolean} True if the validation passes, false otherwise.
 */
const handleMoveFolderSecondValidation = (params: HandleMoveFolderSecondValidationParams): boolean => {
  const {
    folderId,
    folderWillBeMoved,
    foldersData,
    searchParams,
    dispatch,
    moveFromPath,
    navigate,
    parentFolderData,
    user,
    isRootMovePage,
    isSubMovePage,
    isStorageAvailable,
  } = params;

  const isExistingFolder: boolean = !!foldersData?.some((folder) => folder.folder_id === folderId);
  const folderWillBeMovedIsInvalid: boolean = !folderWillBeMoved;
  const isMoveToSelf: boolean = searchParams.get("parentId") === folderId;
  const isMoveToSelfSubFolder: boolean = folderWillBeMoved?.folder_id === parentFolderData?.root_folder_id;

  /**
   * folder permission validations
   */
  const isNotFolderOwner: boolean = folderWillBeMoved?.owner_user_id !== user!.uid;
  const isRootFolderMine: boolean = parentFolderData?.root_folder_user_id === user!.uid;

  /**
   * folder move validations
   */
  const isRootMoveFolderOrFileLocation: boolean = !parentFolderData;
  const isNotOwnerMovingToRoot: boolean = isNotFolderOwner && !parentFolderData && isRootMovePage;
  const isMovingSharedFolderToMyFolder: boolean = isRootFolderMine && isRootMovePage;
  const isMovingSharedFolderNotOwnedByMe: boolean = (isMovingSharedFolderToMyFolder || isSubMovePage) && isNotFolderOwner;

  /**
   * storage not enough message
   */
  const createStorageMessage =
    (parentFolderData && parentFolderData.root_folder_user_id === user!.uid) || isRootMoveFolderOrFileLocation
      ? "Your storage is full"
      : "Owner's storage is full";

  /**
   * validations list
   */
  const validations = [
    { condition: !folderId, message: "Folder not found. Please try again." },
    { condition: folderWillBeMovedIsInvalid, message: "Something went wrong. Please try again." },
    { condition: isExistingFolder, message: "folder already exists." },
    { condition: isMoveToSelf, message: "You cannot move a folder to its own location." },
    { condition: isMoveToSelfSubFolder, message: "You cannot move a folder to its own subfolder." },
    {
      condition: isNotOwnerMovingToRoot || isMovingSharedFolderNotOwnedByMe,
      message: "Only folder owner can move to this location.",
    },
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
    navigate(moveFromPath);
    return false;
  }

  return true;
};

/**
 * Fetches a folder by its ID and serializes its data for use in the React store.
 *
 * @param {string} folderId - The ID of the folder to fetch.
 * @returns {Promise<RootFolderGetData | SubFolderGetData | null>} A promise that resolves to the folder data, or null if the
 * folder does not exist.
 */
const handleGetFolderById = async (folderId: string) => {
  const folderDoc = doc(db, "folders", folderId);
  const folderSnapshot = await getDoc(folderDoc);
  return folderSnapshot.exists()
    ? (JSON.parse(JSON.stringify(folderSnapshot.data())) as RootFolderGetData | SubFolderGetData)
    : null;
};

/**
 * Fetches all the subfolders of a given folder by its ID.
 *
 * @param {string} folderId - The ID of the folder whose subfolders are to be fetched.
 * @returns {Promise<QuerySnapshot<DocumentData>>} A promise that resolves to the snapshot of the subfolders of the folder.
 */
const handleGetSubFoldersById = async (folderId: string): Promise<QuerySnapshot<DocumentData>> => {
  const subFolderCollection = collection(db, "folders");
  const subFoldersQuery = query(subFolderCollection, where("parent_folder_id", "==", folderId));
  return await getDocs(subFoldersQuery);
};

/**
 * Adjusts the storage usage for a specific user in the database.
 *
 * This function updates the storage used by a user by either incrementing
 * or decrementing it based on the specified mode.
 *
 * @param {Object} params - An object containing the parameters for the update.
 * @param {string} params.userId - The ID of the user whose storage usage is being updated.
 * @param {number} params.size - The size in bytes to adjust the storage by.
 * @param {"increment" | "decrement"} params.mode - The mode of adjustment, either "increment" to add to the storage or "decrement" to subtract from it.
 */
const handleChangeUserStorageSize = async ({ mode, size, userId }: HandleChangeUserStorageSize) => {
  const userStorageRef = doc(db, "users-storage", userId);
  await updateDoc(userStorageRef, {
    storageUsed: mode === "increment" ? increment(size) : increment(-size),
  });
};

/**
 * Fetches all the files in a given folder by its ID.
 *
 * @param {string} folderId - The ID of the folder whose files are to be fetched.
 * @returns {Promise<SubFileGetData[] | null>} A promise that resolves to the files in the folder, or null if the folder does not exist.
 */
const handleGetFilesByParentFolderId = async (folderId: string) => {
  const filesQuery = query(collection(db, "files"), where("parent_folder_id", "==", folderId));
  const filesSnapshot = await getDocs(filesQuery);
  return filesSnapshot.empty
    ? null
    : (filesSnapshot.docs.map((doc) => JSON.parse(JSON.stringify(doc.data()))) as SubFileGetData[]);
};

/**
 * Updates the custom metadata of a file in Firebase Storage with the given new root folder owner ID.
 *
 * @param {HandleUpdateFileMetadataInFireabseStorage} params - An object containing the ID of the file to update, the name of the file, and the ID of the new root folder owner.
 * @returns {Promise<void>} A promise that resolves when the metadata of the file has been updated.
 */
const handleUpdateFileMetadataInFirebaseStorage = async (params: HandleUpdateFileMetadataInFireabseStorage) => {
  const { fileId, fileName, newRootFolderOwnerUserId } = params;

  const fileRef = ref(storage, `user-files/${fileId}/${fileName}`);
  const newMetadata = {
    customMetadata: { "root-folder-owner": newRootFolderOwnerUserId || "" },
  };
  await updateMetadata(fileRef, newMetadata);
};

/**
 * Updates the metadata of multiple files in Firebase Firestore and Firebase Storage with the given new root folder owner ID.
 *
 * @param {HandleUpdateFilesPromises} params - An object containing the files to update and the new root folder owner ID.
 * @returns {Promise<void>} A promise that resolves when all the files have been updated.
 */
const handleUpdateFilesPromises = async (params: HandleUpdateFilesPromises) => {
  const { files, newRootFolderOwnerUserId } = params;

  const promises = files.map((file) => {
    const { file_id: fileId, file_name: fileName, file_size: fileSize, root_folder_user_id: oldRootFolderOwnerUserId } = file;
    const fileRef = doc(db, "files", fileId);

    const isDifferentRootFolderOwner = oldRootFolderOwnerUserId !== newRootFolderOwnerUserId;
    const isValidDiferntRootFolderOwner = isDifferentRootFolderOwner && Boolean(newRootFolderOwnerUserId);
    const oldFileOwnerUserId = file.owner_user_id;

    if (isValidDiferntRootFolderOwner) {
      // update file metadata in firebase storage
      handleUpdateFileMetadataInFirebaseStorage({ fileId, fileName, newRootFolderOwnerUserId });
      // increment and decrement user storage logic
      handleChangeUserStorageSize({ mode: "decrement", size: parseInt(fileSize), userId: oldRootFolderOwnerUserId });
      handleChangeUserStorageSize({ mode: "increment", size: parseInt(fileSize), userId: newRootFolderOwnerUserId! });
    }
    // update files metadata in firebase firestore
    updateDoc(fileRef, { root_folder_user_id: newRootFolderOwnerUserId, owner_user_id: oldFileOwnerUserId });
  });
  await Promise.all(promises);
};

/**
 * Moves a folder to a new parent folder and/or root folder.
 *
 * @param {MoveFolderParams} params - The parameters for the folder to be moved.
 * @returns {Promise<void>} A promise that resolves when the folder has been moved.
 */
const handleMoveFolder = async (params: MoveFolderParams) => {
  const { folderIdWillBeMoved, newParentFolderId, newRootFolderId, newRootFolderOwnerUserId } = params;
  const folderDoc = doc(db, "folders", folderIdWillBeMoved);
  await updateDoc(folderDoc, {
    parent_folder_id: newParentFolderId,
    root_folder_id: newRootFolderId,
    root_folder_user_id: newRootFolderOwnerUserId,
  });
};

/**
 * Navigates to the appropriate folder location after a folder move operation.
 *
 * This function checks the current user's authentication status and the
 * destination folder's data to determine the correct navigation path. If the
 * user is not authenticated, it navigates to their storage root. If the folder
 * is moved to the root, it navigates to the user's storage root. If moved to
 * a subfolder, it navigates to the subfolder's path, differentiating between
 * the user's own storage and shared storage based on folder ownership.
 *
 * @param {RootFolderGetData | SubFolderGetData | null} parentFolderData - The parent folder data of the folder to move to.
 * @param {NavigateFunction} navigate - The navigate function to change routes.
 */
const navigateAfterMoveFolder = (parentFolderData: RootFolderGetData | SubFolderGetData | null, navigate: NavigateFunction) => {
  const { currentUser } = auth;
  if (!currentUser) return navigate("/storage/my-storage");

  const isUserMovedFolderToRoot = !parentFolderData;
  const isUserMovedFolderToSubFolder = parentFolderData;
  const isRootFolderMine = isUserMovedFolderToSubFolder && parentFolderData.root_folder_user_id === currentUser.uid;

  if (isUserMovedFolderToRoot) return navigate("/storage/my-storage");
  if (isUserMovedFolderToSubFolder && isRootFolderMine)
    return navigate(`/storage/folders/${parentFolderData.folder_id}?st=my-storage`);
  if (isUserMovedFolderToSubFolder && !isRootFolderMine)
    return navigate(`/storage/folders/${parentFolderData.folder_id}?st=shared-with-me`);
};

/**
 * Recursively moves subfolders to a new parent folder or root folder.
 *
 * This function iterates through each subfolder in the provided snapshot and
 * calls the given handler function to move each subfolder to a new location
 * based on the specified parameters.
 *
 * @param {MoveSubFoldersRecursivelyParams} params - An object containing:
 *   - subFoldersSnapshot: A snapshot of the subfolders to be moved.
 *   - handleMoveFolderRecursively: A function to handle moving each subfolder.
 *   - newRootFolderId: The new root folder ID for the subfolders.
 *   - newRootFolderOwnerUserId: The new root folder owner ID for the subfolders.
 *
 * @returns {Promise<void>} A promise that resolves when all subfolders have been moved.
 */

const moveSubfoldersRecursively = async (params: MoveSubFoldersRecursivelyParams) => {
  const { handleMoveFolderRecursively, subFoldersSnapshot, newRootFolderId, newRootFolderOwnerUserId } = params;

  const movePromises = subFoldersSnapshot.docs.map(async (subFolderDoc) => {
    const subFolderData = subFolderDoc.data() as SubFolderGetData;

    const folderIdWillBeMoved = subFolderData.folder_id;
    const newParentFolderId = subFolderData.parent_folder_id;
    await handleMoveFolderRecursively({
      folderIdWillBeMoved,
      newParentFolderId,
      newRootFolderId,
      newRootFolderOwnerUserId,
    });
  });
  await Promise.all(movePromises);
};

const useConfirmMobileMoveFolder = () => {
  const dispatch = useDispatch();

  /**
   * location and params hooks
   */
  const navigate = useNavigate();
  const { "0": searchParams } = useSearchParams();
  const { isRootMoveFolderOrFileLocation, isSubMoveFolderOrFileLocation } = useDetectLocation();

  const { user } = useUser();
  const { parentFolderData, foldersData } = useSelector(moveFoldersAndFilesDataSelector);
  const { folderId, moveFromLocationPath } = useSelector(mobileMoveSelector);

  const handleMoveFolderRecursively = useCallback(async (params: MoveFolderParams) => {
    const { folderIdWillBeMoved, newParentFolderId, newRootFolderId, newRootFolderOwnerUserId } = params;

    try {
      // fetch and move subfolder
      const subFoldersSnapshot = await handleGetSubFoldersById(folderIdWillBeMoved);
      if (!subFoldersSnapshot.empty) {
        await moveSubfoldersRecursively({
          handleMoveFolderRecursively,
          subFoldersSnapshot,

          newRootFolderId,
          newRootFolderOwnerUserId,
        });
      }

      // fetch and update files
      const files = await handleGetFilesByParentFolderId(folderIdWillBeMoved);
      if (files) await handleUpdateFilesPromises({ files, newRootFolderOwnerUserId });

      // move itself
      await handleMoveFolder({
        folderIdWillBeMoved,
        newParentFolderId,
        newRootFolderId,
        newRootFolderOwnerUserId,
      });
    } catch (error) {
      console.error(
        "error while move folder recursively: ",
        error instanceof Error ? error.message : "an unknown error occurred"
      );
    }
  }, []);

  const confirmMobileMoveFolder = useCallback(async () => {
    /**
     * first validation
     * is validation for validate state checking value of
     * folderId, moveFromLocationPath, user. return
     * false if failed and return true if success
     */
    const firstValidation = handleMoveFolderFirstValidation({
      folderId,
      moveFrom: moveFromLocationPath,
      user,
      dispatch,
      navigate,
    });
    if (!firstValidation) return;

    try {
      dispatch(setMobileMoveStatus("loading"));

      /**
       * fetch folder will be moved
       */
      const folderWillBeMoved = await handleGetFolderById(folderId || "");

      /**
       * check is storage available or not
       */
      const isStorageAvailable = await handleCheckIsStorageAvailable({
        parentFolderData,
        oldRootFolderId: folderWillBeMoved?.root_folder_id || null,
      });

      /**
       * second validation
       * is validation for validate state checking value of
       * folderWillBeMoved and create logic for move folder
       * return false if failed and return true if success
       */
      const secondValidation = handleMoveFolderSecondValidation({
        folderId,
        folderWillBeMoved,
        foldersData,
        searchParams,
        dispatch,
        navigate,
        moveFromPath: moveFromLocationPath as string,
        parentFolderData,
        user,
        isRootMovePage: isRootMoveFolderOrFileLocation,
        isSubMovePage: isSubMoveFolderOrFileLocation,
        isStorageAvailable,
      });
      if (!secondValidation) return;

      /**
       * if parent folder data exist, its meean user
       * move folder to sub folder.
       * else its mean user move folder to root folder
       */
      if (parentFolderData) {
        const newRootFolderOwnerUserId = parentFolderData.root_folder_user_id;
        const newParentFolderId = parentFolderData.folder_id;
        const newRootFolderId = parentFolderData.root_folder_id;

        await handleMoveFolderRecursively({
          folderIdWillBeMoved: folderId!,
          newParentFolderId,
          newRootFolderId,
          newRootFolderOwnerUserId,
        });
      } else {
        const newRootFolderOwnerUserId = user!.uid; // if move to root  new root folder owner user id is current user
        const newParentFolderId = null; // if move to root  new parent folderid is null
        const newRootFolderId = folderId; // if move to root  new root folderid is same as folder id

        await handleMoveFolderRecursively({
          folderIdWillBeMoved: folderId!,
          newParentFolderId,
          newRootFolderId,
          newRootFolderOwnerUserId,
        });
      }

      /**
       * navigate and update state after move folder
       */
      navigateAfterMoveFolder(parentFolderData, navigate);
      dispatch(setMobileMoveStatus("success"));
      dispatch(resetMobileMoveState());
      dispatch(resetFolderOptions());

      message.open({
        type: "success",
        content: "Folder moved successfully.",
        className: "font-archivo text-sm",
        key: "folder-move-success-message",
      });
    } catch (error) {
      dispatch(setMobileMoveStatus("error"));
      console.error("error while move folder: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  }, [
    handleMoveFolderRecursively,
    dispatch,
    moveFromLocationPath,
    navigate,
    user,
    folderId,
    foldersData,
    searchParams,
    parentFolderData,
    isRootMoveFolderOrFileLocation,
    isSubMoveFolderOrFileLocation,
  ]);

  return { confirmMobileMoveFolder };
};

export default useConfirmMobileMoveFolder;
