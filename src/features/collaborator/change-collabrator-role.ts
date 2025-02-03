import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase-services";
import { CollaboratorRole } from "../collaborator/collaborator";

interface ChangeCollaboratorRoleProps {
  folderId: string;
  collaboratorId: string;
  role: CollaboratorRole;
}
const handleChangeCollaboratorRole = async ({ folderId, collaboratorId, role }: ChangeCollaboratorRoleProps) => {
  try {
    const docRef = doc(db, "collaborators", `${folderId}_${collaboratorId}`);
    await updateDoc(docRef, { role, updateAt: serverTimestamp() });
  } catch (error) {
    console.error("Error changing collaborator role:", error instanceof Error ? error.message : "An unknown error occurred.");
  }
};

export default handleChangeCollaboratorRole;
