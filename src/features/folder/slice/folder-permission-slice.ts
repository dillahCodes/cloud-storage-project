import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: FolderPermissionState = {
  isRootFolder: false,
  statusFetch: {
    CollaboratorsFetchStatus: "idle",
    GeneralAccessFetchStatus: "idle",
  },
  subFolderPermission: {
    canCRUD: true,
    canManageAccess: true,
    canView: true,
  },
  detailsFolderPermission: {
    canCRUD: true,
    canManageAccess: true,
    canView: true,
  },
};

export const folderPermissionSlice = createSlice({
  name: "folderPermission",
  initialState,
  reducers: {
    setIsRootFolder: (state, action: PayloadAction<boolean>) => {
      state.isRootFolder = action.payload;
    },
    setSubFolderPermission: (state, action: PayloadAction<FolderPermission>) => {
      state.subFolderPermission = action.payload;
    },
    setDetailsFolderPermission: (state, action: PayloadAction<FolderPermission>) => {
      state.detailsFolderPermission = action.payload;
    },
    setFetchStatus: (state, action: PayloadAction<FolderPermissionState["statusFetch"]>) => {
      state.statusFetch = action.payload;
    },
    resetStateFolderPermission: () => initialState,
  },
});

export default folderPermissionSlice.reducer;
export const {
  setIsRootFolder,
  setSubFolderPermission,
  setDetailsFolderPermission,
  setFetchStatus,
  resetStateFolderPermission,
} = folderPermissionSlice.actions;
export const folderPermissionSelector = (state: RootState) => state.folderPermission;
