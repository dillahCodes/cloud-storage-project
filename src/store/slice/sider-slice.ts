import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface SiderState {
  isSiderOpen: boolean;
}

const initialState = {
  isSiderOpen: true,
} as SiderState;

export const siderSlice = createSlice({
  name: "siderSlice",
  initialState,
  reducers: {
    openSider: (state): void => {
      state.isSiderOpen = true;
    },
    closeSider: (state): void => {
      state.isSiderOpen = false;
    },
    toggleSider: (state): void => {
      state.isSiderOpen = !state.isSiderOpen;
    },
  },
});

export const { openSider, closeSider, toggleSider } = siderSlice.actions;
export const siderSelector = (state: RootState) => state.sider;
export default siderSlice.reducer;
