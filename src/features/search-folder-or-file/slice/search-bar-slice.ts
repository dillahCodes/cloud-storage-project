import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchState } from "../search";

const initialState: SearchState = {
  isSearchbarOpen: false,
  searchInputValue: "",
  selectedLocationName: "my-storage",
  selectedSearchCategoryName: "file",
  selectedSortCategoryName: "file-name",
  sortBy: "asc",
};

export const searchBarSlice = createSlice({
  name: "searchBar",
  initialState,
  reducers: {
    setSearchInputValue: (state, action: PayloadAction<SearchState["searchInputValue"]>) => {
      state.searchInputValue = action.payload;
    },
    setIsSearchbarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchbarOpen = action.payload;
    },
    toggleSearchbar: (state) => {
      state.isSearchbarOpen = !state.isSearchbarOpen;
    },
    setSelectedLocationName: (state, action: PayloadAction<SearchState["selectedLocationName"]>) => {
      state.selectedLocationName = action.payload;
    },
    setSelectedSearchCategoryName: (state, action: PayloadAction<SearchState["selectedSearchCategoryName"]>) => {
      state.selectedSearchCategoryName = action.payload;
    },
    setSelectedSortCategoryName: (state, action: PayloadAction<SearchState["selectedSortCategoryName"]>) => {
      state.selectedSortCategoryName = action.payload;
    },
    setSearchSortBy: (state, action: PayloadAction<SearchState["sortBy"]>) => {
      state.sortBy = action.payload;
    },
    resetSerchbarState: () => initialState,
  },
});

export const {
  setIsSearchbarOpen,
  toggleSearchbar,
  setSelectedLocationName,
  setSelectedSearchCategoryName,
  setSelectedSortCategoryName,
  setSearchSortBy,
  setSearchInputValue,
  resetSerchbarState,
} = searchBarSlice.actions;
export const searchBarSelector = (state: RootState) => state.searchBar;
