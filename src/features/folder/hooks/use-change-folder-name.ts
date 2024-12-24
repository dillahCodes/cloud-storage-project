import { auth, db } from "@/firebase/firebase-serices";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { RootFolderGetData, SubFolderGetData } from "../folder";

const useChangeFolderName = (folderData: RootFolderGetData | SubFolderGetData) => {
  const [newFolderNameValue, setNewFolderNameValue] = useState<string>(folderData.folder_name || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setNewFolderNameValue(inputValue);
  };

  const handleConfirmChangeFolderName = async () => {
    setIsLoading(true);

    const { currentUser } = auth;

    try {
      if (!currentUser) return;
      const folderRef = doc(db, "folders", folderData.folder_id);

      await updateDoc(folderRef, { folder_name: newFolderNameValue, updated_at: serverTimestamp(), updated_by: currentUser.uid });
    } catch (error) {
      console.error("Error updating folder name:", error);
    }
  };

  return {
    newFolderNameValue,
    isLoading,
    handleInputChange,
    handleConfirmChangeFolderName,
  };
};

export default useChangeFolderName;
