import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ParentFolderPermission = {
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
    setParentFolderActionPermissions: (state, action: PayloadAction<ParentFolderPermission["actionPermissions"]>) => {
      state.actionPermissions = action.payload;
    },
    setParentFolderPermissionsDetails: (state, action: PayloadAction<ParentFolderPermission["permissionsDetails"]>) => {
      state.permissionsDetails = action.payload;
    },
    setIsFetchPermissionSuccess: (state, action: PayloadAction<ParentFolderPermission["isFetchPermissionSuccess"]>) => {
      state.isFetchPermissionSuccess = action.payload;
    },
    resetStateParentFolderPermission: () => initialState,
  },
});

export const { setParentFolderActionPermissions, setParentFolderPermissionsDetails, setIsFetchPermissionSuccess, resetStateParentFolderPermission } =
  parentFolderPermissionSlice.actions;
export const parentFolderPermissionSelector = (state: RootState) => state.parentFolderPermission;
