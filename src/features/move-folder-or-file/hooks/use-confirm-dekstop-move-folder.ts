import { FirebaseUserData } from "@/features/auth/auth";
import useUser from "@/features/auth/hooks/use-user";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { db } from "@/firebase/firebase-services";
import useDetectLocation from "@/hooks/use-detect-location";
import { message } from "antd";
import { collection, doc, DocumentData, getDoc, getDocs, query, QuerySnapshot, updateDoc, where } from "firebase/firestore";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, dekstopMoveSelector, resetDektopMoveState, setDekstopMoveStatus } from "../slice/dekstop-move-slice";
import { moveFoldersAndFilesDataSelector } from "../slice/move-folders-and-files-data-slice";

interface MoveFolderParams {
  folderId: string;
  newParentFolderId: string | null;
  newRootFolderId: string | null;
  newRootFolderOwnerUserId: string | null;
}

/**
 * Serializes a folder data object from the Firebase Firestore document snapshot.
 *
 * The Firebase Firestore timestamp objects are not JSON serializable, so we need to convert them to a string
 * before serializing the object. This function takes a folder data object from the Firestore document snapshot
 * and serializes it by converting the timestamp fields to strings.
 *
 * @param {SubFolderGetData | RootFolderGetData} folderData - The folder data object to serialize.
 * @returns {RootFolderGetData | SubFolderGetData} The serialized folder data object.
 */
const handleSerializeFolderData = (folderData: SubFolderGetData | RootFolderGetData): RootFolderGetData | SubFolderGetData => ({
  ...folderData,
  created_at: JSON.parse(JSON.stringify(folderData.created_at)),
  updated_at: folderData.updated_at ? JSON.parse(JSON.stringify(folderData.updated_at)) : null,
});

/**
 * Serializes a file data object from the Firebase Firestore document snapshot.
 *
 * The Firebase Firestore timestamp objects are not JSON serializable, so we need to convert them to a string
 * before serializing the object. This function takes a file data object from the Firestore document snapshot
 * and serializes it by converting the timestamp fields to strings.
 *
 * @param {SubFileGetData} file - The file data object to serialize.
 * @returns {SubFileGetData} The serialized file data object.
 */

const handleSerializeFileData = (files: SubFileGetData) => ({
  ...files,
  updated_at: files.updated_at ? JSON.parse(JSON.stringify(files.updated_at)) : null,
  created_at: JSON.parse(JSON.stringify(files.created_at)),
});

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
  return folderSnapshot.exists() ? handleSerializeFolderData(folderSnapshot.data() as SubFolderGetData | RootFolderGetData) : null;
};

/**
 * Fetches all the subfolders of a given folder by its ID.
 *
 * @param {string} folderId - The ID of the folder whose subfolders are to be fetched.
 * @returns {Promise<QuerySnapshot<DocumentData>>} A promise that resolves to the snapshot of the subfolders of the folder.
 */
const handleGetSubFoldersById = async (folderId: string): Promise<QuerySnapshot<DocumentData>> => {
  const subFoldersQuery = query(collection(db, "folders"), where("parent_folder_id", "==", folderId));
  return await getDocs(subFoldersQuery);
};

/**
 * Recursively moves all subfolders of the given folder.
 *
 * @param {QuerySnapshot<DocumentData>} subFoldersSnapshot - The snapshot of the subfolders to be moved.
 * @param {(params: MoveFolderParams) => Promise<void>} handleMoveFolderRecursively - The function to call for each subfolder to be moved.
 * @returns {Promise<void>} A promise that resolves when all subfolders have been moved.
 */
const moveSubfoldersRecursively = async (
  subFoldersSnapshot: QuerySnapshot<DocumentData>,
  handleMoveFolderRecursively: (params: MoveFolderParams) => Promise<void>
) => {
  const movePromises = subFoldersSnapshot.docs.map(async (subFolderDoc) => {
    const subFolderData = subFolderDoc.data() as SubFolderGetData;
    await handleMoveFolderRecursively({
      folderId: subFolderData.folder_id,
      newParentFolderId: subFolderData.parent_folder_id,
      newRootFolderId: subFolderData.root_folder_id,
      newRootFolderOwnerUserId: subFolderData.root_folder_user_id,
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
const handleMoveFoler = async (params: MoveFolderParams) => {
  const { folderId, newParentFolderId, newRootFolderId, newRootFolderOwnerUserId } = params;
  const folderDoc = doc(db, "folders", folderId);
  await updateDoc(folderDoc, { parent_folder_id: newParentFolderId, root_folder_id: newRootFolderId, root_folder_user_id: newRootFolderOwnerUserId });
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
  return filesSnapshot.empty ? null : filesSnapshot.docs.map((doc) => handleSerializeFileData(doc.data() as SubFileGetData));
};

/**
 * Updates the root_folder_user_id of all files in the given array of files to the given newRootFolderUserId.
 *
 * @param {SubFileGetData[]} files - The array of files to update.
 * @param {string} newRootFolderUserId - The ID of the new root folder user.
 * @returns {Promise<void>} A promise that resolves when all the files have been updated.
 */
const handleUpdateFilesPromises = async (files: SubFileGetData[], newRootFolderUserId: string) => {
  const promises = files.map((file) => {
    const fileRef = doc(db, "files", file.file_id);
    return updateDoc(fileRef, { root_folder_user_id: newRootFolderUserId });
  });
  await Promise.all(promises);
};

interface ValidateMoveParams {
  user: FirebaseUserData | null;
  folderWillBeMoved: RootFolderGetData | SubFolderGetData | null;
  parentFolderData: RootFolderGetData | SubFolderGetData | null;
  isSubSharedWithMeLocation: boolean;
  foldersData: RootFolderGetData[] | SubFolderGetData[] | null;
}

const handleMoveFolderValidation = (params: ValidateMoveParams) => {
  const { folderWillBeMoved, parentFolderData, user, foldersData, isSubSharedWithMeLocation } = params;

  /**
   * folder validation
   */
  const isFolderExists = !!foldersData?.some((folder) => folder.folder_id === folderWillBeMoved?.folder_id);
  const isFolderWillBeMovedInvalid = !folderWillBeMoved;

  /**
   * folder permission validation
   */
  const isNotFolderOwner = folderWillBeMoved?.owner_user_id !== user!.uid;
  const isRootFolderMine: boolean = parentFolderData?.root_folder_user_id === user!.uid;

  /**
   * folder move validation
   */
  const isNotOwnerMovingToRoot: boolean = isNotFolderOwner && !parentFolderData && isSubSharedWithMeLocation;
  const isMovingSharedFolderToMyFolder: boolean = isRootFolderMine && isSubSharedWithMeLocation;
  const isMovingSharedFolderNotOwnedByMe: boolean = isMovingSharedFolderToMyFolder && isNotFolderOwner;

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
      condition: isNotOwnerMovingToRoot || isMovingSharedFolderNotOwnedByMe,
      message: "Only folder owner can move to this location.",
    },
    {
      condition: isFolderExists,
      message: "folder already exists.",
    },

    // add folder validation here
  ];

  const failedValidation = validation.find((validation) => validation.condition);
  if (failedValidation) return failedValidation;

  return {
    condition: false,
    message: "",
  };
};

const useConfirmDekstopMoveFolder = () => {
  const dispatch = useDispatch();

  /**
   * state
   */
  const { user } = useUser();
  const { parentFolderData, foldersData } = useSelector(moveFoldersAndFilesDataSelector);
  const { folderId } = useSelector(dekstopMoveSelector);

  /**
   * detect location
   */
  const { isSubSharedWithMeLocation } = useDetectLocation();

  const handleMoveFolderRecursively = useCallback(async (params: MoveFolderParams) => {
    const { folderId, newParentFolderId, newRootFolderId, newRootFolderOwnerUserId } = params;

    try {
      // fetch and move subfolder
      const subFoldersSnapshot = await handleGetSubFoldersById(folderId);
      if (!subFoldersSnapshot.empty) await moveSubfoldersRecursively(subFoldersSnapshot, handleMoveFolderRecursively);

      // fetch and update files
      const files = await handleGetFilesByParentFolderId(folderId);
      if (files) await handleUpdateFilesPromises(files, newRootFolderOwnerUserId as string);

      // move itself
      await handleMoveFoler({
        folderId,
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
       * validate before move folder
       */
      const validationRes = handleMoveFolderValidation({
        user,
        folderWillBeMoved,
        parentFolderData,
        isSubSharedWithMeLocation,
        foldersData,
      });
      if (validationRes.condition) {
        dispatch(setDekstopMoveStatus("error"));
        message.open({
          type: "error",
          content: validationRes.message,
          className: "font-archivo text-sm",
          key: "folder-move-error-message",
        });
        return;
      }

      parentFolderData
        ? await handleMoveFolderRecursively({
            folderId: folderWillBeMoved!.folder_id,
            newParentFolderId: parentFolderData.folder_id,
            newRootFolderId: parentFolderData.root_folder_id,
            newRootFolderOwnerUserId: parentFolderData.root_folder_user_id,
          })
        : await handleMoveFolderRecursively({
            folderId: folderWillBeMoved!.folder_id,
            newParentFolderId: null,
            newRootFolderId: folderWillBeMoved!.folder_id,
            newRootFolderOwnerUserId: user!.uid,
          });

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
  }, [folderId, parentFolderData, user, dispatch, isSubSharedWithMeLocation, foldersData, handleMoveFolderRecursively]);

  return { handleConfirmMoveFolder };
};

export default useConfirmDekstopMoveFolder;
