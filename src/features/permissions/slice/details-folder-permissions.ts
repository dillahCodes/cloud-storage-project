import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: DetailFolderPermissions = {
  actionPermissions: { canCRUD: false, canView: false },
  permissionsDetails: {
    isOwner: false,
    isRootFolderMine: false,
    isCollaboratorCanEdit: false,
    isGeneralAccessPublic: false,
    isGeneralAccessPublicEditor: false,
    isSecuredFolderActive: false,
    isSubFolderLocation: false,
  },
  isFetchPermissionSuccess: false,
};

export const detailFolderPermissionSlice = createSlice({
  name: "detailFolderPermission",
  initialState,
  reducers: {
    setDetailsFolderPermissions: (state, action: PayloadAction<DetailFolderPermissions>) => {
      state.actionPermissions = action.payload.actionPermissions;
      state.permissionsDetails = action.payload.permissionsDetails;
      state.isFetchPermissionSuccess = action.payload.isFetchPermissionSuccess;
    },
    resetDetailsFolderPermissions: () => initialState,
  },
});

export const { resetDetailsFolderPermissions, setDetailsFolderPermissions } = detailFolderPermissionSlice.actions;
export const detailFolderPermissionsSelector = (state: RootState) => state.detailFolderPermission;
