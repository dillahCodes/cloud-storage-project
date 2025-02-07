import { db } from "@/firebase/firebase-services";
import { doc, DocumentData, DocumentReference, serverTimestamp, updateDoc } from "firebase/firestore";
import { GeneralAccess } from "./collaborator";

interface HandleChangeGeneralAcesstype {
  folderId: string;
  type: GeneralAccess;
}

const handleChangeGeneralAccessType = async ({ folderId, type }: HandleChangeGeneralAcesstype): Promise<void> => {
  try {
    const generalAccessDocRef: DocumentReference<DocumentData, DocumentData> = doc(db, "generalAccess", folderId);
    await updateDoc(generalAccessDocRef, { type, updateAt: serverTimestamp() });
  } catch (error) {
    console.error("Error changing general access type:", error instanceof Error ? error.message : "An unknown error occurred.");
  }
};

export default handleChangeGeneralAccessType;
