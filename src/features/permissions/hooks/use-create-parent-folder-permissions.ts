import useUser from "@/features/auth/hooks/use-user";
import {
  Collaborator,
  CollaboratorRole,
  CollaboratorsStatus,
  GeneralAccess,
  GeneralAccessData,
  GeneralAccessRole,
} from "@/features/collaborator/collaborator";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDetectLocation from "@/hooks/use-detect-location";
import { parentFolderSelector } from "@/features/folder/slice/parent-folder-slice";
import { resetStateParentFolderPermission, setParentFolderPermissions } from "../slice/parent-folder-permissions";
import { history } from "@/store/store";

interface UseCreateParentFolderPermissionsParams {
  isParentSecuredFolderActive: boolean;
  collaboratorData: Collaborator | null;
  generalAccess: GeneralAccessData | null;
  collaboratorStatus: CollaboratorsStatus;
  generalAccessStatus: CollaboratorsStatus;
}

const useCreateParentFolderPermissions = ({
  isParentSecuredFolderActive,
  collaboratorData,
  collaboratorStatus,
  generalAccess,
  generalAccessStatus,
}: UseCreateParentFolderPermissionsParams) => {
  const { user } = useUser();
  const dispatch = useDispatch();

  /**
   * state
   */
  const { parentFolderData } = useSelector(parentFolderSelector);

  /**
   * detect location
   */
  const { isSubMoveFolderOrFileLocation, isSubMyStorageLocation, isSubSharedWithMeLocation } = useDetectLocation();
  const isSubFolderLocation = isSubMoveFolderOrFileLocation || isSubMyStorageLocation || isSubSharedWithMeLocation;

  /**
   * Checks if data fetching is successful
   */
  const isFetchCollaboratorSuccess = collaboratorStatus === "success";
  const isFetchGeneralAccessSuccess = generalAccessStatus === "success";
  const isFetchPermissionSuccess = isFetchCollaboratorSuccess && isFetchGeneralAccessSuccess;

  /**
   * Checks if collaborator and general access data exist and fetch was successful
   */
  const isCollaboratorSuccessAndExists = isFetchCollaboratorSuccess && collaboratorData !== null;
  const isGeneralAccessSuccessAndExists = isFetchGeneralAccessSuccess && generalAccess !== null;

  /**
   * Determines if the user matches a specific collaborator role
   */
  const isCollaborator = (role: CollaboratorRole) =>
    isCollaboratorSuccessAndExists && collaboratorData.role === role && collaboratorData.userId === user?.uid;

  /**
   * Determines if the folder has a specific general access type and role
   */
  const isGeneralAccess = (type: GeneralAccess, role: GeneralAccessRole | "") =>
    isGeneralAccessSuccessAndExists && generalAccess.type === type && (!role || generalAccess.role === role);

  /**
   * Collaborator-specific permission checks
   */
  const isCollaboratorCanEdit = isCollaborator("editor");
  const isCollaboratorOnlyViewer = isCollaborator("viewer");

  /**
   * General access-specific permission checks
   */
  const isGeneralAccessPublic = isGeneralAccess("public", "");
  const isGeneralAccessPublicEditor = isGeneralAccess("public", "editor");
  const isGeneralAccessPublicViewer = isGeneralAccess("public", "viewer");

  /**
   * Overall permission levels
   */
  const isOwner = isCollaborator("owner");
  const isRootFolderMine = parentFolderData?.root_folder_user_id === user?.uid;

  const isEditor = useMemo(() => {
    const isEditorWhenSecuredFolderNotActive = isCollaboratorCanEdit || isGeneralAccessPublicEditor || isRootFolderMine || isOwner;
    const isEditorWhenSecuredFolderActive = isCollaboratorCanEdit || isRootFolderMine || isOwner;

    return isParentSecuredFolderActive ? isEditorWhenSecuredFolderActive : isEditorWhenSecuredFolderNotActive;
  }, [isCollaboratorCanEdit, isGeneralAccessPublicEditor, isOwner, isParentSecuredFolderActive, isRootFolderMine]);

  const isViewer = isCollaboratorOnlyViewer || isGeneralAccessPublicViewer || isGeneralAccessPublicEditor || isGeneralAccessPublic;

  /**
   * Determines user actions based on their permissions
   */
  const canCRUD = isOwner || isEditor;
  const canView = canCRUD || isViewer;

  /**
   * Final permissions object with detailed breakdown
   */
  const parentFolderPermission: ParentFolderPermissions = useMemo(() => {
    return {
      actionPermissions: {
        canCRUD,
        canView,
      },
      permissionsDetails: {
        isParentSecuredFolderActive,
        isOwner,
        isRootFolderMine,
        isCollaboratorCanEdit,
        isGeneralAccessPublic,
        isGeneralAccessPublicEditor,
        isSubFolderLocation,
      },
      isFetchPermissionSuccess,
    };
  }, [
    isParentSecuredFolderActive,
    isRootFolderMine,
    canCRUD,
    canView,
    isOwner,
    isCollaboratorCanEdit,
    isGeneralAccessPublic,
    isGeneralAccessPublicEditor,
    isFetchPermissionSuccess,
    isSubFolderLocation,
  ]);

  /**
   * set value to global state
   */
  useEffect(() => {
    if (isFetchPermissionSuccess) dispatch(setParentFolderPermissions(parentFolderPermission));
  }, [isFetchPermissionSuccess, parentFolderPermission, dispatch]);

  /**
   * listen location change and reset state
   */
  useEffect(() => {
    const nextLocation = history.listen(() => dispatch(resetStateParentFolderPermission()));
    return () => nextLocation();
  }, [dispatch]);

  return parentFolderPermission;
};

export default useCreateParentFolderPermissions;
