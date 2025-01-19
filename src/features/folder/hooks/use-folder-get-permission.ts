import { useEffect, useMemo, useState } from "react";
import { CollaboratorUserData, GeneralAccessDataSerialized } from "../folder-collaborator";

interface UseFolderGetPermissionsProps {
  userId: string | null;
  collaboratorsUserData: CollaboratorUserData[] | null;
  generalAccessDataState: GeneralAccessDataSerialized | null;
  parentFolderOwnerId: string | null;
  shouldProcessPermission: boolean;
}

export interface Permissions {
  canCRUD: boolean;
  canView: boolean;
  canManageAccess: boolean;
}

const useFolderGetPermission = ({
  userId,
  collaboratorsUserData,
  generalAccessDataState,
  parentFolderOwnerId,
  shouldProcessPermission,
}: UseFolderGetPermissionsProps) => {
  /** Utility: Role Checking */
  const hasRole = useMemo(
    () => (role: string) => collaboratorsUserData?.some((collaborator) => collaborator.userId === userId && collaborator.role === role) || false,
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

  const [permissions, setPermissions] = useState<Permissions>({
    canCRUD: true,
    canView: true,
    canManageAccess: true,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      shouldProcessPermission && setPermissions({ canCRUD, canView, canManageAccess });
    }, 50);
    return () => clearTimeout(timeout);
  }, [canCRUD, canView, canManageAccess, shouldProcessPermission]);

  return { permissions };
};

export default useFolderGetPermission;
