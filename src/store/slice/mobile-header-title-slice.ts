import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type HeaderMobileType =
  | "my storage"
  | "shared with me"
  | "recently viewed"
  | "starred"
  | "trash"
  | "my profile"
  | "folders"
  | "notification";

interface MobileHeaderTitleStateType {
  title: HeaderMobileType;
}

const initialState: MobileHeaderTitleStateType = {
  title: "my storage",
};

export const mobileHeaderTitleSlice = createSlice({
  initialState,
  name: "mobileHeaderTitleSlice",
  reducers: {
    setMobileHeaderTitle(state, action: PayloadAction<HeaderMobileType>) {
      state.title = action.payload;
    },
  },
});

export const { setMobileHeaderTitle } = mobileHeaderTitleSlice.actions;
export const mobileHeaderTitleSelector = (state: RootState) => state.mobileHeaderTitle;
