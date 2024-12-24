interface FolderPermissionState {
  isRootFolder: boolean;
  subFolderPermission: FolderPermission;
  detailsFolderPermission: FolderPermission;
  statusFetch: StatusFetch;
}

interface StatusFetch {
  CollaboratorsFetchStatus: FetchPermissionStatus;
  GeneralAccessFetchStatus: FetchPermissionStatus;
}

interface FolderPermission {
  canCRUD: boolean;
  canView: boolean;
  canManageAccess: boolean;
}

type FetchPermissionStatus = "loading" | "succeeded" | "failed" | "idle";
