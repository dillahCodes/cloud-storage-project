import useUser from "@/features/auth/hooks/use-user";
import useAddFirstBreadcrumbItem from "@/features/breadcrumb/hooks/use-add-first-breadcrumb-item";
import useAddBreadcrumbItems from "@/features/breadcrumb/hooks/use-addbreadcrumb-items";
import useAutoDeleteUnusedBreadcrumbItems from "@/features/breadcrumb/hooks/use-auto-delete-unused-breadcrumb-items";
import useBreadcrumbState from "@/features/breadcrumb/hooks/use-breadcrumb-state";
import useSubFolderAutoGetBreadcrums from "@/features/breadcrumb/hooks/use-sub-folder-auto-get-breadcrumbs";
import useFilesState from "@/features/file/hooks/use-files-state";
import useGetFiles from "@/features/file/hooks/use-get-files";
import useAddSharedWithMeFolderData from "@/features/folder/hooks/use-add-shared-with-me-folder-data";
import useCurrentFolderState from "@/features/folder/hooks/use-current-folder-state";
import useDeleteSharedFolder from "@/features/folder/hooks/use-detete-shared-folder";
import useFolderGetPermission from "@/features/folder/hooks/use-folder-get-permission";
import useFolderPermissionSetState from "@/features/folder/hooks/use-folder-permission-setstate";
import useGetCollaborators from "@/features/folder/hooks/use-get-collaborators";
import useGetFolder from "@/features/folder/hooks/use-get-folder";
import useGetGeneralAccess from "@/features/folder/hooks/use-get-general-access";
import useParentFolder from "@/features/folder/hooks/use-parent-folder";
import useMobileHeaderTitle from "@/hooks/use-mobile-header-title";
import MainLayout from "@components/layout/main-layout";
import { Layout, Spin } from "antd";
import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import MappingFiles from "./mapping-files";
import MappingFolders from "./mapping-folders";

const NestedFolderPageComponent: React.FC = () => {
  useMobileHeaderTitle("folders");

  const { user } = useUser();
  const { folderId } = useParams<{ folderId: string }>();

  const { "0": urlSearchParams } = useSearchParams();
  const [params] = useState((urlSearchParams.get("st") as NestedBreadcrumbType) || "my-storage");

  // parent folder state
  const { parentFolderState } = useParentFolder({
    fetchParentFolderDataOnMount: true,
    resetParentFolderDataOnMount: true,
    folderId,
  });
  const { status: parentFolderStatus } = parentFolderState;

  // get parent folder collaborators and general access data
  const { collaboratorsUserData, fetchCollaboratorsUserDataStatus } = useGetCollaborators({
    shouldFetch: parentFolderState.isValidParentFolder,
    folderId,
    shoudFetchUserCollaboratorsData: parentFolderState.isValidParentFolder,
  });
  const { generalAccessDataState, fetchStatus } = useGetGeneralAccess({
    shouldFetch: parentFolderState.isValidParentFolder,
    folderId,
  });
  const isGetPermissionSuccess = useMemo(() => {
    return fetchCollaboratorsUserDataStatus === "succeeded" && fetchStatus === "succeeded" && parentFolderStatus === "succeeded";
  }, [fetchCollaboratorsUserDataStatus, fetchStatus, parentFolderStatus]);

  // get permission in this sub folder
  const { permissions, permissionDataDetails } = useFolderGetPermission({
    userId: user ? user.uid : null,
    collaboratorsUserData: collaboratorsUserData ?? null,
    generalAccessDataState: generalAccessDataState ?? null,
    parentFolderOwnerId: parentFolderState.parentFolderData?.owner_user_id ?? null,
    shouldProcessPermission: isGetPermissionSuccess,
  });

  // console.log(permissionDataDetails);

  // // set folder permission to state
  useFolderPermissionSetState({
    isRootFolder: false,

    subFolderPermissions: permissions,
    detailsFolderPermissions: null,

    permissionsStatus: isGetPermissionSuccess ? "succeeded" : "loading",
    shouldProceed: isGetPermissionSuccess,
  });

  // delete shared folder if user can't view
  const shouldDeleteSharedFolder =
    parentFolderState.parentFolderData?.root_folder_user_id !== user?.uid && !permissions.canView && isGetPermissionSuccess;
  useDeleteSharedFolder({
    parentFolderId: parentFolderState.parentFolderData?.folder_id,
    shouldFetch: shouldDeleteSharedFolder,
  });

  // if is shared-with me params then add save parentFolder id to firestore
  const shouldSaveSharedFolder = useMemo(() => {
    return (
      params === "shared-with-me" &&
      parentFolderState.parentFolderData?.root_folder_user_id !== user?.uid &&
      parentFolderState.isValidParentFolder &&
      permissions.canView
    );
  }, [params, parentFolderState, user, permissions]);

  // add shared with me folder data
  useAddSharedWithMeFolderData({
    shouldAdd: shouldSaveSharedFolder,
  });

  // set first breadcrumb item
  useAddFirstBreadcrumbItem({
    addInMount: true,
    breadcrumbItem: {
      label: params === "my-storage" ? "my storage" : "shared with me",
      path: "/storage/my-storage",
      key: params === "my-storage" ? "my storage" : "shared with me",
      icon: params === "my-storage" ? "storage" : "share",
    },
  });

  // auto delete unused breadcrumb items
  useAutoDeleteUnusedBreadcrumbItems({
    breadcrumbKey: folderId || "",
    shouldDelete: Boolean(folderId),
  });

  // get breadcrumb state
  const breadcrumbState = useBreadcrumbState();
  const isBreadcrumbExist = useMemo(() => breadcrumbState.items.some((item) => item.key === folderId), [breadcrumbState.items, folderId]);

  const shouldFetchBreadcrumb = Boolean(folderId && !isBreadcrumbExist);

  // get breadcrumb hierarchy and set to state
  const { breadcrumbItems, fetchStatus: fetchBreadcrumbStatus } = useSubFolderAutoGetBreadcrums({
    currentFolderId: folderId,
    shouldFetch: shouldFetchBreadcrumb,
  });
  useAddBreadcrumbItems({
    breadcrumbItems,
    status: fetchBreadcrumbStatus,
  });

  // get folders data
  useGetFolder({
    isRoot: false,
    shouldFetchInMount: isGetPermissionSuccess,
  });

  // folders state
  const { status: folderStatus, folders } = useCurrentFolderState();

  useGetFiles({
    isRoot: false,
    shouldFetchInMount: isGetPermissionSuccess,
  });

  // files state
  const { files, status: fileStatus } = useFilesState();

  const isLoading = useMemo(() => {
    return fileStatus === "loading" || folderStatus === "loading" || fetchCollaboratorsUserDataStatus === "loading" || fetchStatus === "loading";
  }, [fetchCollaboratorsUserDataStatus, fetchStatus, fileStatus, folderStatus]);

  const isAllDataEmpty = useMemo(() => {
    return (
      files.length === 0 &&
      fileStatus !== "loading" &&
      fileStatus !== "idle" &&
      folders.length === 0 &&
      folderStatus !== "loading" &&
      folderStatus !== "idle" &&
      parentFolderStatus !== "loading" &&
      parentFolderStatus !== "idle"
    );
  }, [fileStatus, folderStatus, files.length, folders.length, parentFolderStatus]);

  return (
    <MainLayout showAddButton showPasteButton>
      {isLoading ? (
        <Layout className="h-screen w-full flex justify-center items-center">
          <Spin size="large" />
        </Layout>
      ) : (
        <>
          <MappingFolders isAllDataEmpty={isAllDataEmpty} />
          <MappingFiles />
        </>
      )}
    </MainLayout>
  );
};

export default NestedFolderPageComponent;
