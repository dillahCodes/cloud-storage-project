import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MoveFolderOrFileMobileState } from "../move-folder-or-file";

const initialState: MoveFolderOrFileMobileState = {
  folderId: null,
  folderName: null,

  fileId: null,
  fileName: null,
  fileType: null,

  moveFromLocationPath: null,

  folderMoveErrorMessage: null,
  moveStatus: "idle",
};

export const mobileMoveSlice = createSlice({
  name: "mobileMove",
  initialState,
  reducers: {
    setMobileMoveFolderId: (state, action: PayloadAction<string>) => {
      state.folderId = action.payload;
    },
    setMobileMoveFolderName: (state, action: PayloadAction<string>) => {
      state.folderName = action.payload;
    },
    setMobileMoveFileId: (state, action: PayloadAction<string>) => {
      state.fileId = action.payload;
    },
    setMobileMoveFileName: (state, action: PayloadAction<string>) => {
      state.fileName = action.payload;
    },
    setMobileMoveFileType: (state, action: PayloadAction<string>) => {
      state.fileType = action.payload;
    },
    setMobileMoveFromLocationPath: (state, action: PayloadAction<string>) => {
      state.moveFromLocationPath = action.payload;
    },
    setMobileMoveStatus: (state, action: PayloadAction<MoveFolderOrFileMobileState["moveStatus"]>) => {
      state.moveStatus = action.payload;
    },
    setMobileMoveFolderMoveErrorMessage: (state, action: PayloadAction<MoveFolderOrFileMobileState["folderMoveErrorMessage"]>) => {
      state.folderMoveErrorMessage = action.payload;
    },
    resetMobileMoveState: () => initialState,
  },
});

export const {
  setMobileMoveFolderId,
  setMobileMoveFolderName,
  setMobileMoveFromLocationPath,
  setMobileMoveStatus,
  setMobileMoveFolderMoveErrorMessage,
  setMobileMoveFileId,
  resetMobileMoveState,
  setMobileMoveFileName,
  setMobileMoveFileType,
} = mobileMoveSlice.actions;
export const mobileMoveSelector = (state: RootState) => state.mobileMove;
export default mobileMoveSlice.reducer;
