import { UploadTask } from "firebase/storage";
import { createContext, useCallback, useContext, useRef } from "react";
import useFileUploading from "../hooks/use-file-uploading";
import usePreventRefreshDuringUpload from "../hooks/use-prevent-refresh-during-upload";

interface UploadTaskMap {
  [fileId: string]: UploadTask;
}

interface UploadTaskManagerContextProps {
  addUploadTask: (fileId: string, task: UploadTask) => void;
  getUploadTask: (fileId: string) => UploadTask | undefined;
  cancelUploadTask: (fileId: string) => void;
  cancelAllUploads: () => void;
  hasActiveUploads: () => boolean;
}

const UploadTaskManagerContext = createContext<UploadTaskManagerContextProps | undefined>(undefined);

export const UploadTaskManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fileUploadingState } = useFileUploading();
  const canRefresh = fileUploadingState.fileUploadingList.every((file) => file.status !== "uploading") ? true : false;
  usePreventRefreshDuringUpload(canRefresh);

  const uploadTaskMapRef = useRef<UploadTaskMap>({});

  const addUploadTask = useCallback((fileId: string, task: UploadTask) => {
    uploadTaskMapRef.current[fileId] = task;
  }, []);

  const cancelUploadTask = useCallback((fileId: string) => {
    const task = uploadTaskMapRef.current[fileId];
    if (task) task.cancel();
    delete uploadTaskMapRef.current[fileId];
  }, []);

  const cancelAllUploads = useCallback(() => {
    Object.values(uploadTaskMapRef.current).forEach((task) => task.cancel());
    uploadTaskMapRef.current = {};
  }, []);

  const hasActiveUploads = useCallback(() => Object.keys(uploadTaskMapRef.current).length > 0, []);

  return (
    <UploadTaskManagerContext.Provider
      value={{
        addUploadTask,
        getUploadTask: (fileId: string) => uploadTaskMapRef.current[fileId],
        cancelUploadTask,
        cancelAllUploads,
        hasActiveUploads,
      }}
    >
      {children}
    </UploadTaskManagerContext.Provider>
  );
};

// Hook to use in components
// eslint-disable-next-line
export const useUploadTaskManager = (): UploadTaskManagerContextProps => {
  const context = useContext(UploadTaskManagerContext);
  if (!context) throw new Error("useUploadTaskManager must be used within an UploadTaskManagerProvider");
  return context;
};
