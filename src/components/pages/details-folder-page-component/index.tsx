import useUser from "@/features/auth/hooks/use-user";
import useFolderGetPermission from "@/features/folder/hooks/use-folder-get-permission";
import useFolderPermissionSetState from "@/features/folder/hooks/use-folder-permission-setstate";
import useGetCollaborators from "@/features/folder/hooks/use-get-collaborators";
import useGetGeneralAccess from "@/features/folder/hooks/use-get-general-access";
import useParentFolder from "@/features/folder/hooks/use-parent-folder";
import FolderDetails from "@components/layout/folder/folder-details";
import MainLayout from "@components/layout/main-layout";
import { Flex } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const DetailsFolderPageComponent = () => {
  const { user } = useUser();

  const navigate = useNavigate();

  const { "0": urlSearchParams } = useSearchParams();
  const [parentFolderId] = useState<string>(urlSearchParams.get("parent") || "");

  // get parent folder data
  const { parentFolderState } = useParentFolder({
    fetchParentFolderDataOnMount: true,
    resetParentFolderDataOnMount: false,
    folderId: parentFolderId,
  });
  const isParentSuccess = useMemo(() => parentFolderState.status === "succeeded", [parentFolderState.status]);

  // get parent folder collaborators and general access data
  const { collaboratorsUserData, fetchCollaboratorsUserDataStatus } = useGetCollaborators({
    shouldFetch: parentFolderState.isValidParentFolder,
    folderId: parentFolderId,
    shoudFetchUserCollaboratorsData: parentFolderState.isValidParentFolder,
  });
  const { generalAccessDataState, fetchStatus } = useGetGeneralAccess({
    shouldFetch: parentFolderState.isValidParentFolder,
    folderId: parentFolderId,
  });
  const isGetPermissionSuccess = useMemo(() => {
    return fetchCollaboratorsUserDataStatus === "succeeded" && fetchStatus === "succeeded";
  }, [fetchCollaboratorsUserDataStatus, fetchStatus]);

  // get permission in this subfolder
  const { permissions } = useFolderGetPermission({
    userId: user ? user.uid : null,
    collaboratorsUserData: collaboratorsUserData ?? null,
    generalAccessDataState: generalAccessDataState ?? null,
    parentFolderOwnerId: parentFolderState.parentFolderData?.root_folder_user_id ?? null,
    shouldProcessPermission: isGetPermissionSuccess && isParentSuccess,
  });

  // set details folder permission to state
  useFolderPermissionSetState({
    detailsFolderPermissions: permissions,
    subFolderPermissions: null,
    isRootFolder: !parentFolderId ? true : false,
    permissionsStatus: isGetPermissionSuccess && isParentSuccess ? "succeeded" : "loading",
    shouldProceed: isGetPermissionSuccess && isParentSuccess,
  });

  // navigate to my storage if parent is empty
  useEffect(() => {
    const parentParams = urlSearchParams.get("parent") || null;
    const isValidParentFolder = parentFolderState.isValidParentFolder;

    if (!parentParams && isValidParentFolder) navigate("/storage/my-storage", { replace: true });
  }, [parentFolderState.isValidParentFolder, parentFolderState.parentFolderData, navigate, urlSearchParams]);

  return (
    <MainLayout showAddButton={false} withFooter={false} withBreadcrumb={false} showPasteButton={false}>
      <Flex className="pb-3">
        <FolderDetails />
      </Flex>
    </MainLayout>
  );
};

export default DetailsFolderPageComponent;
