import { FirebaseUserData } from "@/features/auth/auth";
import useUser from "@/features/auth/hooks/use-user";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { db, storage } from "@/firebase/firebase-services";
import useDetectLocation from "@/hooks/use-detect-location";
import abbreviateText from "@/util/abbreviate-text";
import { Dispatch } from "@reduxjs/toolkit";
import { message } from "antd";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, updateMetadata } from "firebase/storage";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { mobileMoveSelector, resetMobileMoveState, setMobileMoveFolderMoveErrorMessage, setMobileMoveStatus } from "../slice/mobile-move-slice";
import { moveFoldersAndFilesDataSelector, resetMoveDataState } from "../slice/move-folders-and-files-data-slice";

interface HandleChangeSubFileMetadata {
  fileId: string;
  parentFolderData: RootFolderGetData | SubFolderGetData;
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

const MOBILE_SUCCESS_KEY = "file-move-success-message";

const handleChangeSubFileMetadata = async ({ fileId, parentFolderData }: HandleChangeSubFileMetadata) => {
  const fileRef = doc(db, "files", fileId);
  await updateDoc(fileRef, {
    root_folder_user_id: parentFolderData.root_folder_user_id,
    parent_folder_id: parentFolderData.folder_id,
  });
};

const handleChangeFileMetadataToRootFile = async (fileId: string, userId: string) => {
  const fileRef = doc(db, "files", fileId);
  await updateDoc(fileRef, { root_folder_user_id: userId, parent_folder_id: null });
};

const handleNavigateAfterMovedToSubFolder = ({ parentFolderData, user, navigate }: HandleNavigateAfterMovedToSubFolder) => {
  const isRootFolderMine = parentFolderData.root_folder_user_id === user.uid;
  const navigateUrl = `/storage/folders/${parentFolderData!.folder_id}?st=${isRootFolderMine ? "my-storage" : "shared-with-me"}`;
  navigate(navigateUrl);
};

const handleGetFileById = async (fileId: string) => {
  const docRef = doc(db, "files", fileId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (JSON.parse(JSON.stringify(docSnap.data())) as SubFileGetData | RootFileGetData) : null;
};

const handleUpdateFileMetadataInFirebaseStorage = async ({ fileId, fileName, rootFolderOwner }: HandleUpdateFileMetadataInFireabseStorage) => {
  const fileRef = ref(storage, `user-files/${fileId}/${fileName}`);
  const newMetadata = {
    customMetadata: {
      "root-folder-owner": rootFolderOwner || "",
    },
  };
  await updateMetadata(fileRef, newMetadata);
};

interface HandleValidateBeforeMoveFile {
  user: FirebaseUserData | null;

  fileId: string | null;
  filesData: RootFileGetData[] | SubFileGetData[] | null;

  moveFromLocationPath: string | null;
  parentFolderData: RootFolderGetData | SubFolderGetData | null;

  isSubMovePage: boolean;
  isRootMovePage: boolean;

  dispatch: Dispatch;
  navigate: NavigateFunction;
}
const handleValidateBeforeMoveFile = async (params: HandleValidateBeforeMoveFile) => {
  const { user, dispatch, moveFromLocationPath, navigate, parentFolderData, isSubMovePage, isRootMovePage, fileId, filesData } = params;

  const fileWillBeMoved = fileId ? await handleGetFileById(fileId) : null;

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
  const isRootFolderMine: boolean = parentFolderData?.root_folder_user_id === user?.uid;

  /**
   * move validation
   */
  // const isNotFileOwnerMoveToSharedSubFolder: boolean = isNotFileOwner && isSubMovePage && !isRootFolderMine;
  const isNotFileOwnerMoveToRoot: boolean = isNotFileOwner && !parentFolderData && isRootMovePage;
  const isNotFileOwnerMoveToSelfSubFolder: boolean = isNotFileOwner && isSubMovePage && isRootFolderMine;

  const validations = [
    { condition: !fileId, message: "file not found, please try again" },
    { condition: isUserNotExist, message: "something went wrong, please try again" },
    { condition: isInvalidSubMove, message: "something went wrong, please try again" },
    { condition: isInvalidRootMove, message: "something went wrong, please try again" },
    { condition: !fileWillBeMoved, message: "file not found, please try again" },
    { condition: isFileExist, message: "file already exists" },
    { condition: isNotFileOwnerMoveToRoot || isNotFileOwnerMoveToSelfSubFolder, message: "Only file owner can move to this location." },
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

  const handleMoveFileToSubFolder = useCallback(async () => {
    /**
     * Set the loading state and validate before moving the file.
     */
    dispatch(setMobileMoveStatus("loading"));

    /**
     * Update the file metadata and navigate to the new location upon success.
     */
    await handleChangeSubFileMetadata({ fileId: fileId!, parentFolderData: parentFolderData! });
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
  }, [parentFolderData, fileId, fileName, user, navigate, dispatch, showSuccess]);

  const handleMoveFileToRoot = useCallback(async () => {
    /**
     * validate before move to root
     */
    dispatch(setMobileMoveStatus("loading"));

    /*
     * update file to root file
     */
    await handleChangeFileMetadataToRootFile(fileId!, user!.uid);
    navigate("/storage/my-storage");

    /**
     * reset state and show success message
     */
    showSuccess(`${abbreviateText(fileName!, 15)} moved to My Storage`);
    dispatch(resetMobileMoveState());
    dispatch(resetMoveDataState());
    dispatch(setMobileMoveStatus("success"));
  }, [fileId, user, dispatch, navigate, fileName, showSuccess]);

  /**
   * handle confirm move file
   */
  const confirmMoveFile = useCallback(async () => {
    try {
      const isValidationPass = await handleValidateBeforeMoveFile({
        dispatch,
        moveFromLocationPath,
        navigate,
        parentFolderData,
        user,
        isSubMovePage: isSubMoveFolderOrFileLocation,
        isRootMovePage: isRootMoveFolderOrFileLocation,
        fileId,
        filesData,
      });
      if (!isValidationPass) return;

      parentFolderData ? await handleMoveFileToSubFolder() : await handleMoveFileToRoot();

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
