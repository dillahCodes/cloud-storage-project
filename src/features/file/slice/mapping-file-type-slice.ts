import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MappingFileType = "list" | "grid";
export type LocalStorageMapppingFilesKey = "filesMappingType";

const initialState = {
  mappingFileType: "list" as MappingFileType,
};

export const mappingFileTypeSlice = createSlice({
  name: "mappingFileType",
  initialState,
  reducers: {
    setMappingFileType: (state, action: PayloadAction<MappingFileType>) => {
      state.mappingFileType = action.payload;
    },
  },
});

export const { setMappingFileType } = mappingFileTypeSlice.actions;
export const mappingFileTypeSelector = (state: RootState) => state.mappingFileType;
export default mappingFileTypeSlice.reducer;
