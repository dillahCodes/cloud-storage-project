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

interface ParentFolderPermissions {
  actionPermissions: {
    canCRUD: boolean;
    canView: boolean;
  };
  permissionsDetails: {
    isOwner: boolean;
    isRootFolderMine: boolean;
    isCollaboratorCanEdit: boolean;
    isGeneralAccessPublic: boolean;
    isGeneralAccessPublicEditor: boolean;
    isSubFolderLocation: boolean;
  };
  isFetchPermissionSuccess: boolean;
}

interface DetailFolderPermissions {
  actionPermissions: {
    canCRUD: boolean;
    canView: boolean;
  };
  permissionsDetails: {
    isOwner: boolean;
    isRootFolderMine: boolean;
    isCollaboratorCanEdit: boolean;
    isGeneralAccessPublic: boolean;
    isGeneralAccessPublicEditor: boolean;
    isSecuredFolderActive: boolean;
    isSubFolderLocation: boolean;
  };
  isFetchPermissionSuccess: boolean;
}
