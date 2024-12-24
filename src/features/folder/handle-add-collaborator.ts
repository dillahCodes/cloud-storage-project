import { db } from "@/firebase/firebase-serices";
import { Collaborator } from "./folder-collaborator";
import { doc, setDoc } from "firebase/firestore";

const handleAddCollabortaror = async (params: Collaborator) => {
  const collaboratorDoc = doc(db, "collaborators", `${params.folderId}_${params.userId}`);
  await setDoc(collaboratorDoc, params);
};

export default handleAddCollabortaror;
