import { auth, db } from "@/firebase/firebase-services";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { RootFolderGetData, SubFolderGetData } from "../folder";
import useAddActivityRenamedFolder from "./use-add-activity-renamed-folder";
import { v4 as uuidv4 } from "uuid";
import useParentFolder from "./use-parent-folder";

const useChangeFolderName = (folderData: RootFolderGetData | SubFolderGetData) => {
  const { handleAddActivityRenamedFolder } = useAddActivityRenamedFolder();

  const { parentFolderState } = useParentFolder({
    fetchParentFolderDataOnMount: false,
    resetParentFolderDataOnMount: false,
    folderId: folderData.folder_id,
  });
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
      await handleAddActivityRenamedFolder({
        type: "rename-folder-activity",
        activityId: uuidv4(),

        parentFolderId: folderData.parent_folder_id,
        parentFolderName: parentFolderState.parentFolderData?.folder_name ?? null,

        rootFolderId: folderData.root_folder_id,
        rootFolderOwnerUserId: folderData.root_folder_user_id,

        folderId: folderData.folder_id,
        folderName: folderData.folder_name,

        renamedFolderId: folderData.folder_id,
        renamedFolderName: newFolderNameValue,

        activityByUserId: currentUser.uid,
        activityDate: serverTimestamp(),
      });
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
