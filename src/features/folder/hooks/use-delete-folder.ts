import useSecuredFolderFolderActions from "@/features/permissions/hooks/use-secured-folder-folder-actions";
import { auth, db, storage } from "@/firebase/firebase-services";
import useDetectLocation from "@/hooks/use-detect-location";
import { message } from "antd";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  increment,
  query,
  QuerySnapshot,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { RootFolderGetData, SubFolderGetData } from "../folder";
import { DeleteFolderActivity } from "../folder-activity";
import useAddActivityDeletedFolder from "./use-add-activity-deleted-folder";
import { SubFileGetData } from "@/features/file/file";

interface DeleteFolderParams {
  folderId: string;
  folderName: string;
  parentFolderId: string | null;
  rootFolderId: string;
  rootFolderOwnerUserId: string;
}

/**
 * Helper functions
 */

const handleDecrementUserStorageUsage = async (userId: string, size: number) => {
  const userStorageRef = doc(db, "users-storage", userId);
  await updateDoc(userStorageRef, {
    storageUsed: increment(-size),
  });
};

/**
 * Deletes all subfolders of a given folder, using recursion and Promise.all
 * @param {QuerySnapshot<DocumentData, DocumentData>} subFoldersSnapshot - The snapshot of subfolders of the given folder
 * @param {(params: DeleteFolderParams) => Promise<void>} handleDeleteRecursively - The function to call for each subfolder to be deleted
 */
const deleteSubFoldersWithPromiseAllAndRecursion = async (
  subFoldersSnapshot: QuerySnapshot<DocumentData, DocumentData>,
  handleDeleteRecursively: (params: DeleteFolderParams) => Promise<void>
) => {
  const deletePromises = subFoldersSnapshot.docs.map(async (subFolderDoc) => {
    const subFolderData = subFolderDoc.data() as SubFolderGetData;
    await handleDeleteRecursively({
      folderId: subFolderData.folder_id,
      folderName: subFolderData.folder_name,
      parentFolderId: subFolderData.parent_folder_id,
      rootFolderId: subFolderData.root_folder_id,
      rootFolderOwnerUserId: subFolderData.root_folder_user_id,
    });
  });
  await Promise.all(deletePromises);
};

/**
 * Deletes a starred folder by its ID for the given user.
 *
 * @param {string} folderId - The ID of the folder to delete.
 * @param {string} userId - The ID of the user whose starred folder to delete.
 * @returns {Promise<void>} A promise that resolves when the folder is deleted.
 */
const deleteStarredFolder = async (folderId: string, userId: string) => {
  const folderRef = doc(db, "starredFolders", `${userId}_${folderId}`);
  await deleteDoc(folderRef);
};

/**
 * Deletes the shared with me folder by its ID.
 *
 * @param {string} folderId - The ID of the folder to delete.
 * @returns {Promise<void>} A promise that resolves when the folder has been deleted.
 */
const deleteSharedWithMeFolder = async (folderId: string, userId: string) => {
  const folderRef = doc(db, "sharedWithMeFolders", `${userId}_${folderId}`);
  await deleteDoc(folderRef);
};

/**
 * Deletes the general access data for a specific folder by its ID.
 *
 * @param {string} folderId - The ID of the folder whose general access data is to be deleted.
 * @returns {Promise<void>} A promise that resolves when the general access data has been deleted.
 */

const handleDeleteFolderGeneralAccessData = async (folderId: string) => {
  const generalAccessDataRef = doc(db, "generalAccess", folderId);
  await deleteDoc(generalAccessDataRef);
};

/**
 * Deletes a folder by its ID.
 *
 * @param {string} folderId - The ID of the folder to delete.
 * @returns {Promise<void>} A promise that resolves when the folder has been deleted.
 */
const handleDeleteFolderById = async (folderId: string) => {
  const folderRef = doc(db, "folders", folderId);
  await deleteDoc(folderRef);
};

/**
 * Deletes all the collaborators of a given folder.
 *
 * @param {QuerySnapshot<DocumentData>} collaboratorsSnapshot - The snapshot of the collaborators of the folder.
 * @returns {Promise<void>} A promise that resolves when all the collaborators have been deleted.
 */
const handleDeleteAllCollaborators = async (collaboratorsSnapshot: QuerySnapshot<DocumentData>): Promise<void> => {
  const deletionPromises = collaboratorsSnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletionPromises);
};

/**
 * Fetches all the collaborators of a given folder by its ID.
 *
 * @param {string} folderId - The ID of the folder whose collaborators are to be fetched.
 * @returns {Promise<QuerySnapshot<DocumentData>>} A promise that resolves to the snapshot of the collaborators
 * of the folder.
 */
const handleGetAllFolderCollaborators = async (folderId: string): Promise<QuerySnapshot<DocumentData>> => {
  const collaboratorsQuery = query(collection(db, "collaborators"), where("folderId", "==", folderId));
  return await getDocs(collaboratorsQuery);
};

/**
 * Deletes all the files in a given folder and logs the activity.
 *
 * @param {QuerySnapshot<DocumentData>} fileSnapshot - The snapshot of the files in the folder.
 * @param {(params: DeleteFolderActivity) => Promise<void>} handleDeletedFolderActivity - The function to call
 * to log the activity.
 * @param {DeleteFolderParams} deletedFileParams - The parameters for the folder that has been deleted.
 * @param {string} currUserId - The ID of the user who is performing the deletion.
 * @returns {Promise<void>} A promise that resolves when all the files have been deleted and the activity has been logged.
 */
const handleDeleteAllFiles = async (
  fileSnapshot: QuerySnapshot<DocumentData>,
  handleDeletedFolderActivity: (params: DeleteFolderActivity) => Promise<void>,
  deletedFileParams: DeleteFolderParams,
  currUserId: string
) => {
  const deletionPromises = fileSnapshot.docs.map(async (fileDoc) => {
    const fileData = fileDoc.data() as SubFileGetData;
    const fileRef = ref(storage, `user-files/${fileData.file_id}/${fileData.file_name}`);

    await deleteObject(fileRef);
    await deleteDoc(fileDoc.ref);

    await handleDecrementUserStorageUsage(deletedFileParams.rootFolderOwnerUserId, parseInt(fileData.file_size));
    await handleDeletedFolderActivity({
      type: "delete-folder-activity",
      activityId: uuidv4(),

      rootFolderId: deletedFileParams.rootFolderId,

      folderId: deletedFileParams.folderId,
      folderName: deletedFileParams.folderName,

      parentFolderId: deletedFileParams.parentFolderId,
      rootFolderOwnerUserId: deletedFileParams.rootFolderOwnerUserId,

      fileName: fileData.file_name,
      fileType: fileData.file_type,

      activityByUserId: currUserId,
      activityDate: serverTimestamp(),
    });
  });
  await Promise.all(deletionPromises);
};

/**
 * Fetches all the files in the given folder by its ID.
 *
 * @param {string} folderId - The ID of the folder whose files are to be fetched.
 * @returns {Promise<QuerySnapshot<DocumentData>>} A promise that resolves to the snapshot of the files in the folder.
 */
const handleGetFilesByParentFolderId = async (folderId: string): Promise<QuerySnapshot<DocumentData>> => {
  const filesQuery = query(collection(db, "files"), where("parent_folder_id", "==", folderId));
  return await getDocs(filesQuery);
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
 * Handles folder deletion and activity tracking.
 * @param {RootFolderGetData | SubFolderGetData} folderData - Data of the folder to delete.
 * @returns {Object} Contains the `handleConfirmDeleteFolder` function.
 */
const useDeleteFolder = (folderData: RootFolderGetData | SubFolderGetData) => {
  const { currentUser } = auth;
  const { isSharedWithMeLocation, isStarredLocation } = useDetectLocation();
  const { handleAddActivityDeletedFolder } = useAddActivityDeletedFolder();
  const { handleCheckIsUserCanDoThisAction } = useSecuredFolderFolderActions();

  const handleDeleteRecursively = useCallback(
    async (params: DeleteFolderParams) => {
      const { folderId, folderName, parentFolderId, rootFolderId, rootFolderOwnerUserId } = params;
      if (!currentUser) return;

      try {
        // Fetch and delete subfolders
        const subFoldersSnapshot = await handleGetSubFoldersById(folderId);
        if (!subFoldersSnapshot.empty)
          await deleteSubFoldersWithPromiseAllAndRecursion(subFoldersSnapshot, handleDeleteRecursively);

        // Fetch and delete files
        const subFileSnapshot = await handleGetFilesByParentFolderId(folderId);
        await handleDeleteAllFiles(subFileSnapshot, handleAddActivityDeletedFolder, params, currentUser.uid);

        // Fetch and delete collaborators
        const collaboratorsSnapshot = await handleGetAllFolderCollaborators(folderId);
        await handleDeleteAllCollaborators(collaboratorsSnapshot);

        // Delete general access data and the folder itself
        await handleDeleteFolderGeneralAccessData(folderId);
        await handleDeleteFolderById(folderId);

        // Track folder deletion activity
        await handleAddActivityDeletedFolder({
          type: "delete-folder-activity",
          activityId: uuidv4(),
          parentFolderId,
          rootFolderId,
          rootFolderOwnerUserId,
          folderId,
          folderName,
          activityByUserId: currentUser?.uid as string,
          activityDate: serverTimestamp(),
        });
      } catch (error) {
        console.error(
          `Error during recursive deletion of folder ID ${folderId}: `,
          error instanceof Error ? error.message : "Unknown error."
        );
        throw error;
      }
    },
    [handleAddActivityDeletedFolder, currentUser]
  );

  const handleConfirmDeleteFolder = useCallback(async () => {
    if (!currentUser) return;

    try {
      /**
       * Skip validation for the following cases:
       * - Folder is shared with me
       * - Folder is starred
       */
      const isSkipValidation = isSharedWithMeLocation || isStarredLocation;
      const isValidateSecuredFolderPass = isSkipValidation
        ? true
        : await handleCheckIsUserCanDoThisAction(folderData.folder_id, "delete");
      if (!isValidateSecuredFolderPass) return;

      message.open({
        type: "loading",
        content: "Deleting folder...",
        className: "font-archivo text-sm",
        duration: 0,
        key: "folder-delete-loading",
      });

      switch (true) {
        case isSharedWithMeLocation:
          await deleteSharedWithMeFolder(folderData.folder_id, currentUser.uid);
          window.location.reload();
          break;

        case isStarredLocation:
          await deleteStarredFolder(folderData.folder_id, currentUser.uid);
          window.location.reload();
          break;

        default:
          await handleDeleteRecursively({
            folderId: folderData.folder_id,
            folderName: folderData.folder_name,
            parentFolderId: folderData.parent_folder_id,
            rootFolderId: folderData.root_folder_id,
            rootFolderOwnerUserId: folderData.root_folder_user_id,
          });
          break;
      }

      message.destroy("folder-delete-loading");
      message.open({
        type: "success",
        content: "Folder deleted successfully.",
        className: "font-archivo text-sm",
        key: "folder-delete-success",
      });
      setTimeout(() => message.destroy("folder-delete-success"), 2000);
    } catch (error) {
      console.error("Error confirming folder deletion: ", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [
    currentUser,
    folderData,
    isSharedWithMeLocation,
    isStarredLocation,
    handleDeleteRecursively,
    handleCheckIsUserCanDoThisAction,
  ]);

  return { handleConfirmDeleteFolder, handleDeleteRecursively };
};

export default useDeleteFolder;
