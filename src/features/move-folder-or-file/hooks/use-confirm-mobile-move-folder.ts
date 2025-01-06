import { FirebaseUserData } from "@/features/auth/auth";
import useUser from "@/features/auth/hooks/use-user";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { auth, db } from "@/firebase/firebase-services";
import { Dispatch } from "@reduxjs/toolkit";
import { collection, doc, DocumentData, getDoc, getDocs, query, QuerySnapshot, updateDoc, where } from "firebase/firestore";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate, useSearchParams } from "react-router-dom";
import { mobileMoveSelector, setMobileMoveFolderMoveErrorMessage, setMobileMoveStatus } from "../slice/mobile-move-slice";
import { moveFoldersAndFilesDataSelector } from "../slice/move-folders-and-files-data-slice";

interface MoveFolderParams {
  folderId: string;
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
  folderId: string | null;
  foldersData: RootFolderGetData[] | SubFolderGetData[] | null;
  folderWillBeMoved: RootFolderGetData | SubFolderGetData | null;
  searchParams: URLSearchParams;
  parentFolderData: RootFolderGetData | SubFolderGetData | null;
  dispatch: Dispatch;
  navigate: NavigateFunction;
  moveFromPath: string;
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
 * @param {SubFileGetData} files - The file data object to serialize.
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
 * Navigates to the appropriate folder location after a folder move operation.
 *
 * This function checks the current user's authentication status and the
 * destination folder's data to determine the correct navigation path. If the
 * user is not authenticated, it navigates to their storage root. If the folder
 * is moved to the root, it navigates to the user's storage root. If moved to
 * a subfolder, it navigates to the subfolder's path, differentiating between
 * the user's own storage and shared storage based on folder ownership.
 *
 * @param {RootFolderGetData | SubFolderGetData | null} parentFolderData - The
 *    data of the parent folder where the folder is moved.
 * @param {NavigateFunction} navigate - The navigation function used to change
 *    routes.
 */

const navigateAfterMoveFolder = (parentFolderData: RootFolderGetData | SubFolderGetData | null, navigate: NavigateFunction) => {
  const { currentUser } = auth;

  if (!currentUser) return navigate("/storage/my-storage");

  const isUserMovedFolderToRoot = !parentFolderData;
  const isUserMovedFolderToSubFolder = parentFolderData;
  const isRootFolderMine = isUserMovedFolderToSubFolder && parentFolderData.root_folder_user_id === currentUser.uid;

  if (isUserMovedFolderToRoot) return navigate("/storage/my-storage");
  if (isUserMovedFolderToSubFolder && isRootFolderMine) return navigate(`/storage/folders/${parentFolderData.folder_id}?st=my-storage`);
  if (isUserMovedFolderToSubFolder && !isRootFolderMine) return navigate(`/storage/folders/${parentFolderData.folder_id}?st=shared-with-me`);
};

/**
 * Validates the first set of parameters for moving a folder.
 *
 * This function checks that the folder ID, move from path, and current user
 * are all present and valid. If any of these parameters are invalid or
 * missing, it dispatches an error message and navigates back to the move
 * from path.
 *
 * @param {HandleMoveFolderFirstValidationParams} params - The parameters required for validation.
 * @returns {boolean} true if the validation passes, false otherwise.
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
 * Validates the parameters for moving a folder.
 *
 * @param {HandleMoveFolderSecondValidationParams} params - The parameters required for validation.
 * @param {string} params.folderId - The ID of the folder to be moved.
 * @param {boolean} params.folderWillBeMoved - Indicates if the folder is ready to be moved.
 * @param {Array} params.foldersData - The list of existing folders data.
 * @param {URLSearchParams} params.searchParams - The URL search parameters.
 * @param {Dispatch} params.dispatch - The Redux dispatch function.
 * @param {string} params.moveFromPath - The original path from which the folder is being moved.
 * @param {NavigateFunction} params.navigate - The function to navigate to different routes.
 *
 * @returns {boolean} - Returns true if all validations pass, otherwise false.
 *
 * Dispatches an error message and navigates back if validation fails for:
 * - The folder is not valid for moving.
 * - The folder already exists in the destination.
 * - Attempting to move a folder to itself.
 */

const handleMoveFolderSecondValidation = (params: HandleMoveFolderSecondValidationParams): boolean => {
  const { folderId, folderWillBeMoved, foldersData, searchParams, dispatch, moveFromPath, navigate, parentFolderData } = params;

  const isExistingFolder = foldersData?.some((folder) => folder.folder_id === folderId);
  const folderWillBeMovedIsInvalid = !folderWillBeMoved;
  const isMoveToSelf = searchParams.get("parentId") === folderId;
  const isMoveToSelfSubFolder = folderWillBeMoved?.folder_id === parentFolderData?.root_folder_id;

  const validations = [
    { condition: folderWillBeMovedIsInvalid, message: "Something went wrong. Please try again." },
    { condition: isExistingFolder, message: "folder already exists." },
    { condition: isMoveToSelf, message: "You cannot move a folder to its own location." },
    { condition: isMoveToSelfSubFolder, message: "You cannot move a folder to its own subfolder." },
  ];

  const failedValidation = validations.find((validation) => validation.condition);

  if (failedValidation) {
    dispatch(setMobileMoveFolderMoveErrorMessage(failedValidation.message));
    navigate(moveFromPath);
    return false;
  }

  return true;
};

/**
 * Fetches all the files in a given folder by its ID.
 *
 * @param {string} folderId - The ID of the folder whose files are to be fetched.
 * @returns {Promise<QuerySnapshot<DocumentData> | null>} A promise that resolves to the snapshot of the files in the folder, or null if the folder does not exist.
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

const useConfirmMobileMoveFolder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { "0": searchParams } = useSearchParams();

  const { user } = useUser();
  const { parentFolderData, foldersData } = useSelector(moveFoldersAndFilesDataSelector);
  const { folderId, moveFromLocationPath } = useSelector(mobileMoveSelector);

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

  const confirmMobileMoveFolder = useCallback(async () => {
    /**
     * first validation
     */
    const firstValidation = handleMoveFolderFirstValidation({ folderId, moveFrom: moveFromLocationPath, user, dispatch, navigate });
    if (!firstValidation) return;

    try {
      dispatch(setMobileMoveStatus("loading"));

      /**
       * fetch folder will be moved
       */
      const folderWillBeMoved = await handleGetFolderById(folderId as string);

      /**
       * second validation
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
      });
      if (!secondValidation) {
        dispatch(setMobileMoveStatus("error"));
        return;
      }

      /**
       * if parent folder data is null, it means that the folder will be moved to the root folder
       * and if parent folder is not null, it means that the folder will be moved to another folder (sub folder)
       */
      parentFolderData
        ? await handleMoveFolderRecursively({
            folderId: folderId as string,
            newParentFolderId: parentFolderData.folder_id,
            newRootFolderId: parentFolderData.root_folder_id,
            newRootFolderOwnerUserId: parentFolderData.root_folder_user_id,
          })
        : await handleMoveFolderRecursively({
            folderId: folderId as string,
            newParentFolderId: null,
            newRootFolderId: folderId,
            newRootFolderOwnerUserId: user!.uid,
          });

      /**
       * navigate after move folder
       */
      navigateAfterMoveFolder(parentFolderData, navigate);

      dispatch(setMobileMoveStatus("success"));
    } catch (error) {
      dispatch(setMobileMoveStatus("error"));
      console.error("error while move folder: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  }, [folderId, moveFromLocationPath, navigate, user, dispatch, foldersData, searchParams, parentFolderData, handleMoveFolderRecursively]);

  return { confirmMobileMoveFolder };
};
export default useConfirmMobileMoveFolder;
