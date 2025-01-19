import { FirebaseUserData } from "@/features/auth/auth";
import useUser from "@/features/auth/hooks/use-user";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { db, storage } from "@/firebase/firebase-services";
import useDetectLocation from "@/hooks/use-detect-location";
import { message } from "antd";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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
}

interface HandleValidationMoveFile {
  user: FirebaseUserData | null;
  fileId: string | null;
  fileName: string | null;
  fileType: string | null;
  parentFolderData: RootFolderGetData | SubFolderGetData | null;
  isSubSharedWithMeLocation: boolean;
  filesData: RootFileGetData[] | SubFileGetData[] | null;
}

const handleUpdateFileMetadataInFirebaseStorage = async ({ fileId, fileName, rootFolderOwner }: HandleUpdateFileMetadataInFireabseStorage) => {
  const fileRef = ref(storage, `user-files/${fileId}/${fileName}`);
  const newMetadata = {
    customMetadata: {
      "root-folder-owner": rootFolderOwner || "",
    },
  };
  await updateMetadata(fileRef, newMetadata);
};

const handleGetFileInFireabseFirestore = async (fileId: string) => {
  const fileDoc = doc(db, "files", fileId);
  const fileSnap = await getDoc(fileDoc);
  return fileSnap.exists() ? (JSON.parse(JSON.stringify(fileSnap.data())) as RootFileGetData | SubFileGetData) : null;
};

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

const handleValidationMoveFile = async (param: HandleValidationMoveFile) => {
  const { user, fileId, fileName, fileType, isSubSharedWithMeLocation, parentFolderData, filesData } = param;

  const isFileDataExist = Boolean(fileId && fileName && fileType);
  const fileWillBeMoved: RootFileGetData | SubFileGetData | null = await handleGetFileInFireabseFirestore(fileId!);

  const isNotFileOwner: boolean = user!.uid !== fileWillBeMoved!.owner_user_id;
  const isNotOwnerMovingToRoot: boolean = isNotFileOwner && !parentFolderData && isSubSharedWithMeLocation;

  const isRootFolderMine: boolean = parentFolderData?.root_folder_user_id === user!.uid;
  const isMovingSharedFileToMyFolder: boolean = isRootFolderMine && isSubSharedWithMeLocation;
  const isMovingSharedFileNotOwnedByMe: boolean = isMovingSharedFileToMyFolder && isNotFileOwner;

  const isFileExist = !!filesData?.some((file) => file.file_id === fileId);

  // define conditions
  const conditions = [
    {
      condition: !user,
      message: "Something went wrong, please try again.",
    },
    {
      condition: !isFileDataExist || !fileWillBeMoved,
      message: "File not found.",
    },
    {
      condition: isNotOwnerMovingToRoot || isMovingSharedFileNotOwnedByMe,
      message: "Only file owner can move to this location.",
    },
    {
      condition: isFileExist,
      message: "File already exists.",
    },
    // add new conditions from here
  ];

  // Run validations and return message
  for (const { condition, message } of conditions) {
    if (condition) return { success: false, message };
  }

  // default return
  return { success: true, message: "" };
};

const useConfirmDekstopMoveFile = () => {
  const dispatch = useDispatch();
  /**
   * parent folder and file state
   */
  const { fileName, fileId, fileType } = useSelector(dekstopMoveSelector);
  const { parentFolderData, filesData } = useSelector(moveFoldersAndFilesDataSelector);
  const { user } = useUser();

  /**
   * detect location hooks
   */
  const { isSubSharedWithMeLocation } = useDetectLocation();

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
      const validations = await handleValidationMoveFile({
        user,
        fileId,
        fileName,
        fileType,
        isSubSharedWithMeLocation,
        parentFolderData,
        filesData,
      });
      if (!validations.success) {
        dispatch(setDekstopMoveStatus("error"));
        message.open({ type: "error", content: validations.message, className: "font-archivo text-sm" });
        return;
      }

      /**
       * update file metadata
       */
      parentFolderData
        ? await handleChangeSubFileMetadata({ fileId: fileId!, parentFolderData })
        : await handleChangeFileMetadataToRootFile(fileId!, user!.uid);

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
  }, [fileId, parentFolderData, user, fileName, fileType, dispatch, isSubSharedWithMeLocation, filesData]);

  return { handleConfirmDekstopMoveFile };
};

export default useConfirmDekstopMoveFile;
