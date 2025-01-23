import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: StorageDataState = {
  data: null,
  status: "idle",
};

export const userStorageSlice = createSlice({
  initialState,
  name: "userStorage",
  reducers: {
    /**
     * set storage data
     */
    setStorageData: (state, action: PayloadAction<StorageDataState["data"]>) => {
      state.data = action.payload;
    },

    /**
     * set storage status
     */
    setStorageStatus: (state, action: PayloadAction<StorageDataState["status"]>) => {
      state.status = action.payload;
    },
  },
});

export const { setStorageData, setStorageStatus } = userStorageSlice.actions;
export const userStorageReducer = userStorageSlice.reducer;
export const userStorageSelector = (state: RootState) => state.userStorage;
