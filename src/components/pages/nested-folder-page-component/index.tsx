import useUser from "@/features/auth/hooks/use-user";
import useAddFirstBreadcrumbItem from "@/features/breadcrumb/hooks/use-add-first-breadcrumb-item";
import useAddBreadcrumbItems from "@/features/breadcrumb/hooks/use-addbreadcrumb-items";
import useAutoDeleteUnusedBreadcrumbItems from "@/features/breadcrumb/hooks/use-auto-delete-unused-breadcrumb-items";
import useBreadcrumbState from "@/features/breadcrumb/hooks/use-breadcrumb-state";
import useSubFolderAutoGetBreadcrums from "@/features/breadcrumb/hooks/use-sub-folder-auto-get-breadcrumbs";
import useGetGeneralAccessDataByFolderId from "@/features/collaborator/hooks/use-get-general-access-by-folderId";
import useGetIsCollaboratorByUserIdAndFolderId from "@/features/collaborator/hooks/use-get-is-collaborator-by-userId-and-folderId";
import useSecuredFolderOnDataChange from "@/features/collaborator/hooks/use-secured-folder-on-data-change";
import useFilesState from "@/features/file/hooks/use-files-state";
import useGetFiles from "@/features/file/hooks/use-get-files";
import useAddSharedWithMeFolderData from "@/features/folder/hooks/use-add-shared-with-me-folder-data";
import useCurrentFolderState from "@/features/folder/hooks/use-current-folder-state";
import useDeleteSharedFolder from "@/features/folder/hooks/use-detete-shared-folder";
import useGetFolder from "@/features/folder/hooks/use-get-folder";
import useGetParentFolder from "@/features/folder/hooks/use-get-parent-folder";
import { parentFolderSelector } from "@/features/folder/slice/parent-folder-slice";
import useCreateParentFolderPermissions from "@/features/permissions/hooks/use-create-parent-folder-permissions";
import { parentFolderPermissionSelector } from "@/features/permissions/slice/parent-folder-permissions";
import useDetectLocation from "@/hooks/use-detect-location";
import useMobileHeaderTitle from "@/hooks/use-mobile-header-title";
import MainLayout from "@components/layout/main-layout";
import { Layout, Spin } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MappingFiles from "./mapping-files";
import MappingFolders from "./mapping-folders";

const NestedFolderPageComponent: React.FC = () => {
  useMobileHeaderTitle("folders");

  const { user } = useUser();
  const { folderId } = useParams<{ folderId: string }>();
  const { isSubSharedWithMeLocation, isSubMyStorageLocation } = useDetectLocation();

  /**
   * hooks get parent folder
   */
  useGetParentFolder({ shouldFetch: Boolean(folderId), folderId });

  /**
   * parent folder state
   */
  const parentFolderState = useSelector(parentFolderSelector);
  const { status: parentFolderStatus } = parentFolderState;
  const isParentFolderFetchSuccess = useMemo(() => parentFolderStatus === "succeeded", [parentFolderStatus]);

  /**
   * get user is collaborator in this parent
   * folder is current user collaborator or not
   */
  const shouldFetchCollaborator = useMemo(() => {
    return Boolean(parentFolderState.parentFolderData?.folder_id && user?.uid && isParentFolderFetchSuccess);
  }, [user?.uid, parentFolderState.parentFolderData?.folder_id, isParentFolderFetchSuccess]);

  const { collaboratorData, collaboratorStatus } = useGetIsCollaboratorByUserIdAndFolderId({
    folderId: parentFolderState.parentFolderData?.folder_id ?? null,
    shouldFetch: shouldFetchCollaborator,
    userId: user?.uid ?? null,
  });

  /**
   * get general access data in this parent folder
   */
  const shouldFetchGeneralAccess = useMemo(() => {
    return Boolean(parentFolderState.parentFolderData?.folder_id && isParentFolderFetchSuccess);
  }, [parentFolderState.parentFolderData?.folder_id, isParentFolderFetchSuccess]);

  const { generalAccess, generalAccessStatus } = useGetGeneralAccessDataByFolderId({
    folderId: parentFolderState.parentFolderData?.folder_id ?? null,
    shouldFetch: shouldFetchGeneralAccess,
  });

  /**
   * get parent secured folder active or not
   */
  const { isSecuredFolderActive: isParentSecuredFolderActive } = useSecuredFolderOnDataChange({
    folderId: parentFolderState.parentFolderData?.folder_id ?? null,
  });

  /**
   * create parent folder permission based on collaborator and general access
   * and store to global state
   */
  useCreateParentFolderPermissions({
    isParentSecuredFolderActive,
    collaboratorData,
    collaboratorStatus,
    generalAccess,
    generalAccessStatus,
  });

  /**
   * parent folder permission state
   */
  const { actionPermissions, isFetchPermissionSuccess, permissionsDetails } = useSelector(parentFolderPermissionSelector);

  /**
   * delete shared folder if user can't view
   */
  const shouldDeleteSharedFolder = useMemo(() => {
    return !actionPermissions.canView && isFetchPermissionSuccess;
  }, [actionPermissions.canView, isFetchPermissionSuccess]);

  useDeleteSharedFolder({
    parentFolderId: parentFolderState.parentFolderData?.folder_id,
    shouldFetch: shouldDeleteSharedFolder,
  });

  /**
   *  if current user in sub shared with me location and is not owner of this folder
   *  save folder in shared folder
   */
  const saveSharedFolderConditions = useMemo(() => {
    return [
      // Check if the location is within a "shared-with-me" subfolder
      isSubSharedWithMeLocation,
      // Ensure the user is not the owner of the folder
      !permissionsDetails.isOwner,
      // Verify that the parent folder is valid
      parentFolderState.isValidParentFolder,
      // Confirm the user has permission to view the folder
      actionPermissions.canView,
      // Ensure permissions were successfully fetched
      isFetchPermissionSuccess,
    ];
  }, [isSubSharedWithMeLocation, permissionsDetails, parentFolderState, actionPermissions.canView, isFetchPermissionSuccess]);
  const shouldSaveSharedFolder = useMemo(() => saveSharedFolderConditions.every((condition) => condition), [saveSharedFolderConditions]);

  /**
   * save shared folder if conditions are met
   */
  useAddSharedWithMeFolderData({
    shouldAdd: shouldSaveSharedFolder,
  });

  // set first breadcrumb item
  useAddFirstBreadcrumbItem({
    addInMount: true,
    breadcrumbItem: {
      label: isSubMyStorageLocation ? "my storage" : "shared with me",
      path: "/storage/my-storage",
      key: isSubMyStorageLocation ? "my storage" : "shared with me",
      icon: isSubMyStorageLocation ? "storage" : "share",
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

  /**
   * get current folder data
   */
  const shouldFetchCurrentFoldersData = useMemo(() => {
    return isFetchPermissionSuccess && isParentFolderFetchSuccess;
  }, [isFetchPermissionSuccess, isParentFolderFetchSuccess]);
  useGetFolder({
    isRoot: false,
    shouldFetchInMount: shouldFetchCurrentFoldersData,
  });

  /**
   * current folders state
   */
  const { status: folderStatus, folders } = useCurrentFolderState();

  /**
   * Fetch files data
   */
  const shouldFetchFiles = useMemo(() => {
    return isFetchPermissionSuccess && isParentFolderFetchSuccess;
  }, [isFetchPermissionSuccess, isParentFolderFetchSuccess]);
  useGetFiles({
    isRoot: false,
    shouldFetchInMount: shouldFetchFiles,
  });

  /**
   * current files state
   */
  const { files, status: fileStatus } = useFilesState();

  /**
   * check if all data is loading
   */
  const loadingStatuses = useMemo(() => {
    return [
      // Check if files are still loading
      fileStatus === "loading",
      // Check if folders are still loading
      folderStatus === "loading",
      // Check if the parent folder is still loading
      parentFolderStatus === "loading",
      // Check if the parent folder permissions have not been successfully fetched
      !isFetchPermissionSuccess,
    ];
  }, [fileStatus, folderStatus, parentFolderStatus, isFetchPermissionSuccess]);
  const isAllPromisesLoading = useMemo(() => loadingStatuses.some((condition) => condition), [loadingStatuses]);

  /**
   * check parent folder is success and get permissions parent folder is success,
   * but files and folders is empty
   */
  const isAllDataEmpty = useMemo(() => {
    const isEmpty = (length: number, status: string) => length === 0 && status !== "loading" && status !== "idle";

    return isParentFolderFetchSuccess && isFetchPermissionSuccess && isEmpty(files.length, fileStatus) && isEmpty(folders.length, folderStatus);
  }, [files.length, fileStatus, folders.length, folderStatus, isFetchPermissionSuccess, isParentFolderFetchSuccess]);

  /**
   * show spinner when all data is loading
   */
  if (isAllPromisesLoading) {
    return (
      <MainLayout showAddButton showPasteButton>
        {isAllPromisesLoading && (
          <Layout className="h-screen w-full flex justify-center items-center">
            <Spin size="large" />
          </Layout>
        )}
      </MainLayout>
    );
  }
  return (
    <MainLayout showAddButton showPasteButton>
      <MappingFolders isAllDataEmpty={isAllDataEmpty} />
      <MappingFiles />
    </MainLayout>
  );
};

export default NestedFolderPageComponent;
