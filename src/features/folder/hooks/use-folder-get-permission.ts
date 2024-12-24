import { useMemo } from "react";
import { CollaboratorUserData, GeneralAccessDataSerialized } from "../folder-collaborator";

interface UseFolderGetPermissionsProps {
  userId: string | undefined;
  collaboratorsUserData: CollaboratorUserData[] | null;
  generalAccessDataState: GeneralAccessDataSerialized | null;
  parentFolderOwnerId?: string;
}

const useFolderGetPermission = ({
  userId,
  collaboratorsUserData,
  generalAccessDataState,
  parentFolderOwnerId,
}: UseFolderGetPermissionsProps) => {
  /** Utility: Role Checking */
  const hasRole = useMemo(
    () => (role: string) =>
      collaboratorsUserData?.some(
        (collaborator) => collaborator.userId === userId && collaborator.role === role
      ) || false,
    [collaboratorsUserData, userId]
  );

  const isOwner = useMemo(() => hasRole("owner"), [hasRole]);
  const isCollaborator = useMemo(() => hasRole("editor") || hasRole("viewer") || isOwner, [hasRole, isOwner]);
  const isCollaboratorButOnlyViewer = useMemo(() => hasRole("viewer"), [hasRole]);
  const isCollaboratorAndEditor = useMemo(() => hasRole("editor"), [hasRole]);
  const isParentFolderMine = useMemo(() => parentFolderOwnerId === userId, [parentFolderOwnerId, userId]);

  /** Utility: General Access Checking */
  const isFolderPublic = useMemo(() => generalAccessDataState?.type === "public", [generalAccessDataState]);
  const isGeneralAccessCanEdit = useMemo(
    () => generalAccessDataState?.role === "editor" && generalAccessDataState.type === "public",
    [generalAccessDataState]
  );

  /** Permissions */
  const permissions = useMemo(() => {
    const canManageAccess = isOwner || isCollaboratorAndEditor || isParentFolderMine;
    const canCRUD = canManageAccess || isGeneralAccessCanEdit || isParentFolderMine;
    const canView = isFolderPublic || isCollaborator || isCollaboratorButOnlyViewer || isParentFolderMine;

    return { canCRUD, canView, canManageAccess };
  }, [
    isParentFolderMine,
    isOwner,
    isCollaborator,
    isCollaboratorAndEditor,
    isFolderPublic,
    isGeneralAccessCanEdit,
    isCollaboratorButOnlyViewer,
  ]);

  return { permissions };
};

export default useFolderGetPermission;
