import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { folderPermissionSelector } from "../slice/folder-permission-slice";

const useHandleFolderAccessModal = () => {
  const navigate = useNavigate();

  const { subFolderPermission, statusFetch, isRootFolder } = useSelector(folderPermissionSelector);
  const isPermissionSuccess = useMemo(() => statusFetch === "succeeded", [statusFetch]);

  const [isModalVisible, setModalVisible] = useState(false);

  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    if (isRootFolder) return;
    if (!isPermissionSuccess) return;
    if (!subFolderPermission) return;
    if (subFolderPermission.canView) return;

    setModalVisible(true);
    navigate("/storage/my-storage");
  }, [isPermissionSuccess, subFolderPermission, statusFetch, navigate, isRootFolder]);

  return { isModalVisible, closeModal };
};

export default useHandleFolderAccessModal;
