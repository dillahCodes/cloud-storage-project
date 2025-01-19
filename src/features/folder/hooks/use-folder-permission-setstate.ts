import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDetailsFolderPermission, setFetchStatus, setIsRootFolder, setSubFolderPermission } from "../slice/folder-permission-slice";

interface UseFolderPermissionSetState {
  isRootFolder: boolean;

  subFolderPermissions: FolderPermission | null;
  detailsFolderPermissions: FolderPermission | null;

  permissionsStatus: FetchPermissionStatus;
  shouldProceed: boolean;
}

const useFolderPermissionSetState = ({
  detailsFolderPermissions,
  isRootFolder,
  permissionsStatus,
  shouldProceed,
  subFolderPermissions,
}: UseFolderPermissionSetState) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!shouldProceed) return;

    if (isRootFolder) dispatch(setIsRootFolder(isRootFolder));
    if (subFolderPermissions) dispatch(setSubFolderPermission(subFolderPermissions));
    if (permissionsStatus) dispatch(setFetchStatus(permissionsStatus));
    if (detailsFolderPermissions) dispatch(setDetailsFolderPermission(detailsFolderPermissions));
  }, [detailsFolderPermissions, dispatch, isRootFolder, permissionsStatus, shouldProceed, subFolderPermissions]);
};

export default useFolderPermissionSetState;
