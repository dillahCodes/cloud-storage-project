import useUser from "@/features/auth/hooks/use-user";
import useFolderGetPermission from "@/features/folder/hooks/use-folder-get-permission";
import useGetCollaborators from "@/features/folder/hooks/use-get-collaborators";
import useGetGeneralAccess from "@/features/folder/hooks/use-get-general-access";
import { message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, setFolderMovePermission, setModalMoveButtonDisabled } from "../slice/dekstop-move-slice";
import { moveFoldersAndFilesDataSelector } from "../slice/move-folders-and-files-data-slice";

const useGetDektopMovePermissionFolder = () => {
  const dispatch = useDispatch();
  const { user } = useUser();

  const { parentFolderData, parentFolderStatus } = useSelector(moveFoldersAndFilesDataSelector);
  const isParentSucceeded = useMemo(() => parentFolderStatus === "succeeded", [parentFolderStatus]);
  const parentId = parentFolderData?.folder_id;
  const isParentIdValid = Boolean(parentId);

  const [isGetPermissionSuccess, setIsGetPermissionSuccess] = useState(false);

  // get parent folder collaborators and general access data
  const { collaboratorsUserData, fetchCollaboratorsUserDataStatus } = useGetCollaborators({
    shouldFetch: Boolean(isParentIdValid && isParentSucceeded),
    folderId: parentId,
    shoudFetchUserCollaboratorsData: Boolean(isParentIdValid && isParentSucceeded),
  });

  const { generalAccessDataState, fetchStatus: generalAccessDataFetchStatus } = useGetGeneralAccess({
    shouldFetch: Boolean(isParentIdValid && isParentSucceeded),
    folderId: parentId,
  });

  // get permission in this sub folder
  const { permissions } = useFolderGetPermission({
    userId: user ? user.uid : null,
    collaboratorsUserData: collaboratorsUserData ?? null,
    generalAccessDataState: generalAccessDataState ?? null,
    parentFolderOwnerId: parentFolderData?.owner_user_id ?? null,
    shouldProcessPermission: isGetPermissionSuccess,
  });

  // Helper functions: Update Permission State
  const updatePermissionState = () => {
    const isSuccess = fetchCollaboratorsUserDataStatus === "succeeded" && generalAccessDataFetchStatus === "succeeded";
    setIsGetPermissionSuccess(isSuccess);
  };

  // Helper functions: Handle Permission Update
  const handlePermissionsUpdate = () => {
    if (!isGetPermissionSuccess) return;

    dispatch(setFolderMovePermission(permissions));
    const isButtonEnabled = permissions.canCRUD === true;
    dispatch(setModalMoveButtonDisabled(!isButtonEnabled));

    if (!isButtonEnabled && !permissions.canCRUD) showAccessDeniedMessage();
  };

  // Helper functions: Show Access Denied Message
  const showAccessDeniedMessage = useCallback(() => {
    message.open({
      type: "error",
      content: "Access denied: folder is private.",
      className: "font-archivo text-sm",
      key: "folder-move-error-message",
    });

    const timeoutId = setTimeout(() => {
      dispatch(closeModal());
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dispatch]);

  // Effects
  useEffect(updatePermissionState, [fetchCollaboratorsUserDataStatus, generalAccessDataFetchStatus]);
  useEffect(handlePermissionsUpdate, [dispatch, isGetPermissionSuccess, permissions, showAccessDeniedMessage]);

  return { isGetPermissionSuccess };
};

export default useGetDektopMovePermissionFolder;
