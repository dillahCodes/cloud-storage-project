import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FodlerActivityState } from "../folder-activity";
import { RootState } from "@/store/store";

const initialState: FodlerActivityState = {
  activity: [],
  status: "idle",
  errorMessage: null,
};

export const folderActivitySlice = createSlice({
  name: "folderActivity",
  initialState,
  reducers: {
    setActivity: (state, action: PayloadAction<FodlerActivityState["activity"]>) => {
      state.activity = action.payload;
    },
    setStatusActivity: (state, action: PayloadAction<FodlerActivityState["status"]>) => {
      state.status = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<FodlerActivityState["errorMessage"]>) => {
      state.errorMessage = action.payload;
    },
    resetActivityState: () => initialState,
  },
});

export const { resetActivityState, setActivity, setStatusActivity, setErrorMessage } = folderActivitySlice.actions;
export default folderActivitySlice.reducer;
export const folderActivitySelector = (state: RootState) => state.folderActivity;
