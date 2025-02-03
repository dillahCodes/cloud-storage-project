import { FirebaseUserData } from "@/features/auth/auth";
import useUser from "@/features/auth/hooks/use-user";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { db, storage } from "@/firebase/firebase-services";
import { Dispatch } from "@reduxjs/toolkit";
import { message } from "antd";
import { collection, doc, DocumentData, getDoc, getDocs, increment, query, QuerySnapshot, updateDoc, where } from "firebase/firestore";
import { ref, updateMetadata } from "firebase/storage";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, dekstopMoveSelector, resetDektopMoveState, setDekstopMoveStatus } from "../slice/dekstop-move-slice";
import { moveFoldersAndFilesDataSelector } from "../slice/move-folders-and-files-data-slice";
import handleCheckIsStorageAvailable from "@/features/storage/handle-check-is-storage-available";

interface MoveFolderParams {
  folderIdWillBeMoved: string;
  newParentFolderId: string | null;
  newRootFolderId: string | null;
  newRootFolderOwnerUserId: string | null;
}

interface ValidateMoveParams {
  user: FirebaseUserData | null;

  parentFolderData: RootFolderGetData | SubFolderGetData | null;
  foldersData: RootFolderGetData[] | SubFolderGetData[] | null;
  folderWillBeMoved: RootFolderGetData | SubFolderGetData | null;

  dispatch: Dispatch;
  isStorageAvailable: boolean;
}

interface HandleUpdateFilesPromises {
  files: SubFileGetData[];
  newRootFolderOwnerUserId: string | null;
}

interface HandleUpdateFileMetadataInFireabseStorage {
  fileName: string;
  fileId: string;
  newRootFolderOwnerUserId: string | null;
}

interface HandleChangeUserStorageSize {
  userId: string;
  size: number;
  mode: "increment" | "decrement";
}

interface MoveSubFoldersRecursivelyParams {
  subFoldersSnapshot: QuerySnapshot<DocumentData>;
  handleMoveFolderRecursively: (params: MoveFolderParams) => Promise<void>;
  newRootFolderId: string | null;
  newRootFolderOwnerUserId: string | null;
}

/**
 * Validates the move folder operation based on the given parameters.
 *
 * This function checks for the following conditions:
 * - User is authenticated
 * - Folder exists
 * - User is the folder owner
 * - Folder is not being moved to a location that the user does not have permission to access
 * - Folder does not already exist in the destination
 *
 * If any of these conditions fail, it dispatches an error message and sets the
 * desktop move status to "error". If all conditions pass, it returns true.
 *
 * @param {ValidateMoveParams} param - An object containing the user object, parent folder data, folders data, folder to be moved data, and dispatch function.
 * @returns {boolean} True if the validation passes, false otherwise.
 */
const handleMoveFolderValidation = (params: ValidateMoveParams) => {
  const { folderWillBeMoved, parentFolderData, user, foldersData, dispatch, isStorageAvailable } = params;

  /**
   * folder validation
   */
  const isFolderExists: boolean = !!foldersData?.some((folder) => folder.folder_id === folderWillBeMoved?.folder_id);
  const isFolderWillBeMovedInvalid: boolean = !folderWillBeMoved;
  const isNotFolderOwner: boolean = folderWillBeMoved?.owner_user_id !== user!.uid;

  /**
   * folder move location
   */
  const isRootMoveFolderOrFileLocation: boolean = !parentFolderData;
  const isSubMoveFolderOrFileLocation: boolean = Boolean(parentFolderData) && !isRootMoveFolderOrFileLocation;
  const isSubMoveSameRootFolder: boolean = isSubMoveFolderOrFileLocation && parentFolderData?.root_folder_id === folderWillBeMoved?.root_folder_id;

  const isRootMoveNotOwner = isRootMoveFolderOrFileLocation && isNotFolderOwner;
  const isSubMoveNotOwner = isSubMoveFolderOrFileLocation && isNotFolderOwner && !isSubMoveSameRootFolder;

  /**
   * storage not enough message
   */
  const createStorageMessage: string = `${parentFolderData?.root_folder_user_id === user!.uid ? "Your" : "owner"} storage is full`;

  const validation = [
    {
      condition: !user,
      message: "Something went wrong. Please try again.",
    },
    {
      condition: isFolderWillBeMovedInvalid,
      message: "Folder not found. Please try again.",
    },
    {
      condition: isRootMoveNotOwner || isSubMoveNotOwner,
      message: "Only folder owner can move to this location.",
    },
    {
      condition: isFolderExists,
      message: "folder already exists.",
    },
    {
      condition: !isStorageAvailable,
      message: createStorageMessage,
    },

    // add folder validation here
  ];

  const failedValidation = validation.find((validation) => validation.condition);
  if (failedValidation) {
    dispatch(setDekstopMoveStatus("error"));
    message.open({
      type: "error",
      content: failedValidation.message,
      className: "font-archivo text-sm",
      key: "folder-move-error-message",
    });
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
  return folderSnapshot.exists() ? (JSON.parse(JSON.stringify(folderSnapshot.data())) as RootFolderGetData | SubFolderGetData) : null;
};

/**
 * Fetches all the subfolders of a specified folder by its parent folder ID.
 *
 * @param {string} folderId - The ID of the folder whose subfolders are to be retrieved.
 * @returns {Promise<QuerySnapshot<DocumentData>>} A promise that resolves to the snapshot of the subfolders.
 */

const handleGetSubFoldersById = async (folderId: string): Promise<QuerySnapshot<DocumentData>> => {
  const subFoldersQuery = query(collection(db, "folders"), where("parent_folder_id", "==", folderId));
  return await getDocs(subFoldersQuery);
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
  const { handleMoveFolderRecursively, newRootFolderId, newRootFolderOwnerUserId, subFoldersSnapshot } = params;

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

/**
 * Moves a folder to a new parent folder and/or root folder.
 *
 * @param {MoveFolderParams} params - The parameters for the folder to be moved.
 * @returns {Promise<void>} A promise that resolves when the folder has been moved.
 */
const handleMoveFolder = async (params: MoveFolderParams) => {
  const { folderIdWillBeMoved, newParentFolderId, newRootFolderId, newRootFolderOwnerUserId } = params;
  const folderDoc = doc(db, "folders", folderIdWillBeMoved);
  await updateDoc(folderDoc, { parent_folder_id: newParentFolderId, root_folder_id: newRootFolderId, root_folder_user_id: newRootFolderOwnerUserId });
};

/**
 * Fetches all the files in a given folder by its ID and serializes the files data
 * for use in the React store.
 *
 * @param {string} folderId - The ID of the folder whose files are to be fetched.
 * @returns {Promise<SubFileGetData[] | null>} A promise that resolves to the files in the folder, or null if the folder does not exist.
 */
const handleGetFilesByParentFolderId = async (folderId: string) => {
  const filesQuery = query(collection(db, "files"), where("parent_folder_id", "==", folderId));
  const filesSnapshot = await getDocs(filesQuery);
  return filesSnapshot.empty ? null : (filesSnapshot.docs.map((doc) => JSON.parse(JSON.stringify(doc.data()))) as SubFileGetData[]);
};

const handleUpdateFileMetadataInFirebaseStorage = async (params: HandleUpdateFileMetadataInFireabseStorage) => {
  const { fileId, fileName, newRootFolderOwnerUserId } = params;

  const fileRef = ref(storage, `user-files/${fileId}/${fileName}`);
  const newMetadata = {
    customMetadata: { "root-folder-owner": newRootFolderOwnerUserId || "" },
  };
  await updateMetadata(fileRef, newMetadata);
};

const handleChangeUserStorageSize = async ({ mode, size, userId }: HandleChangeUserStorageSize) => {
  const userStorageRef = doc(db, "users-storage", userId);
  await updateDoc(userStorageRef, {
    storageUsed: mode === "increment" ? increment(size) : increment(-size),
  });
};

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

const useConfirmDekstopMoveFolder = () => {
  const dispatch = useDispatch();

  /**
   * state
   */
  const { user } = useUser();
  const { parentFolderData, foldersData } = useSelector(moveFoldersAndFilesDataSelector);
  const { folderId } = useSelector(dekstopMoveSelector);

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
      if (files) {
        await handleUpdateFilesPromises({
          files,
          newRootFolderOwnerUserId,
        });
      }

      // move itself
      await handleMoveFolder({
        folderIdWillBeMoved,
        newParentFolderId,
        newRootFolderId,
        newRootFolderOwnerUserId,
      });
    } catch (error) {
      console.error("error while move folder recursively: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  }, []);

  const handleConfirmMoveFolder = useCallback(async () => {
    try {
      dispatch(setDekstopMoveStatus("loading"));
      dispatch(closeModal());

      /**
       * fetch folder will be moved
       */
      const folderWillBeMoved = await handleGetFolderById(folderId as string);

      /**
       * fetch is storage available
       */
      const isStorageAvailable = await handleCheckIsStorageAvailable({ parentFolderData });

      /**
       * validate before move folder
       */
      const validationRes = handleMoveFolderValidation({
        user,
        folderWillBeMoved,
        parentFolderData,
        foldersData,
        dispatch,
        isStorageAvailable,
      });
      if (!validationRes) return;

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
       * reset state and show success message
       */
      dispatch(setDekstopMoveStatus("success"));
      dispatch(resetDektopMoveState());
      message.open({ type: "success", content: "Folder moved successfully.", className: "font-archivo text-sm", key: "folder-move-success-message" });
    } catch (error) {
      dispatch(setDekstopMoveStatus("error"));
      console.error("error while move folder: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  }, [folderId, parentFolderData, user, dispatch, foldersData, handleMoveFolderRecursively]);

  return { handleConfirmMoveFolder };
};

export default useConfirmDekstopMoveFolder;
