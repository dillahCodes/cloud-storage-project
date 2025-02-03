import { auth, db } from "@/firebase/firebase-services";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { RootFolderGetData, SubFolderGetData } from "../folder";
import useAddActivityRenamedFolder from "./use-add-activity-renamed-folder";
import { v4 as uuidv4 } from "uuid";
import { message } from "antd";
import { useSelector } from "react-redux";
import { parentFolderSelector } from "../slice/parent-folder-slice";
import useSecuredFolderFolderActions from "@/features/permissions/hooks/use-secured-folder-folder-actions";

const useChangeFolderName = (folderData: RootFolderGetData | SubFolderGetData) => {
  const { handleAddActivityRenamedFolder } = useAddActivityRenamedFolder();
  const { handleCheckIsUserCanDoThisAction } = useSecuredFolderFolderActions();

  const parentFolderState = useSelector(parentFolderSelector);
  const [newFolderNameValue, setNewFolderNameValue] = useState<string>(folderData.folder_name || "");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setNewFolderNameValue(inputValue);
  };

  const handleConfirmChangeFolderName = async () => {
    const { currentUser } = auth;

    try {
      const isValidateSecuredFolderPass = await handleCheckIsUserCanDoThisAction(folderData.folder_id, "rename");
      if (!isValidateSecuredFolderPass) return;

      message.open({
        type: "loading",
        content: "Updating folder name...",
        className: "font-archivo text-sm",
        duration: 0,
        key: "folder-name-update-loading",
      });

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

      message.destroy("folder-name-update-loading");
      message.open({
        type: "success",
        content: "Folder name updated successfully",
        className: "font-archivo text-sm",
        key: "folder-name-update-success",
      });
      setTimeout(() => message.destroy("folder-name-update-success"), 3000);
    } catch (error) {
      message.open({
        type: "error",
        content: "Please try again",
        className: "font-archivo text-sm",
        key: "folder-name-update-error",
      });
      console.error("Error updating folder name:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  };

  return {
    newFolderNameValue,
    // isLoading,
    handleInputChange,
    handleConfirmChangeFolderName,
  };
};

export default useChangeFolderName;
