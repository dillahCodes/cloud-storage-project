import useUser from "@/features/auth/hooks/use-user";
import {
  CollaboratorRole,
  CollaboratorsStatus,
  CollaboratorUserData,
  GeneralAccess,
  GeneralAccessData,
  GeneralAccessRole,
} from "@/features/collaborator/collaborator";
import useDetectLocation from "@/hooks/use-detect-location";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setDetailsFolderPermissions } from "../slice/details-folder-permissions";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";

interface UseCreateDetailsFolderPermissions {
  detailsFolderData: RootFolderGetData | SubFolderGetData | null;
  collaboratorsData: CollaboratorUserData[] | null;
  collaboratorsStatus: CollaboratorsStatus;
  generalAccess: GeneralAccessData | null;
  generalAccessStatus: CollaboratorsStatus;
  isSecuredFolderActive: boolean;
}

const useCreateDetailsFolderPermissions = ({
  detailsFolderData,
  collaboratorsData,
  collaboratorsStatus,
  isSecuredFolderActive,
  generalAccess,
  generalAccessStatus,
}: UseCreateDetailsFolderPermissions) => {
  const dispatch = useDispatch();
  const { user } = useUser();

  /**
   * detect user current location
   */
  const { isSubMoveFolderOrFileLocation, isSubMyStorageLocation, isSubSharedWithMeLocation } = useDetectLocation();
  const isSubFolderLocation = isSubMoveFolderOrFileLocation || isSubMyStorageLocation || isSubSharedWithMeLocation;

  /**
   * Checks if data fetching is successful
   */
  const isFetchCollaboratorSuccess = collaboratorsStatus === "success";
  const isFetchGeneralAccessSuccess = generalAccessStatus === "success";
  const isFetchPermissionSuccess = isFetchCollaboratorSuccess && isFetchGeneralAccessSuccess;

  /**
   * Checks if collaborator and general access data exist and fetch was successful
   */
  //   const isCollaboratorSuccessAndExists = isFetchCollaboratorSuccess && collaboratorsData && collaboratorsData.length > 0;
  const isGeneralAccessSuccessAndExists = isFetchGeneralAccessSuccess && generalAccess !== null;

  /**
   * Determines if the user matches a specific collaborator role
   */
  const isCollaborator = (role: CollaboratorRole) =>
    !!collaboratorsData?.some((collaborator) => collaborator.role === role && collaborator.userId === user?.uid);

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
   * owner permissions and viewer permissions
   * and is root folder mine
   */
  const isOwner: boolean = isCollaborator("owner");
  const isViewer: boolean = useMemo(() => {
    return isCollaboratorOnlyViewer || isGeneralAccessPublicViewer || isGeneralAccessPublicEditor || isGeneralAccessPublic;
  }, [isCollaboratorOnlyViewer, isGeneralAccessPublic, isGeneralAccessPublicEditor, isGeneralAccessPublicViewer]);
  const isRootFolderMine: boolean = useMemo(() => {
    return detailsFolderData?.root_folder_user_id === user?.uid;
  }, [detailsFolderData?.root_folder_user_id, user?.uid]);

  /**
   * editor permissions varaints
   */
  const isGenralAccessPublicEditorCanEdit: boolean = useMemo(() => {
    return isOwner || isCollaboratorCanEdit || isGeneralAccessPublicEditor;
  }, [isCollaboratorCanEdit, isGeneralAccessPublicEditor, isOwner]);

  const isOnlyOwnerAndCollaboratorCanEdit = useMemo(() => {
    return isOwner || isCollaboratorCanEdit || isRootFolderMine;
  }, [isCollaboratorCanEdit, isOwner, isRootFolderMine]);

  /**
   * Determines user actions based on their permissions
   */
  const canCRUD: boolean = useMemo(() => {
    return isSecuredFolderActive ? isOnlyOwnerAndCollaboratorCanEdit : isGenralAccessPublicEditorCanEdit;
  }, [isGenralAccessPublicEditorCanEdit, isOnlyOwnerAndCollaboratorCanEdit, isSecuredFolderActive]);

  /**
   * Determines if the user can view the folder based on permissions
   */
  const canView = useMemo(() => {
    return canCRUD || isViewer;
  }, [canCRUD, isViewer]);

  /**
   * Final permissions object with detailed breakdown
   */
  const detailsFolderPermissions: DetailFolderPermissions = useMemo(() => {
    return {
      actionPermissions: { canCRUD, canView },
      permissionsDetails: {
        isOwner,
        isRootFolderMine,
        isCollaboratorCanEdit,
        isGeneralAccessPublic,
        isGeneralAccessPublicEditor,
        isSecuredFolderActive,
        isSubFolderLocation,
      },
      isFetchPermissionSuccess,
    };
  }, [
    canCRUD,
    isRootFolderMine,
    canView,
    isCollaboratorCanEdit,
    isGeneralAccessPublic,
    isGeneralAccessPublicEditor,
    isOwner,
    isSecuredFolderActive,
    isSubFolderLocation,
    isFetchPermissionSuccess,
  ]);

  /**
   * set all permissions to state
   */
  useEffect(() => {
    if (!isFetchPermissionSuccess) return;
    dispatch(setDetailsFolderPermissions(detailsFolderPermissions));
  }, [dispatch, detailsFolderPermissions, isFetchPermissionSuccess]);

  return detailsFolderPermissions;
};

export default useCreateDetailsFolderPermissions;
