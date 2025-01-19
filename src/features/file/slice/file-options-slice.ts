import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: FileOptionsState = {
  activeAction: null,
  activeFileData: null,
};

export const fileOptionsSlice = createSlice({
  name: "fileOptions",
  initialState,
  reducers: {
    setActiveFileData: (state, action: PayloadAction<FileOptionsState["activeFileData"]>) => {
      state.activeFileData = action.payload;
    },
    setActiveAction: (state, action: PayloadAction<FileOptionsState["activeAction"]>) => {
      state.activeAction = action.payload;
    },
    resetFileOptions: () => initialState,
  },
});

export const { setActiveFileData, setActiveAction, resetFileOptions } = fileOptionsSlice.actions;
export const fileOptionsSelector = (state: RootState) => state.fileOptions;
export default fileOptionsSlice.reducer;
