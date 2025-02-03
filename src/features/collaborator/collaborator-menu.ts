import { v4 as uuidv4 } from "uuid";
import handleCollaboratorMenuAction from "../collaborator/collaborator-menu-action";
import { RootFolderGetData, SubFolderGetData } from "./folder";
import { CollaboratorRole, CollaboratorUserData } from "./folder-collaborator";

const changeCollaboratorLabel = (item: string) => {
  switch (item) {
    case "TRANSFER-OWNER":
      return "Transfer Owner";
    case "REMOVE-ACCESS":
      return "Remove Access";
    case "VIEWER":
      return "Viewer";
    case "EDITOR":
      return "Editor";
    default:
      return item;
  }
};

export interface CollaboratorMenuItem {
  key: string;
  label: string;
  handleClick: (roleData: CollaboratorUserData, action: string, folderData: SubFolderGetData | RootFolderGetData | null) => void;
}

export const CollaboratorMenu: Record<CollaboratorRole, readonly string[]> = {
  owner: ["VIEWER", "EDITOR", "REMOVE-ACCESS", "TRANSFER-OWNER"],
  editor: ["VIEWER", "EDITOR", "REMOVE-ACCESS"],
  viewer: ["VIEWER", "REMOVE-ACCESS"],
  assigner: ["VIEWER", "EDITOR"],
};

export const collaboratorMenu = (role: CollaboratorRole): CollaboratorMenuItem[] => {
  const menu = CollaboratorMenu[role];
  const menuItems: CollaboratorMenuItem[] = menu.map((item) => ({
    key: uuidv4(),
    label: changeCollaboratorLabel(item),
    handleClick: (roleData: CollaboratorUserData, action: string, folderData: SubFolderGetData | RootFolderGetData | null) => {
      handleCollaboratorMenuAction({ userId: roleData.userId, folderData, action });
    },
  }));
  return menuItems;
};

export const addCollaboratorsMenu = (roleAssigner: CollaboratorRole) => {
  const menu = CollaboratorMenu[roleAssigner];
  const menuItems: Omit<CollaboratorMenuItem, "handleClick">[] = menu.map((item) => ({
    key: uuidv4(),
    label: changeCollaboratorLabel(item),
  }));
  return menuItems;
};
