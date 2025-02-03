import { db } from "@/firebase/firebase-services";
import { collection, doc, DocumentData, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { CollaboratorRole, CollaboratorSerialized } from "./folder-collaborator";

interface HandleTransferCollaboratorFolderOwnerParams {
  folderId: string;
  collaboratorId: string;
}

const handleTransferCollaboratorFolderOwner = async ({ collaboratorId, folderId }: HandleTransferCollaboratorFolderOwnerParams): Promise<void> => {
  try {
    const currFolderOwner = (await handleGetFolderCollaboratorOwner(folderId)) as CollaboratorSerialized;
    if (currFolderOwner) {
      await handleChangeCurrentFolderOwnerCollaboratorToEditor(currFolderOwner.folderId, currFolderOwner.userId);
      await handleChangeSelectedCollaboratorToOwner(folderId, collaboratorId);
      await handleTransferFolderOwnerUserId(folderId, collaboratorId);
    }
  } catch (error) {
    console.error("error when Transfer Folder Owner: ", error instanceof Error ? error.message : "an unknown error occurred");
  }
};

export default handleTransferCollaboratorFolderOwner;

// helper function
const handleTransferFolderOwnerUserId = async (folderId: string, newOwnerUserId: string) => {
  const folderDocRef = doc(db, "folders", folderId);
  await updateDoc(folderDocRef, { owner_user_id: newOwnerUserId, updated_at: serverTimestamp() });
};

const handleGetFolderCollaboratorOwner = async (folderId: string): Promise<DocumentData | undefined> => {
  const collaboratorsCollaection = collection(db, "collaborators");
  const collaboratorQuery = query(collaboratorsCollaection, where("folderId", "==", folderId), where("role", "==", "owner"));
  const currFolderOwner = await getDocs(collaboratorQuery);
  if (!currFolderOwner.empty) return currFolderOwner.docs[0].data();
};

const handleChangeCurrentFolderOwnerCollaboratorToEditor = async (folderId: string, collaboratorId: string) => {
  const collaboratorDocRef = doc(db, "collaborators", `${folderId}_${collaboratorId}`);
  await updateDoc(collaboratorDocRef, { role: "editor" as CollaboratorRole, updateAt: serverTimestamp() });
};

const handleChangeSelectedCollaboratorToOwner = async (folderId: string, collaboratorId: string) => {
  const collaboratorDocRef = doc(db, "collaborators", `${folderId}_${collaboratorId}`);
  await updateDoc(collaboratorDocRef, { role: "owner" as CollaboratorRole, updateAt: serverTimestamp() });
};
