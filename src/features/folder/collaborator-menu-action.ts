import handleChangeCollaboratorRole from "./change-collabrator-role";
import { RootFolderGetData, SubFolderGetData } from "./folder";
import { CollaboratorRole } from "./folder-collaborator";
import handleRemoveCollaborator from "./remove-collaborator";
import handleTransferCollaboratorFolderOwner from "./transfer-collaborator-folder-owner";

interface HandleCollaboratorMenuActionParams {
  userId: string;
  folderData: SubFolderGetData | RootFolderGetData | null;
  action: string;
}

const handleCollaboratorMenuAction = ({ userId, folderData, action }: HandleCollaboratorMenuActionParams) => {
  if (!folderData) return;

  switch (action) {
    case "Viewer":
      handleChangeCollaboratorRole({ folderId: folderData.folder_id, collaboratorId: userId, role: "Viewer".toLowerCase() as CollaboratorRole });
      break;

    case "Editor":
      handleChangeCollaboratorRole({ folderId: folderData.folder_id, collaboratorId: userId, role: "Editor".toLowerCase() as CollaboratorRole });
      break;

    case "Remove Access":
      handleRemoveCollaborator({ collaboratorId: userId, folderId: folderData.folder_id });
      break;

    case "Transfer Owner":
      handleTransferCollaboratorFolderOwner({ collaboratorId: userId, folderId: folderData.folder_id });
      break;

    default:
      break;
  }
};

export default handleCollaboratorMenuAction;
