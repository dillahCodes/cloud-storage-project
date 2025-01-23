import { FirebaseUserData } from "@/features/auth/auth";
import useUser from "@/features/auth/hooks/use-user";
import { SubFolderGetData } from "@/features/folder/folder";
import useAddActivityCreatedFile from "@/features/folder/hooks/use-add-activity-created-file";
import { parentFolderSelector } from "@/features/folder/slice/parent-folder-slice";
import useAddFileSizeToStorage from "@/features/storage/hooks/use-add-file-size-to-storage";
import { db, storage } from "@/firebase/firebase-services";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ref, StorageError, uploadBytesResumable, UploadMetadata, UploadTask, UploadTaskSnapshot } from "firebase/storage";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useUploadTaskManager } from "../slice/upload-task-manager";
import useFileUploading from "./use-file-uploading";
import { CreateFolderActivity } from "@/features/folder/folder-activity";

/** Props required for handleUploadProgress function */
interface HandleUploadProgressProps {
  fileId: string;
  snapshot: UploadTaskSnapshot;
  updateFileUploadingProgress: (payload: Pick<FileUploadingList, "fileId" | "progress">) => void;
}

/** Props for uploadFileToStorage function */
interface UploadFileProps {
  selectedFile: File;
  fileId: string;
  fileName: string;
  rootFolderUserId: string;
}

/** Props for handleCreateFileData function */
interface HandleCreateFileData {
  fileId: string;
  user: FirebaseUserData | null;
  parentFolderData: SubFolderGetData | null;
  selectedFile: File;
}

/** Props for handleCreateFileStorageMetaData function */
interface HandleCreateFileStorageMetadata {
  selectedFile: File;
  rootFolderOwnerUserId: string;
}

/** Props for handleCreateActivityObjectData function */
interface HandleCreateActivityObjectData {
  selectedFile: File;
  parentFolderData: SubFolderGetData;
  user: FirebaseUserData;
}

/**
 * Updates progress and status during file upload.
 * @param props - Object containing snapshot, setStatus, updateFileUploadingProgress, and fileId.
 */
const handleUploadProgress = (props: HandleUploadProgressProps) => {
  const { snapshot, updateFileUploadingProgress, fileId } = props;

  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  if (snapshot.state === "running") {
    updateFileUploadingProgress({ fileId, progress: Math.round(progress) });
  }
};

/** Props required for handleUploadSuccess function */
interface HandleUploadSuccessProps {
  updateFileUploadingStatus: (payload: Pick<FileUploadingList, "fileId" | "status">) => void;
  fileId: string;
  resolve: (value: boolean | PromiseLike<boolean>) => void;
}

/**
 * Marks file upload as successful.
 * @param props - Contains fileId, updateFileUploadingStatus function, and resolve function for promise.
 */
const handleUploadSuccess = (props: HandleUploadSuccessProps) => {
  const { updateFileUploadingStatus, fileId, resolve } = props;
  updateFileUploadingStatus({ fileId, status: "succeeded" });
  resolve(true);
};

/**
 * Handles upload errors.
 * @param {StorageError} error - The StorageError object from Firebase Storage.
 * @param {(payload: Pick<FileUploadingList, "fileId" | "status">) => void} updateFileUploadingStatus - Function to update file uploading status in Redux store.
 * @param {string} fileId - The ID of the file that was being uploaded.
 */

interface HandleUploadErrorInterface {
  error: StorageError;
  updateFileUploadingStatus: (payload: Pick<FileUploadingList, "fileId" | "status">) => void;
  fileId: string;
}
const handleUploadError = ({ error, updateFileUploadingStatus, fileId }: HandleUploadErrorInterface) => {
  console.error("Upload failed:", error.message);

  // Doc: https://firebase.google.com/docs/storage/web/upload-files#full_example
  switch (error.code) {
    case "storage/canceled":
      updateFileUploadingStatus({ fileId, status: "canceled" });
      break;

    case "storage/unknown":
      updateFileUploadingStatus({ fileId, status: "failed" });
      break;
  }
};

/**
 * Creates the data object for a file to be stored in Firestore.
 *
 * @param {HandleCreateFileData} params - Contains the file ID, user, parent folder data, and the selected file.
 * @returns {SubFileCreateData | RootFileCreateData | null} The data object for the file to be created in Firestore.
 */
const handleCreateFileData = (params: HandleCreateFileData) => {
  const { fileId, user, parentFolderData, selectedFile } = params;

  if (!user) return null;

  if (parentFolderData) {
    const fileData: SubFileCreateData = {
      file_id: fileId,
      owner_user_id: user.uid,
      root_folder_user_id: parentFolderData.root_folder_user_id,
      parent_folder_id: parentFolderData.folder_id,
      file_name: selectedFile.name,
      file_size: selectedFile.size.toString(),
      file_type: selectedFile.type,
      created_at: serverTimestamp(),
      updated_at: null,
    };
    return fileData;
  }

  const fileData: RootFileCreateData = {
    file_id: fileId,
    owner_user_id: user.uid,
    root_folder_user_id: user.uid,
    parent_folder_id: null,
    file_name: selectedFile.name,
    file_size: selectedFile.size.toString(),
    file_type: selectedFile.type,
    created_at: serverTimestamp(),
    updated_at: null,
  };
  return fileData;
};

/**
 * Creates custom metadata for a file to be uploaded to Firebase Storage.
 * This metadata stores the file owner's ID and file size.
 *
 * @param {HandleCreateFileStorageMetadata} params - An object containing the selected file and root folder user ID.
 * @returns {UploadMetadata} The custom metadata object to be uploaded with the file.
 */
const handleCreateFileStorageMetaData = (params: HandleCreateFileStorageMetadata) => {
  const { selectedFile, rootFolderOwnerUserId } = params;

  const metadata: UploadMetadata = {
    contentType: selectedFile.type,
    customMetadata: {
      "root-folder-owner": rootFolderOwnerUserId,
      "file-size": selectedFile.size.toString(),
    },
  };

  return metadata;
};

const handleCreateActivityObjectData = (params: HandleCreateActivityObjectData) => {
  const { selectedFile, parentFolderData, user } = params;
  const activityData: CreateFolderActivity = {
    type: "create-folder-activity",
    folderId: "",
    folderName: "",
    activityId: uuidv4(),
    fileName: selectedFile.name,
    fileType: selectedFile.type,
    parentFolderId: parentFolderData.folder_id,
    parentFolderName: parentFolderData.folder_name,
    rootFolderId: parentFolderData.root_folder_id,
    rootFolderOwnerUserId: parentFolderData.root_folder_user_id,
    activityByUserId: user.uid,
    activityDate: serverTimestamp(),
  };
  return activityData;
};

/**
 * Custom hook for managing file uploads to Firebase.
 * @param parent_folder_id - Optional parent folder ID if uploading to a sub-folder.
 * @returns Object with handleSetAndUploadFile function and upload status.
 */
const useAddFile = () => {
  const { handleAddActivityCreatedFile } = useAddActivityCreatedFile();
  const { handleUploadFileSizeToStorage, handleCheckAvailableStorage } = useAddFileSizeToStorage();

  const { user } = useUser();

  const { addUploadTask } = useUploadTaskManager();
  const { addFileUploading, updateFileUploadingProgress, updateFileUploadingStatus } = useFileUploading();
  const { parentFolderData } = useSelector(parentFolderSelector);

  const parent_folder_id = useMemo(() => {
    return parentFolderData ? parentFolderData.folder_id : null;
  }, [parentFolderData]);

  /**
   * Uploads the file to Firebase Storage.
   * @param props - Contains file metadata and file itself.
   * @returns A promise that resolves to true if upload is successful.
   */
  const uploadFileToStorage = useCallback(
    (props: UploadFileProps): Promise<boolean> => {
      const { selectedFile, fileId, fileName, rootFolderUserId } = props;

      return new Promise((resolve, reject) => {
        if (!selectedFile || !user) return reject(false);

        const metadata = handleCreateFileStorageMetaData({ selectedFile, rootFolderOwnerUserId: rootFolderUserId });
        const fileRef = ref(storage, `user-files/${fileId}/${fileName}`);
        const uploadTask: UploadTask = uploadBytesResumable(fileRef, selectedFile, metadata);

        /**
         * add file status progres to slice and add uploading task to context
         */
        addUploadTask(fileId, uploadTask);
        addFileUploading({ fileId, fileName, status: "uploading", progress: 0 });

        uploadTask.on(
          "state_changed",
          (snapshot) => handleUploadProgress({ snapshot, updateFileUploadingProgress, fileId }),
          (error) => handleUploadError({ error, updateFileUploadingStatus, fileId }),
          () => handleUploadSuccess({ updateFileUploadingStatus, fileId, resolve })
        );
      });
    },
    [addFileUploading, addUploadTask, updateFileUploadingProgress, updateFileUploadingStatus, user]
  );

  /**
   * Creates metadata and uploads a root file.
   * @param selectedFile - The file to upload.
   */
  const uploadRootFile = useCallback(
    async (selectedFile: File) => {
      if (!user) return;

      const fileId = uuidv4();
      const { name: fileName } = selectedFile;
      const rootFolderUserId = user.uid;

      // check if user has enough storage
      const isAvailableStorage = await handleCheckAvailableStorage(selectedFile.size, user.uid);
      if (!isAvailableStorage) return;

      // Create file data object
      const fileData = handleCreateFileData({ fileId, user, selectedFile, parentFolderData: null });
      if (!fileData) return;

      try {
        const isUploaded = await uploadFileToStorage({ fileId, fileName, rootFolderUserId, selectedFile });
        if (!isUploaded) return;

        await Promise.all([handleUploadFileSizeToStorage({ file: selectedFile }), setDoc(doc(db, "files", fileId), fileData)]);
      } catch (error) {
        console.error("Error during file upload:", error instanceof Error ? error.message : "Unknown error");
      }
    },
    [handleUploadFileSizeToStorage, uploadFileToStorage, user, handleCheckAvailableStorage]
  );

  /**
   * Creates metadata and uploads a sub-folder file.
   * @param selectedFile - The file to upload.
   */
  const uploadSubFile = useCallback(
    async (selectedFile: File) => {
      if (!parent_folder_id || !user || !parentFolderData) return;

      const { name: fileName } = selectedFile;
      const { root_folder_user_id: rootFolderUserId } = parentFolderData;

      try {
        const fileId = uuidv4();

        // check if user has enough storage
        const storageUserId = parentFolderData.root_folder_user_id === user.uid ? user.uid : parentFolderData.root_folder_user_id;
        const isAvailableStorage = await handleCheckAvailableStorage(selectedFile.size, storageUserId);
        if (!isAvailableStorage) return;

        // Create file data object
        const fileData = handleCreateFileData({ fileId, user, selectedFile, parentFolderData });
        if (!fileData) return;

        // create activity data object
        const activityData = handleCreateActivityObjectData({ selectedFile, parentFolderData, user });

        // Perform upload actions in parallel
        await Promise.all([
          uploadFileToStorage({ fileId, fileName, rootFolderUserId, selectedFile }),
          setDoc(doc(db, "files", fileId), fileData),
          handleUploadFileSizeToStorage({ file: selectedFile }),
          handleAddActivityCreatedFile(activityData),
        ]);
      } catch (error) {
        console.error("Error during file upload:", error);
      }
    },
    [
      parent_folder_id,
      user,
      uploadFileToStorage,
      handleUploadFileSizeToStorage,
      handleAddActivityCreatedFile,
      parentFolderData,
      handleCheckAvailableStorage,
    ]
  );

  /**
   * Triggers file selection dialog and initiates upload.
   */
  const handleSetAndUploadFile = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.classList.add("hidden");
    document.body.appendChild(input);

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      parent_folder_id ? uploadSubFile(file) : uploadRootFile(file);
      document.body.removeChild(input);
    };

    input.click();
  }, [parent_folder_id, uploadRootFile, uploadSubFile]);

  return { handleSetAndUploadFile };
};

export default useAddFile;
