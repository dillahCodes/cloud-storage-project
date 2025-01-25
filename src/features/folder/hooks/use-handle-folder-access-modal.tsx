import useDetectLocation from "@/hooks/use-detect-location";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { folderPermissionSelector } from "../slice/folder-permission-slice";

const useHandleFolderAccessModal = () => {
  const navigate = useNavigate();

  const { isSubMyStorageLocation, isSubSharedWithMeLocation } = useDetectLocation();
  const isSubFolderLocation = isSubMyStorageLocation || isSubSharedWithMeLocation;

  const { subFolderPermission, statusFetch, isRootFolder } = useSelector(folderPermissionSelector);
  const isPermissionSuccess = useMemo(() => statusFetch === "succeeded", [statusFetch]);

  const [isModalVisible, setModalVisible] = useState(false);

  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    if (!subFolderPermission || isRootFolder || subFolderPermission.canView) return;
    setModalVisible(true);
    navigate("/storage/my-storage");
  }, [navigate, isPermissionSuccess, subFolderPermission, isSubFolderLocation, isRootFolder]);

  return { isModalVisible, closeModal };
};

export default useHandleFolderAccessModal;
