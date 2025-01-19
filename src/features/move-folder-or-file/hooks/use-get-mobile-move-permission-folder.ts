import useUser from "@/features/auth/hooks/use-user";
import useFolderGetPermission from "@/features/folder/hooks/use-folder-get-permission";
import useGetCollaborators from "@/features/folder/hooks/use-get-collaborators";
import useGetGeneralAccess from "@/features/folder/hooks/use-get-general-access";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { moveFoldersAndFilesDataSelector } from "../slice/move-folders-and-files-data-slice";

const useGetMobileMovePermissionFolder = () => {
  /**
   * state
   */
  const { user } = useUser();
  const { parentFolderData, parentFolderStatus } = useSelector(moveFoldersAndFilesDataSelector);
  const isParentSuccess = useMemo(() => parentFolderStatus === "succeeded", [parentFolderStatus]);
  const isRoot = useMemo(() => !parentFolderData && isParentSuccess, [parentFolderData, isParentSuccess]);

  const parentId = useMemo(() => parentFolderData?.folder_id, [parentFolderData]);

  // get parent folder collaborators and general access data
  const { collaboratorsUserData, fetchCollaboratorsUserDataStatus } = useGetCollaborators({
    shouldFetch: Boolean(parentFolderData),
    folderId: parentId,
    shoudFetchUserCollaboratorsData: Boolean(parentFolderData),
  });
  const { generalAccessDataState, fetchStatus } = useGetGeneralAccess({
    shouldFetch: Boolean(parentFolderData),
    folderId: parentId,
  });
  const isGetPermissionSuccess = useMemo(() => {
    return fetchCollaboratorsUserDataStatus === "succeeded" && fetchStatus === "succeeded" && isParentSuccess;
  }, [fetchCollaboratorsUserDataStatus, fetchStatus, isParentSuccess]);

  // get permission in this subfolder
  const { permissions } = useFolderGetPermission({
    userId: user ? user.uid : null,
    collaboratorsUserData: collaboratorsUserData ?? null,
    generalAccessDataState: generalAccessDataState ?? null,
    parentFolderOwnerId: parentFolderData?.root_folder_user_id ?? null,
    shouldProcessPermission: isGetPermissionSuccess,
  });
  return {
    isGetPermissionSuccess,
    isRoot,
    permissions,
  };
};

export default useGetMobileMovePermissionFolder;
