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

type FetchPermissionStatus = "loading" | "succeeded" | "failed" | "idle";
