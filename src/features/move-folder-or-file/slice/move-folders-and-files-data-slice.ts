import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MoveFolderOrFileFoldersAndFilesDataState } from "../move-folder-or-file";
import { RootState } from "@/store/store";

const initialState: MoveFolderOrFileFoldersAndFilesDataState = {
  filesData: null,
  foldersData: null,
  parentFolderData: null,

  fileStatus: "idle",
  folderStatus: "idle",
  parentFolderStatus: "idle",
};

export const moveFoldersAndFilesDataSlice = createSlice({
  name: "moveFoldersAndFilesData",
  initialState,
  reducers: {
    setMoveFoldersData: (state, action: PayloadAction<MoveFolderOrFileFoldersAndFilesDataState["foldersData"]>) => {
      state.foldersData = action.payload;
    },
    setMoveFilesData: (state, action: PayloadAction<MoveFolderOrFileFoldersAndFilesDataState["filesData"]>) => {
      state.filesData = action.payload;
    },
    setMoveParentFolderData: (state, action: PayloadAction<MoveFolderOrFileFoldersAndFilesDataState["parentFolderData"]>) => {
      state.parentFolderData = action.payload;
    },

    setMoveFolderStatus: (state, action: PayloadAction<MoveFolderOrFileFoldersAndFilesDataState["folderStatus"]>) => {
      state.folderStatus = action.payload;
    },
    setMoveFileStatus: (state, action: PayloadAction<MoveFolderOrFileFoldersAndFilesDataState["fileStatus"]>) => {
      state.fileStatus = action.payload;
    },
    setMoveParentFolderStatus: (state, action: PayloadAction<MoveFolderOrFileFoldersAndFilesDataState["parentFolderStatus"]>) => {
      state.parentFolderStatus = action.payload;
    },
  },
});

export const { setMoveFoldersData, setMoveFilesData, setMoveFolderStatus, setMoveFileStatus, setMoveParentFolderData, setMoveParentFolderStatus } =
  moveFoldersAndFilesDataSlice.actions;
export const moveFoldersAndFilesDataSelector = (state: RootState) => state.moveFoldersAndFilesData;
export default moveFoldersAndFilesDataSlice.reducer;
