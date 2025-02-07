import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResultSearchState } from "../search";

const initialState: ResultSearchState = {
  data: [] as ResultSearchState["data"],
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
    resetResultSearch: () => initialState,
  },
});

export const { setDataResultSearch, setStatusFetchResultSearch, resetResultSearch, setDataLengthResultSearch } =
  resultSearchSlice.actions;
export const resultSearchSelector = (state: RootState) => state.resultSearch;
