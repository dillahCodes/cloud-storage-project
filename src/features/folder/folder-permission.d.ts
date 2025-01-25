interface FolderPermissionState {
  isRootFolder: boolean;
  subFolderPermission: FolderPermission | null;
  detailsFolderPermission: FolderPermission | null;
  statusFetch: FetchPermissionStatus;
}

interface FolderPermission {
  canCRUD: boolean;
  canView: boolean;
  canManageAccess: boolean;
}

interface FolderPermissionDataDetails {
  isOwner: boolean;
  isCollaboratorButOnlyViewer: boolean;
  isCollaboratorAndEditor: boolean;
  isParentFolderMine: boolean;
  isFolderPublic: boolean;
  isGeneralAccessCanEdit: boolean;
}

type FetchPermissionStatus = "loading" | "succeeded" | "failed" | "idle";
