import useUser from "@/features/auth/hooks/use-user";
import useGetGeneralAccessDataByFolderId from "@/features/collaborator/hooks/use-get-general-access-by-folderId";
import useGetIsCollaboratorByUserIdAndFolderId from "@/features/collaborator/hooks/use-get-is-collaborator-by-userId-and-folderId";
import useSecuredFolderOnDataChange from "@/features/collaborator/hooks/use-secured-folder-on-data-change";
import { moveFoldersAndFilesDataSelector } from "@/features/move-folder-or-file/slice/move-folders-and-files-data-slice";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import useCreateParentFolderPermissions from "./use-create-parent-folder-permissions";

const useGetMobileParentFolderPermissions = () => {
  const { user } = useUser();
  const { parentFolderData, parentFolderStatus } = useSelector(moveFoldersAndFilesDataSelector);
  const isValidParentFolderId = useMemo(() => !!parentFolderData?.folder_id, [parentFolderData]);

  /**
   * get user collaborator in this folder or not
   */
  const shouldFetchPermissions = useMemo(() => {
    return Boolean(parentFolderData?.folder_id && user?.uid && isValidParentFolderId && parentFolderStatus === "succeeded");
  }, [user?.uid, parentFolderData?.folder_id, isValidParentFolderId, parentFolderStatus]);

  const { collaboratorStatus, collaboratorData } = useGetIsCollaboratorByUserIdAndFolderId({
    folderId: parentFolderData?.folder_id || "",
    shouldFetch: shouldFetchPermissions,
    userId: user?.uid || null,
  });

  /**
   * get parent folder general access data
   */
  const { generalAccess, generalAccessStatus } = useGetGeneralAccessDataByFolderId({
    folderId: parentFolderData?.folder_id || null,
    shouldFetch: shouldFetchPermissions,
  });

  /**
   * get parent secured folder active or not
   */
  const { isSecuredFolderActive: isParentSecuredFolderActive } = useSecuredFolderOnDataChange({
    folderId: parentFolderData?.folder_id || null,
  });

  /**
   * create parent folder permission based on collaborator and general access
   * and store to global state
   */
  const { isFetchPermissionSuccess } = useCreateParentFolderPermissions({
    isParentSecuredFolderActive,
    collaboratorData,
    collaboratorStatus,
    generalAccess,
    generalAccessStatus,
  });

  return { isFetchPermissionSuccess };
};

export default useGetMobileParentFolderPermissions;
