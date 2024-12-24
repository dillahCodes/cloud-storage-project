import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: FileUploadingState = {
  fileUploadingList: [],
};

export const fileUploadingSlice = createSlice({
  name: "fileUploading",
  initialState,
  reducers: {
    addFileUploading: (state, action: PayloadAction<FileUploadingList>) => {
      state.fileUploadingList.push(action.payload);
    },
    removeFileUploading: (state, action: PayloadAction<Pick<FileUploadingList, "fileId">>) => {
      state.fileUploadingList = state.fileUploadingList.filter((file) => file.fileId !== action.payload.fileId);
    },
    updateFileUploadingProgress: (state, action: PayloadAction<Pick<FileUploadingList, "fileId" | "progress">>) => {
      const index = state.fileUploadingList.findIndex((file) => file.fileId === action.payload.fileId);
      if (index !== -1) state.fileUploadingList[index].progress = action.payload.progress;
    },
    updateFileUploadingStatus: (state, action: PayloadAction<Pick<FileUploadingList, "fileId" | "status">>) => {
      const index = state.fileUploadingList.findIndex((file) => file.fileId === action.payload.fileId);
      if (index !== -1) state.fileUploadingList[index].status = action.payload.status;
    },
    clearFileUploading: (state) => {
      state.fileUploadingList = [];
    },
  },
});

export const { addFileUploading, clearFileUploading, removeFileUploading, updateFileUploadingProgress, updateFileUploadingStatus } =
  fileUploadingSlice.actions;
export const FileUploadingSelector = (state: RootState) => state.fileUploading;
export default fileUploadingSlice.reducer;
