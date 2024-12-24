import { db } from "@/firebase/firebase-serices";
import { doc, DocumentData, DocumentSnapshot, getDoc } from "firebase/firestore";
import { RootFolderGetData, SubFolderGetData } from "../folder";
import { useCallback } from "react";

const useFetchFolderData = (folderId: string | undefined) => {
  const handleSerializeData = useCallback((data: DocumentSnapshot<DocumentData, DocumentData>) => {
    if (!data.exists()) return null;

    const dataReturn = {
      ...data.data(),
      created_at: JSON.parse(JSON.stringify(data.data().created_at)),
      updated_at: data.data().updated_at ? JSON.parse(JSON.stringify(data.data().updated_at)) : null,
    };

    return dataReturn as SubFolderGetData | RootFolderGetData;
  }, []);

  const fetchFolderData = useCallback(async () => {
    if (!folderId) return null;
    const folderRef = doc(db, "folders", folderId);
    const snapshot = await getDoc(folderRef);
    return snapshot.exists() ? handleSerializeData(snapshot) : null;
  }, [folderId, handleSerializeData]);

  return { fetchFolderData };
};

export default useFetchFolderData;
