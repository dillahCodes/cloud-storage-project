import { useSelector } from "react-redux";
import { folderPermissionSelector } from "../slice/folder-permission-slice";

const useFolderPermissionState = () => {
  const folderPermissionState = useSelector(folderPermissionSelector);
  const { isRootFolder, subFolderPermission, detailsFolderPermission, statusFetch } = folderPermissionState;

  return {
    isRootFolder,
    subFolderPermission,
    detailsFolderPermission,
    statusFetch,
  };
};

export default useFolderPermissionState;
