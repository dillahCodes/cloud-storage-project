import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFolderPermissionState from "./use-folder-permission-state";
import useFolderPermissionSetState from "./use-folder-permission-setstate";

const useHandleFolderAccessModal = (isGetPermissionSuccess: boolean) => {
  const navigate = useNavigate();

  const { resetState } = useFolderPermissionSetState({});
  const { subFolderPermission } = useFolderPermissionState();
  const [isModalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
    resetState();
  };

  useEffect(() => {
    if (!subFolderPermission.canCRUD && isGetPermissionSuccess && !subFolderPermission.canView) {
      setModalVisible(true);
      navigate("/storage/my-storage");
    }
  }, [subFolderPermission.canCRUD, isGetPermissionSuccess, navigate, subFolderPermission.canView]);

  return { isModalVisible, closeModal };
};

export default useHandleFolderAccessModal;
