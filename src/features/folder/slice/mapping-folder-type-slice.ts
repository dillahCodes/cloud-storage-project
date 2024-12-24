import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MappingFolderType = "list" | "grid";
export type LocalStorageMapppingFoldersKey = "foldersMappingType";

const initialState = {
  mappingFolderType: "grid" as MappingFolderType,
};

export const mappingFolderTypeSlice = createSlice({
  name: "mappingFolderType",
  initialState,
  reducers: {
    setMappingFolderType: (state, action: PayloadAction<MappingFolderType>) => {
      state.mappingFolderType = action.payload;
    },
  },
});

export const { setMappingFolderType } = mappingFolderTypeSlice.actions;
export const mappingFolderTypeSelector = (state: RootState) => state.mappingFolderType;
export default mappingFolderTypeSlice.reducer;
