import { db } from "@/firebase/firebase-services";
import { doc, setDoc } from "firebase/firestore";
import { Collaborator } from "./collaborator";

const handleAddCollabortaror = async (params: Collaborator) => {
  const collaboratorDoc = doc(db, "collaborators", `${params.folderId}_${params.userId}`);
  await setDoc(collaboratorDoc, params);
};

export default handleAddCollabortaror;
