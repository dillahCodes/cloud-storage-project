import { useDispatch, useSelector } from "react-redux";
import {
  addFileUploading as addFileUploadingState,
  clearFileUploading as clearFileUploading,
  FileUploadingSelector,
  removeFileUploading as removeFileUploadingState,
  updateFileUploadingStatus as updateFileUploadingStatusState,
  updateFileUploadingProgress as updateFileUploadingProgressState,
} from "../slice/file-uploading-slice";

const useFileUploading = () => {
  const dispatch = useDispatch();
  const fileUploadingState = useSelector(FileUploadingSelector);

  const addFileUploading = (payload: FileUploadingList) => dispatch(addFileUploadingState(payload));
  const removeFileUploading = (payload: string) => dispatch(removeFileUploadingState({ fileId: payload }));
  const updateFileUploadingStatus = (payload: Pick<FileUploadingList, "fileId" | "status">) => dispatch(updateFileUploadingStatusState(payload));
  const updateFileUploadingProgress = (payload: Pick<FileUploadingList, "fileId" | "progress">) =>
    dispatch(updateFileUploadingProgressState(payload));

  const clearFileUploadings = () => dispatch(clearFileUploading());

  return {
    fileUploadingState,
    addFileUploading,
    removeFileUploading,
    clearFileUploadings,
    updateFileUploadingStatus,
    updateFileUploadingProgress,
  };
};

export default useFileUploading;
