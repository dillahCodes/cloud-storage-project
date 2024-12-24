import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentFoldersState } from "../current-folders";
import { RootState } from "@/store/store";

const initialState: CurrentFoldersState = {
  folders: [],
  status: "idle",
};

export const currentFoldersSlice = createSlice({
  name: "currentFolders",
  initialState,
  reducers: {
    setCurrentFolders: (state, action: PayloadAction<CurrentFoldersState["folders"]>) => {
      state.folders = action.payload;
    },

    setCurrentFoldersStatus: (state, action: PayloadAction<CurrentFoldersState["status"]>) => {
      state.status = action.payload;
    },
  },
});

export const { setCurrentFolders, setCurrentFoldersStatus } = currentFoldersSlice.actions;
export const currentFolderSelector = (state: RootState) => state.currentFolders;
export default currentFoldersSlice.reducer;
