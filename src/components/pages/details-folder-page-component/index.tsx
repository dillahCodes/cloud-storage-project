import useUser from "@/features/auth/hooks/use-user";
import useFolderGetPermission from "@/features/folder/hooks/use-folder-get-permission";
import useFolderPermissionSetState from "@/features/folder/hooks/use-folder-permission-setstate";
import useGetCollaborators from "@/features/folder/hooks/use-get-collaborators";
import useGetGeneralAccess from "@/features/folder/hooks/use-get-general-access";
import useParentFolder from "@/features/folder/hooks/use-parent-folder";
import FolderDetails from "@components/layout/folder/folder-details";
import MainLayout from "@components/layout/main-layout";
import { Flex } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const DetailsFolderPageComponent = () => {
  const { user } = useUser();

  const navigate = useNavigate();

  const { "0": urlSearchParams } = useSearchParams();
  const [parentFolderId] = useState<string>(urlSearchParams.get("parent") || "");

  // get parent folder collaborators and general access data
  const { collaboratorsUserData, fetchCollaboratorsUserDataStatus } = useGetCollaborators({
    shouldFetch: Boolean(parentFolderId),
    shoudFetchUserCollaboratorsData: Boolean(parentFolderId),
    folderId: parentFolderId,
  });
  const { generalAccessDataState, fetchStatus } = useGetGeneralAccess({
    shouldFetch: Boolean(parentFolderId),
    folderId: parentFolderId,
  });

  // get parent folder data
  const { parentFolderState } = useParentFolder({
    fetchParentFolderDataOnMount: true,
    resetParentFolderDataOnMount: false,
    folderId: parentFolderId,
  });

  // get permission in this subfolder
  const { permissions } = useFolderGetPermission({
    userId: user?.uid,
    collaboratorsUserData,
    generalAccessDataState,
    parentFolderOwnerId: parentFolderState.parentFolderData?.owner_user_id,
  });
  useFolderPermissionSetState({
    withUseEffect: {
      subFolder: {
        data: permissions,
      },
      statusFetch: {
        CollaboratorsFetchStatus: fetchCollaboratorsUserDataStatus,
        GeneralAccessFetchStatus: fetchStatus,
      },
    },
  });

  // if folderid is empty set is root folder
  const { setIsRootFolderPermissionState } = useFolderPermissionSetState({});
  useEffect(() => {
    if (!parentFolderId || parentFolderId.trim() === "") setIsRootFolderPermissionState(true);
  }, [parentFolderId, setIsRootFolderPermissionState]);

  // navigate to my storage if parent is empty
  useEffect(() => {
    const parentParams = urlSearchParams.get("parent") || null;
    const isValidParentFolder = parentFolderState.isValidParentFolder;

    if (!parentParams && isValidParentFolder) navigate("/storage/my-storage", { replace: true });
  }, [parentFolderState.isValidParentFolder, parentFolderState.parentFolderData, navigate, urlSearchParams]);

  return (
    <MainLayout showAddButton={false} withFooter={false} withBreadcrumb={false}>
      <Flex className="pb-3">
        <FolderDetails />
      </Flex>
    </MainLayout>
  );
};

export default DetailsFolderPageComponent;
