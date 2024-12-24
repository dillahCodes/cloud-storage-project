import { db } from "@/firebase/firebase-serices";
import { deleteDoc, doc } from "firebase/firestore";

interface HandleRemoveCollaboratorParams {
  folderId: string;
  collaboratorId: string;
}

const handleRemoveCollaborator = async ({ collaboratorId, folderId }: HandleRemoveCollaboratorParams): Promise<void> => {
  try {
    const collaboratorDocRef = doc(db, "collaborators", `${folderId}_${collaboratorId}`);
    await deleteDoc(collaboratorDocRef);
  } catch (error) {
    console.error("error when Remove Collaborator: ", error instanceof Error ? error.message : "an unknown error occurred");
  }
};

export default handleRemoveCollaborator;
