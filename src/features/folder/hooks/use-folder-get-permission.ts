import { CollaboratorUserData, GeneralAccessData } from "@/features/collaborator/collaborator";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseFolderGetPermissionsProps {
  userId: string | null;
  collaboratorsUserData: CollaboratorUserData[] | null;
  generalAccessDataState: GeneralAccessData | null;
  parentFolderOwnerId: string | null;
  shouldProcessPermission: boolean;
}

const useFolderGetPermission = ({
  userId,
  collaboratorsUserData,
  generalAccessDataState,
  parentFolderOwnerId,
  shouldProcessPermission,
}: UseFolderGetPermissionsProps) => {
  /** Utility: Role Checking */
  const hasRole = useCallback(
    (role: string): boolean => {
      return !!collaboratorsUserData?.some((collaborator) => collaborator.userId === userId && collaborator.role === role);
    },
    [collaboratorsUserData, userId]
  );

  const isOwner = useMemo(() => hasRole("owner"), [hasRole]);
  const isCollaboratorButOnlyViewer = useMemo(() => hasRole("viewer"), [hasRole]);
  const isCollaboratorAndEditor = useMemo(() => hasRole("editor"), [hasRole]);
  const isParentFolderMine = useMemo(() => parentFolderOwnerId === userId, [parentFolderOwnerId, userId]);

  /** Utility: General Access Checking */
  const isFolderPublic = useMemo(() => generalAccessDataState?.type === "public", [generalAccessDataState]);
  const isGeneralAccessCanEdit = useMemo(() => {
    return generalAccessDataState?.role === "editor" && generalAccessDataState.type === "public";
  }, [generalAccessDataState]);

  /**
   * define who can manage access
   */
  const canManageAccess = useMemo(() => {
    return isOwner || isCollaboratorAndEditor || isParentFolderMine;
  }, [isCollaboratorAndEditor, isOwner, isParentFolderMine]);

  /**
   * define who can CRUD operations
   */
  const canCRUD = useMemo(() => {
    return canManageAccess || isGeneralAccessCanEdit || isParentFolderMine;
  }, [canManageAccess, isGeneralAccessCanEdit, isParentFolderMine]);

  /**
   * define who can view
   */
  const canView = useMemo(() => {
    return isFolderPublic || isCollaboratorButOnlyViewer || canCRUD || canManageAccess;
  }, [isCollaboratorButOnlyViewer, isFolderPublic, canCRUD, canManageAccess]);

  const [permissions, setPermissions] = useState<FolderPermission>({
    canCRUD: true,
    canView: true,
    canManageAccess: true,
  });

  const [permissionDataDetails, setPermissionDataDetails] = useState<FolderPermissionDataDetails>({
    isCollaboratorAndEditor: false,
    isCollaboratorButOnlyViewer: false,
    isOwner: false,
    isParentFolderMine: false,
    isFolderPublic: false,
    isGeneralAccessCanEdit: false,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPermissionDataDetails({
        isCollaboratorAndEditor: isCollaboratorAndEditor,
        isCollaboratorButOnlyViewer: isCollaboratorButOnlyViewer,
        isOwner: isOwner,
        isParentFolderMine: isParentFolderMine,
        isFolderPublic: isFolderPublic,
        isGeneralAccessCanEdit: isGeneralAccessCanEdit,
      });
    }, 50);

    return () => clearTimeout(timeout);
  }, [isCollaboratorAndEditor, isCollaboratorButOnlyViewer, isOwner, isParentFolderMine, isFolderPublic, isGeneralAccessCanEdit]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      shouldProcessPermission && setPermissions({ canCRUD, canView, canManageAccess });
    }, 50);
    return () => clearTimeout(timeout);
  }, [canCRUD, canView, canManageAccess, shouldProcessPermission]);

  return { permissions, permissionDataDetails };
};

export default useFolderGetPermission;
