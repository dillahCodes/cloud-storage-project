import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectedSearchResultState } from "../search";

const initialState: SelectedSearchResultState = {
  selectedDataId: null,
  selectedDataName: null,
  selectedDataType: null,
  fromLocation: null,
  startFinding: false,
};

export const selectedSearchResultSlice = createSlice({
  name: "desktopSearchSelectedResult",
  initialState,
  reducers: {
    setSelectedData: (
      state,
      action: PayloadAction<Pick<SelectedSearchResultState, "selectedDataId" | "selectedDataName" | "selectedDataType">>
    ) => {
      state.selectedDataId = action.payload.selectedDataId;
      state.selectedDataName = action.payload.selectedDataName;
      state.selectedDataType = action.payload.selectedDataType;
    },

    setFromLocation: (state, action: PayloadAction<Pick<SelectedSearchResultState, "fromLocation">>) => {
      state.fromLocation = action.payload.fromLocation;
    },
    setStartFinding: (state, action: PayloadAction<Pick<SelectedSearchResultState, "startFinding">>) => {
      state.startFinding = action.payload.startFinding;
    },
    resetSelectedData: () => initialState,
  },
});

export const { setSelectedData, setFromLocation, resetSelectedData, setStartFinding } = selectedSearchResultSlice.actions;
export const selectedSearchResultSelector = (state: RootState) => state.selectedSearchResult;
