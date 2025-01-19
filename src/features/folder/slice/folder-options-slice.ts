import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FolderOptionsState } from "../folder-options";
import { RootState } from "@/store/store";

const initialState: FolderOptionsState = {
  actionSelected: null,
  selectedFolderData: null,
};

export const folderOptionsSlice = createSlice({
  name: "folderOptions",
  initialState,
  reducers: {
    setFolderOptionsAction: (state, action: PayloadAction<FolderOptionsState["actionSelected"]>) => {
      state.actionSelected = action.payload;
    },
    setFolderOptionsFolderData: (state, action: PayloadAction<FolderOptionsState["selectedFolderData"]>) => {
      state.selectedFolderData = action.payload;
    },
    resetFolderOptions: () => initialState,
  },
});

export const { setFolderOptionsAction, setFolderOptionsFolderData, resetFolderOptions } = folderOptionsSlice.actions;
export const folderOptionsSelector = (state: RootState) => state.folderOptions;
export default folderOptionsSlice.reducer;
