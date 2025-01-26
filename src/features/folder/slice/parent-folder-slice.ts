import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ParentFolderData } from "../folder";

const initialState: ParentFolderData = {
  isValidParentFolder: false,
  parentFolderData: null,
  status: "idle",
};

export const parentFolderSlice = createSlice({
  name: "parentFolder",
  initialState,
  reducers: {
    setParentFolderStatus: (state, action: PayloadAction<ParentFolderData["status"]>) => {
      state.status = action.payload;
    },
    setParentFolder: (state, action: PayloadAction<Pick<ParentFolderData, "isValidParentFolder" | "parentFolderData">>) => {
      state.isValidParentFolder = action.payload.isValidParentFolder;
      state.parentFolderData = action.payload.parentFolderData;
      state.status = "succeeded";
    },
    setStatusParentFolder: (state, action: PayloadAction<ParentFolderData["status"]>) => {
      state.status = action.payload;
    },
    resetParentFolder: (state) => {
      state.isValidParentFolder = false;
      state.parentFolderData = null;
      state.status = "idle";
    },
  },
});

export const { resetParentFolder, setParentFolder, setStatusParentFolder, setParentFolderStatus } = parentFolderSlice.actions;
export const parentFolderSelector = (state: RootState) => state.parentFolder;
export default parentFolderSlice.reducer;
