import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileState, RootFileGetData, SubFileGetData } from "../file";

const initialState: FileState = {
  files: [],
  status: "idle",
};

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFiles(state, action: PayloadAction<RootFileGetData[] | SubFileGetData[]>) {
      state.files = action.payload;
    },
    setStatus(state, action: PayloadAction<FileState["status"]>) {
      state.status = action.payload;
    },
    resetFiles(state) {
      state.files = [];
    },
  },
});

export const { resetFiles, setFiles, setStatus } = fileSlice.actions;
export const fileSelector = (state: RootState) => state.file;
export default fileSlice.reducer;
