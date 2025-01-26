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
import { useMemo } from "react";

interface UseCreateDetailsFolderPermissions {
  collaboratorsData: CollaboratorUserData[] | null;
  generalAccess: GeneralAccessData | null;
  isSecuredFolderActive: boolean;
  collaboratorsStatus: CollaboratorsStatus;
  generalAccessStatus: CollaboratorsStatus;
}

const useCreateDetailsFolderPermissions = ({
  collaboratorsData,
  collaboratorsStatus,
  isSecuredFolderActive,
  generalAccess,
  generalAccessStatus,
}: UseCreateDetailsFolderPermissions) => {
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
    collaboratorsData?.some((collaborator) => collaborator.role === role && collaborator.userId === user?.uid);

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
   */
  const isOwner = isCollaborator("owner");
  const isViewer = useMemo(() => {
    return isCollaboratorOnlyViewer || isGeneralAccessPublicViewer || isGeneralAccessPublicEditor || isGeneralAccessPublic;
  }, [isCollaboratorOnlyViewer, isGeneralAccessPublic, isGeneralAccessPublicEditor, isGeneralAccessPublicViewer]);

  /**
   * editor permissions varaints
   */
  const isGenralAccessPublicEditorCanEdit = useMemo(() => {
    return isOwner || isCollaboratorCanEdit || isGeneralAccessPublicEditor;
  }, [isCollaboratorCanEdit, isGeneralAccessPublicEditor, isOwner]);

  const isOnlyOwnerAndCollaboratorCanEdit = useMemo(() => {
    return isOwner || isCollaboratorCanEdit;
  }, [isCollaboratorCanEdit, isOwner]);

  /**
   * Determines user actions based on their permissions
   */
  const canCRUD = useMemo(() => {
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
  const detailsFolderPermissions = {
    actionPermissions: { canCRUD, canView },
    permissionsDetails: {
      isOwner,
      isCollaboratorCanEdit,
      isGeneralAccessPublic,
      isGeneralAccessPublicEditor,
      isSubFolderLocation,
    },
    isFetchPermissionSuccess,
  };

  return detailsFolderPermissions;
};

export default useCreateDetailsFolderPermissions;
