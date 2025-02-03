import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileSearchResult, FolderResultSearch, NotificationResultSearch, ResultSearchState } from "../search";

/**
 * Type Guard Functions
 */
const isFileResult = (item: any): item is FileSearchResult => item.resultType === "file";
const isFolderResult = (item: any): item is FolderResultSearch => item.resultType === "folder";
const isNotificationResult = (item: any): item is NotificationResultSearch => item.resultType === "notification";
export { isFileResult, isFolderResult, isNotificationResult };

const initialState: ResultSearchState = {
  data: [],
  dataLength: 0,
  statusFetch: "idle",
};

export const resultSearchSlice = createSlice({
  name: "resultSearch",
  initialState,
  reducers: {
    setDataResultSearch: (state, action: PayloadAction<ResultSearchState["data"]>) => {
      state.data = action.payload;
    },
    setStatusFetchResultSearch: (state, action: PayloadAction<ResultSearchState["statusFetch"]>) => {
      state.statusFetch = action.payload;
    },
    setDataLengthResultSearch: (state, action: PayloadAction<ResultSearchState["dataLength"]>) => {
      state.dataLength = action.payload;
    },
    resetResultSearch: (state) => {
      state.data = [];
      state.dataLength = 0;
      state.statusFetch = "idle";
    },
  },
});

export const { setDataResultSearch, setStatusFetchResultSearch, resetResultSearch, setDataLengthResultSearch } = resultSearchSlice.actions;
export const resultSearchSelector = (state: RootState) => state.resultSearch;
