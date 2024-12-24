import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FolderSortingType = "Ascending" | "Descending";
export type FolderSortingBy = "Name" | "Last Modified";

export interface FolderSortingMenu {
  label: FolderSortingBy;
  value: FolderSortingBy;
}

export type SortingFor = "Folders" | "Files";

export type FolderSortingLocalStorageKey = "folderSortingType";
export type FolderSortingByLocalStorageKey = "folderSortingBy";

export interface SortingState {
  selectedCategory: FolderSortingBy;
  selectedSorting: FolderSortingType;
}

const initialState: SortingState = {
  selectedCategory: "Name",
  selectedSorting: "Ascending",
};

export const folderSortingTypeSlice = createSlice({
  name: "folderSortingType",
  initialState,
  reducers: {
    setFolderSelectedCategory: (state, action: PayloadAction<SortingState["selectedCategory"]>) => {
      state.selectedCategory = action.payload;
    },
    setFolderSelectedSorting: (state, action: PayloadAction<SortingState["selectedSorting"]>) => {
      state.selectedSorting = action.payload;
    },
  },
});

export const { setFolderSelectedCategory, setFolderSelectedSorting } = folderSortingTypeSlice.actions;
export const folderSortingTypeSelector = (state: RootState) => state.folderSortingType;
export default folderSortingTypeSlice.reducer;
