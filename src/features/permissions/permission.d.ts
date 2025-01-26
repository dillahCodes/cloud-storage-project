interface PermissionsDetailsData {
  isOwner: boolean;
  isCollaboratorButOnlyViewer: boolean;
  isCollaboratorAndEditor: boolean;
  isParentFolderMine: boolean;
  isFolderPublic: boolean;
  isGeneralAccessCanEdit: boolean;
}

type FetchPermissionStatus = "loading" | "succeeded" | "failed" | "idle";

interface BaseFolderPermissions {
  canCRUD: boolean;
  canView: boolean;
  canManageAccess: boolean;
}

interface ParentFolderPermission {
  actionPermissions: {
    canCRUD: boolean;
    canView: boolean;
  };
  permissionsDetails: {
    isOwner: boolean;
    isCollaboratorCanEdit: boolean;
    isGeneralAccessPublic: boolean;
    isGeneralAccessPublicEditor: boolean;
    isSubFolderLocation: boolean;
  };
  isFetchPermissionSuccess: boolean;
}

// interface SubFolderPermissionsState {
//   permissons: Pick<BaseFolderPermissions, "canCRUD" | "canView">;
//   details: PermissionsDetailsData;
//   status: FetchPermissionStatus;
// }

// interface FolderDetailsPermissionsState {
//   permissons: Pick<BaseFolderPermissions, "canManageAccess">;
//   details: PermissionsDetailsData;
//   status: FetchPermissionStatus;
// }
