import useUser from "@/features/auth/hooks/use-user";
import { Collaborator, CollaboratorRole, SecurredFolderData } from "@/features/collaborator/collaborator";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { db } from "@/firebase/firebase-services";
import useDetectLocation from "@/hooks/use-detect-location";
import { message } from "antd";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useCallback } from "react";

interface HasRoleParams {
  userId: string;
  role: CollaboratorRole;
  collaborators: Collaborator[];
}

const handleGetIsFolderSecured = async (folderId: string): Promise<boolean> => {
  const securedFolderRef = doc(db, "secured-folder", folderId);
  const securedFolderSnap = await getDoc(securedFolderRef);
  return securedFolderSnap.exists() ? (securedFolderSnap.data() as SecurredFolderData).isSecuredFolderActive : false;
};

const handleGetFolderById = async (folderId: string): Promise<RootFolderGetData | SubFolderGetData | null> => {
  const folderRef = doc(db, "folders", folderId);
  const folderSnapshot = await getDoc(folderRef);
  return folderSnapshot.exists() ? (folderSnapshot.data() as RootFolderGetData | SubFolderGetData) : null;
};

const hasRole = ({ collaborators, role, userId }: HasRoleParams) => {
  return collaborators.some((collaborator) => collaborator.userId === userId && collaborator.role === role);
};

const handleIsOwnerOrEditor = async (folderId: string, userId: string): Promise<boolean> => {
  const collaboratorsCollection = collection(db, "collaborators");
  const collaboratorsQuery = query(collaboratorsCollection, where("folderId", "==", folderId));
  const collaboratorsSnapshot = await getDocs(collaboratorsQuery);

  const collaborators = collaboratorsSnapshot.empty ? [] : collaboratorsSnapshot.docs.map((doc) => doc.data() as Collaborator);

  const isEditor = hasRole({ collaborators, role: "editor", userId });
  const isOwner = hasRole({ collaborators, role: "owner", userId });
  return isEditor || isOwner;
};

const useSecuredFolderFolderActions = () => {
  const { user } = useUser();
  const { isMystorageLocation } = useDetectLocation();

  const handleCheckIsUserCanDoThisAction = useCallback(
    async (folderId: string, actionType: string): Promise<boolean> => {
      const loadingKey = `check-permission-loading-${actionType}`;
      message.open({
        type: "loading",
        content: "Checking permission...",
        className: "font-archivo text-sm",
        key: loadingKey,
        duration: 0,
      });

      // return if is mystorage location
      if (isMystorageLocation) {
        message.destroy(loadingKey);
        return true;
      }

      // Check if user exists
      if (!user) {
        message.open({
          type: "error",
          content: "please login first",
          className: "font-archivo text-sm",
          key: loadingKey,
        });
        return false;
      }

      // Check if folder is secured
      const isFolderSecured = await handleGetIsFolderSecured(folderId);
      if (!isFolderSecured) {
        message.destroy(loadingKey);
        return true;
      }

      // Check if folder exists
      const thisFolder = await handleGetFolderById(folderId);
      if (!thisFolder) {
        message.open({
          type: "error",
          content: "Folder does not exist",
          className: "font-archivo text-sm",
          key: loadingKey,
        });
        return false;
      }

      // Check user role (owner/editor)
      const isOwnerOrEditor = await handleIsOwnerOrEditor(folderId, user.uid);
      const isRootFolderMine = thisFolder?.root_folder_user_id === user?.uid;
      const hasPermission = isOwnerOrEditor || isRootFolderMine;

      if (hasPermission) {
        message.destroy(loadingKey);
        return true;
      }

      // Default error message if no permission
      message.open({
        type: "error",
        content: `Only owner/editor can ${actionType} secured folder`,
        className: "font-archivo text-sm",
        key: loadingKey,
      });
      return false;
    },
    [user, isMystorageLocation]
  );

  return { handleCheckIsUserCanDoThisAction };
};

export default useSecuredFolderFolderActions;
