import { parentFolderPermissionSelector } from "@/features/permissions/slice/parent-folder-permissions";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useHandleFolderAccessModal = () => {
  const navigate = useNavigate();
  /**
   * global and local state
   */
  const { actionPermissions, isFetchPermissionSuccess, permissionsDetails } = useSelector(parentFolderPermissionSelector);
  const [isModalVisible, setModalVisible] = useState(false);

  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    if (!isFetchPermissionSuccess || !permissionsDetails.isSubFolderLocation) return;
    if (actionPermissions.canView) return;

    setModalVisible(true);
    navigate("/storage/my-storage");
  }, [isFetchPermissionSuccess, permissionsDetails.isSubFolderLocation, actionPermissions, navigate]);

  return { isModalVisible, closeModal };
};

export default useHandleFolderAccessModal;
