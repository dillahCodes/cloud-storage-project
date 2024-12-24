import { doc, DocumentData, DocumentReference, serverTimestamp, updateDoc } from "firebase/firestore";
import { GeneralAccessRole } from "./folder-collaborator";
import { db } from "@/firebase/firebase-serices";

interface HandleChangeGeneralAccessRole {
  folderId: string;
  role: GeneralAccessRole;
}

const handleChangeGeneralAccessRole = async ({ folderId, role }: HandleChangeGeneralAccessRole) => {
  try {
    const generalAccessDocRef: DocumentReference<DocumentData, DocumentData> = doc(db, "generalAccess", folderId);
    await updateDoc(generalAccessDocRef, { role, updateAt: serverTimestamp() });
  } catch (error) {
    console.error("Error changing general access role:", error instanceof Error ? error.message : "An unknown error occurred.");
  }
};
export default handleChangeGeneralAccessRole;
