import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FileSortingType = "Ascending" | "Descending";
export type FileSortingBy = "Name" | "Size" | "Upload Time";

export interface FileSortingMenu {
  label: FileSortingBy;
  value: FileSortingBy;
}

export type FileSortingLocalStorageKey = "fileSortingType";
export type FileSortingByLocalStorageKey = "fileSortingBy";

export interface FileSortingState {
  selectedCategory: FileSortingBy;
  selectedSorting: FileSortingType;
}

const initialState: FileSortingState = {
  selectedCategory: "Name",
  selectedSorting: "Ascending",
};

export const fileSortingTypeSlice = createSlice({
  name: "fileSortingType",
  initialState,
  reducers: {
    setFileSelectedSorting: (state, action: PayloadAction<FileSortingState["selectedSorting"]>) => {
      state.selectedSorting = action.payload;
    },
    setFileSelectedCategory: (state, action: PayloadAction<FileSortingState["selectedCategory"]>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setFileSelectedSorting, setFileSelectedCategory } = fileSortingTypeSlice.actions;
export const fileSortingTypeSelector = (state: RootState) => state.fileSortingType;
export default fileSortingTypeSlice.reducer;
