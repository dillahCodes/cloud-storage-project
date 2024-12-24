import { db } from "@/firebase/firebase-serices";
import { doc, getDoc } from "firebase/firestore";
import { SubFolderGetData } from "./folder";

const getFolderById = async (id: string) => {
  try {
    const folderRef = doc(db, "folders", id);
    const folderSnapshot = await getDoc(folderRef);
    return folderSnapshot.data() as SubFolderGetData;
  } catch (error) {
    console.error("error while gettig folder by id: ", error);
  }
};

export default getFolderById;
