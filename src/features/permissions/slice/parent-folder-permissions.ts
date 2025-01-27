import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ParentFolderPermissions = {
  actionPermissions: { canCRUD: false, canView: false },
  permissionsDetails: {
    isOwner: false,
    isCollaboratorCanEdit: false,
    isGeneralAccessPublic: false,
    isGeneralAccessPublicEditor: false,
    isSubFolderLocation: false,
  },
  isFetchPermissionSuccess: false,
};

export const parentFolderPermissionSlice = createSlice({
  name: "parentFolderPermission",
  initialState,
  reducers: {
    setParentFolderActionPermissions: (state, action: PayloadAction<ParentFolderPermissions["actionPermissions"]>) => {
      state.actionPermissions = action.payload;
    },
    setParentFolderPermissionsDetails: (state, action: PayloadAction<ParentFolderPermissions["permissionsDetails"]>) => {
      state.permissionsDetails = action.payload;
    },
    setIsFetchPermissionSuccess: (state, action: PayloadAction<ParentFolderPermissions["isFetchPermissionSuccess"]>) => {
      state.isFetchPermissionSuccess = action.payload;
    },
    resetStateParentFolderPermission: () => initialState,
  },
});

export const { setParentFolderActionPermissions, setParentFolderPermissionsDetails, setIsFetchPermissionSuccess, resetStateParentFolderPermission } =
  parentFolderPermissionSlice.actions;
export const parentFolderPermissionSelector = (state: RootState) => state.parentFolderPermission;
