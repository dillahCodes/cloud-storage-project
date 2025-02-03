import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ParentFolderPermissions = {
  actionPermissions: { canCRUD: false, canView: false },
  permissionsDetails: {
    isRootFolderMine: false,
    isOwner: false,
    isParentSecuredFolderActive: false,
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
    setParentFolderPermissions: (state, action: PayloadAction<ParentFolderPermissions>) => {
      state.actionPermissions = action.payload.actionPermissions;
      state.permissionsDetails = action.payload.permissionsDetails;
      state.isFetchPermissionSuccess = action.payload.isFetchPermissionSuccess;
    },
    resetStateParentFolderPermission: (state) => {
      state.actionPermissions = { canCRUD: false, canView: false };
      state.permissionsDetails = {
        isRootFolderMine: false,
        isOwner: false,
        isParentSecuredFolderActive: false,
        isCollaboratorCanEdit: false,
        isGeneralAccessPublic: false,
        isGeneralAccessPublicEditor: false,
        isSubFolderLocation: false,
      };
    },
  },
});

export const { setParentFolderPermissions, resetStateParentFolderPermission } = parentFolderPermissionSlice.actions;
export const parentFolderPermissionSelector = (state: RootState) => state.parentFolderPermission;
