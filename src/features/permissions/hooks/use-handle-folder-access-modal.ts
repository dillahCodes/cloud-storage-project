import { dekstopMoveSelector, resetDektopMoveState } from "@/features/move-folder-or-file/slice/dekstop-move-slice";
import { mobileMoveSelector, resetMobileMoveState } from "@/features/move-folder-or-file/slice/mobile-move-slice";
import { parentFolderPermissionSelector, resetStateParentFolderPermission } from "@/features/permissions/slice/parent-folder-permissions";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useHandleFolderAccessModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  /**
   * parent folder permission
   */
  const { actionPermissions, isFetchPermissionSuccess, permissionsDetails } = useSelector(parentFolderPermissionSelector);

  /**
   * mobile move state
   */
  const { moveFromLocationPath, fileId: mobileMoveFileId, folderId: mobileMoveFolderId } = useSelector(mobileMoveSelector);
  const isUserCurrentlyMobileMoving = Boolean(mobileMoveFileId || mobileMoveFolderId);

  /**
   * dektop move sttae
   */
  const { isModalOpen, fileId: dektopMoveFileId, folderId: dektopMoveFolderId } = useSelector(dekstopMoveSelector);
  const isUserCurrentlyDektopMoving = Boolean(dektopMoveFileId || dektopMoveFolderId);

  /**
   * local state is modal permission open
   */
  const [isModalVisible, setModalVisible] = useState(false);

  /**
   * close permission modal
   */
  const closeModal = () => {
    dispatch(resetStateParentFolderPermission());
    setModalVisible(false);
    navigate(-1);
  };

  /**
   * handle dekstop move permission denied
   */
  const handleDekstopMovePermissionDenied = useCallback(() => {
    if (!isModalOpen) return;
    dispatch(resetDektopMoveState());
  }, [isModalOpen, dispatch]);

  /**
   * handle mobile move permission denied
   */
  const handleMobileMovePermissionDenied = useCallback(() => {
    if (!moveFromLocationPath) return;

    navigate(moveFromLocationPath);
    dispatch(resetMobileMoveState());
  }, [dispatch, moveFromLocationPath, navigate]);

  useEffect(() => {
    // Early return if initial conditions are not met
    if (!isFetchPermissionSuccess || !permissionsDetails.isSubFolderLocation || actionPermissions.canView) return;

    // Show the modal because the user does not have the required permission
    setModalVisible(true);

    // Handle action based on the device the user is currently using
    if (isUserCurrentlyMobileMoving) {
      handleMobileMovePermissionDenied();
      return;
    }

    if (isUserCurrentlyDektopMoving) {
      handleDekstopMovePermissionDenied();
      return;
    }

    // Default navigation if no specific action matches
    // navigate("/storage/my-storage");
  }, [
    actionPermissions.canView,
    isFetchPermissionSuccess,
    navigate,
    permissionsDetails.isSubFolderLocation,
    handleDekstopMovePermissionDenied,
    handleMobileMovePermissionDenied,
    isUserCurrentlyDektopMoving,
    isUserCurrentlyMobileMoving,
  ]);

  return { isModalVisible, closeModal };
};

export default useHandleFolderAccessModal;
