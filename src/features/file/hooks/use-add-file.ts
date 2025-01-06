import { ParentFolderData, SubFolderGetData } from "@/features/folder/folder";
import { auth, db, storage } from "@/firebase/firebase-services";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ref, StorageError, uploadBytesResumable, UploadMetadata, UploadTask, UploadTaskSnapshot } from "firebase/storage";
import { useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useUploadTaskManager } from "../slice/upload-task-manager";
import useFileUploading from "./use-file-uploading";
import useAddActivityCreatedFile from "@/features/folder/hooks/use-add-activity-created-file";

/** Props required for handleUploadProgress function */
interface HandleUploadProgressProps {
  fileId: string;
  snapshot: UploadTaskSnapshot;
  setStatus: (status: FileResponseStatus) => void;
  updateFileUploadingProgress: (payload: Pick<FileUploadingList, "fileId" | "progress">) => void;
}

/**
 * Updates progress and status during file upload.
 * @param props - Object containing snapshot, setStatus, updateFileUploadingProgress, and fileId.
 */
const handleUploadProgress = (props: HandleUploadProgressProps) => {
  const { setStatus, snapshot, updateFileUploadingProgress, fileId } = props;

  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  const statusMessage = `Upload progress: ${Math.round(progress)}%`;

  if (snapshot.state === "running") {
    updateFileUploadingProgress({ fileId, progress: Math.round(progress) });
    setStatus({
      progresUpload: { progress: Math.round(progress), message: statusMessage },
      message: "Uploading file...",
      status: "loading",
      type: "info",
    });
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

/** Props for useAddFile hook */
interface UseAddFileProps {
  parentFolderData: ParentFolderData;
}

/**
 * Custom hook for managing file uploads to Firebase.
 * @param parent_folder_id - Optional parent folder ID if uploading to a sub-folder.
 * @returns Object with handleSetAndUploadFile function and upload status.
 */
const useAddFile = ({ parentFolderData }: UseAddFileProps) => {
  const { handleAddActivityCreatedFile } = useAddActivityCreatedFile();

  const { addUploadTask } = useUploadTaskManager();
  const { addFileUploading, updateFileUploadingProgress, updateFileUploadingStatus } = useFileUploading();
  const [addFileStatus, setAddFileStatus] = useState<FileResponseStatus>({
    message: "",
    status: "idle",
    type: null,
  });

  const parent_folder_id = useMemo(() => parentFolderData.parentFolderData?.folder_id, [parentFolderData]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /** Props for uploadFileToStorage function */
  interface UploadFileProps {
    selectedFile: File;
    fileId: string;
    fileName: string;
    rootFolderUserId: string;
  }

  /**
   * Uploads the file to Firebase Storage.
   * @param props - Contains file metadata and file itself.
   * @returns A promise that resolves to true if upload is successful.
   */
  const uploadFileToStorage = (props: UploadFileProps): Promise<boolean> => {
    const { selectedFile, fileId, fileName, rootFolderUserId } = props;
    const { currentUser } = auth;

    return new Promise((resolve, reject) => {
      if (!selectedFile || !currentUser) return reject(false);

      const metadata: UploadMetadata = {
        contentType: selectedFile.type,
        customMetadata: { "owner-file": currentUser.uid, "root-folder-owner": rootFolderUserId },
      };

      const fileRef = ref(storage, `user-files/${fileId}/${fileName}`);
      const uploadTask: UploadTask = uploadBytesResumable(fileRef, selectedFile, metadata);

      /**
       * add file status progres to slice and add uploading task to context
       */
      addUploadTask(fileId, uploadTask);
      addFileUploading({ fileId, fileName, status: "uploading", progress: 0 });

      uploadTask.on(
        "state_changed",
        (snapshot) => handleUploadProgress({ setStatus: setAddFileStatus, snapshot, updateFileUploadingProgress, fileId }),
        (error) => handleUploadError({ error, updateFileUploadingStatus, fileId }),
        () => handleUploadSuccess({ updateFileUploadingStatus, fileId, resolve })
      );
    });
  };

  /**
   * Creates metadata and uploads a root file.
   * @param selectedFile - The file to upload.
   */
  const uploadRootFile = async (selectedFile: File) => {
    const { currentUser } = auth;
    if (!currentUser) return;

    setAddFileStatus({ status: "loading", message: "Uploading file...", type: "info" });

    const fileId = uuidv4();
    const fileData: RootFileCreateData = {
      file_id: fileId,
      owner_user_id: currentUser.uid,
      root_folder_user_id: currentUser.uid,
      parent_folder_id: null,
      file_name: selectedFile.name,
      file_size: selectedFile.size.toString(),
      file_type: selectedFile.type,
      is_password: false,
      created_at: serverTimestamp(),
      updated_at: null,
    };

    try {
      const isUploaded = await uploadFileToStorage({
        fileId,
        fileName: selectedFile.name,
        rootFolderUserId: currentUser.uid,
        selectedFile,
      });

      if (isUploaded) {
        await setDoc(doc(db, "files", fileId), fileData);
        setAddFileStatus({ status: "succeeded", message: "File uploaded successfully!", type: "success" });
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setAddFileStatus({ status: "failed", message: "Upload failed.", type: "error" });
    }
  };

  /**
   * Creates metadata and uploads a sub-folder file.
   * @param selectedFile - The file to upload.
   */
  const uploadSubFile = async (selectedFile: File) => {
    const { currentUser } = auth;
    if (!parent_folder_id || !currentUser) return;

    const fileId = uuidv4();
    const parentFolderRef = doc(db, "folders", parent_folder_id);
    const parentFolderSnapshot = await getDoc(parentFolderRef);
    const parentFolderData = parentFolderSnapshot.data() as SubFolderGetData;

    const fileData: SubFileCreateData = {
      file_id: fileId,
      owner_user_id: currentUser.uid,
      root_folder_user_id: parentFolderData.root_folder_user_id,
      parent_folder_id,
      file_name: selectedFile.name,
      file_size: selectedFile.size.toString(),
      file_type: selectedFile.type,
      is_password: false,
      created_at: serverTimestamp(),
      updated_at: null,
    };

    try {
      const isUploaded = await uploadFileToStorage({
        fileId,
        fileName: selectedFile.name,
        rootFolderUserId: parentFolderData.root_folder_user_id,
        selectedFile,
      });
      if (isUploaded) {
        await setDoc(doc(db, "files", fileId), fileData);
        handleAddActivityCreatedFile({
          type: "create-folder-activity",
          activityId: uuidv4(),

          fileName: selectedFile.name,
          fileType: selectedFile.type,

          folderId: "",
          folderName: "",

          parentFolderId: parentFolderData.folder_id,
          parentFolderName: parentFolderData.folder_name,

          rootFolderId: parentFolderData.root_folder_id,
          rootFolderOwnerUserId: parentFolderData.root_folder_user_id,

          activityByUserId: currentUser.uid,
          activityDate: serverTimestamp(),
        });
        setAddFileStatus({ status: "succeeded", message: "File uploaded successfully!", type: "success" });
      }
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  /**
   * Triggers file selection dialog and initiates upload.
   */
  const handleSetAndUploadFile = () => {
    if (!fileInputRef.current) {
      fileInputRef.current = document.createElement("input");
      fileInputRef.current.setAttribute("type", "file");
      fileInputRef.current.style.display = "none";
      document.body.appendChild(fileInputRef.current);
    }

    fileInputRef.current.value = "";
    fileInputRef.current.click();

    fileInputRef.current.onchange = () => {
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        parent_folder_id ? uploadSubFile(file) : uploadRootFile(file);
      }
    };
  };

  return { handleSetAndUploadFile, addFileStatus };
};

export default useAddFile;
