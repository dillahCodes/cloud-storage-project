import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type DesktopDrawerTitleType = "notification" | "activity" | "details" | "";
1;
export interface DrawerState {
  isDrawerMenuOpen: boolean;
  isDrawerDesktopOpen: boolean;
  desktopDrawerTitle?: DesktopDrawerTitleType;
  desktopDrawerFolderId?: string;
}

const initialState = {
  isDrawerMenuOpen: false,
  isDrawerDesktopOpen: false,
  desktopDrawerTitle: "",
} as DrawerState;

export const drawerSlice = createSlice({
  name: "drawerSlice",
  initialState,
  reducers: {
    openDrawerMenu: (state): void => {
      state.isDrawerMenuOpen = true;
    },
    closeDrawerMenu: (state): void => {
      state.isDrawerMenuOpen = false;
    },
    toggleDrawerMenu: (state): void => {
      state.isDrawerMenuOpen = !state.isDrawerMenuOpen;
    },

    openDesktopDrawerMenu: (state) => {
      state.isDrawerDesktopOpen = true;
    },
    closeDesktopDrawerMenu: (state) => {
      state.isDrawerDesktopOpen = false;
    },
    toggleDesktopDrawerMenu: (state) => {
      state.isDrawerDesktopOpen = !state.isDrawerDesktopOpen;
    },

    setDesktopDrawerTitle: (state, action: PayloadAction<DesktopDrawerTitleType>) => {
      state.desktopDrawerTitle = action.payload;
    },
    setDesktopDrawerFolderId: (state, action: PayloadAction<string>) => {
      state.desktopDrawerFolderId = action.payload;
    },
    resetDrawerState: () => initialState,
  },
});

export const {
  closeDrawerMenu,
  openDrawerMenu,
  toggleDrawerMenu,
  closeDesktopDrawerMenu,
  openDesktopDrawerMenu,
  toggleDesktopDrawerMenu,
  setDesktopDrawerTitle,
  setDesktopDrawerFolderId,
  resetDrawerState,
} = drawerSlice.actions;
export const drawerSelector = (state: RootState) => state.drawer;
export default drawerSlice.reducer;
