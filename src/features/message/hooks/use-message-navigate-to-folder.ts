import useUser from "@/features/auth/hooks/use-user";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { db } from "@/firebase/firebase-services";
import { message } from "antd";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface UseMessageNavigateToFolderProps {
  folderId: string;
}

/**
 * Fetches a folder by its ID from the database.
 *
 * @param {string} folderId - The ID of the folder to fetch.
 * @returns {Promise<RootFolderGetData | SubFolderGetData | null>} A promise that resolves to the folder data,
 * or null if the folder does not exist.
 */

const handleGetFolderById = async (folderId: string): Promise<RootFolderGetData | SubFolderGetData | null> => {
  const folderDoc = doc(db, "folders", folderId);
  const folderSnapshot = await getDoc(folderDoc);
  return folderSnapshot.exists() ? (folderSnapshot.data() as SubFolderGetData | RootFolderGetData) : null;
};

interface handleValidateBeforeNavigateParams {
  folderId: string;
  user: FirebaseUserData | null;
  folderData: RootFolderGetData | SubFolderGetData | null;
}
const handleValidateBeforeNavigate = async ({ folderId, user, folderData }: handleValidateBeforeNavigateParams) => {
  const conditions = [
    { condition: !user, message: "Something went wrong. Please refresh page" },
    { condition: !folderId || folderId.trim() === "", message: "Folder ID cannot be empty." },
    { condition: !folderData, message: "Folder not found." },
  ];

  const firstValidation = conditions.find((condition) => condition.condition);
  if (firstValidation) {
    message.destroy("message-navigate-folder-loading");
    message.open({
      type: "error",
      content: firstValidation.message,
      className: "font-archivo text-sm rounded-sm",
      key: "message-navigate-folder-error",
    });
    setTimeout(() => message.destroy("message-navigate-folder-error"), 1000);
    return false;
  }
  return true;
};

const useMessageNavigateToFolder = ({ folderId }: UseMessageNavigateToFolderProps) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleNavigateToFolder = async () => {
    try {
      message.open({
        type: "loading",
        content: "Navigating to folder...",
        className: "font-archivo text-sm",
        key: "message-navigate-folder-loading",
      });

      // validate before navigate to folder
      const folderData = await handleGetFolderById(folderId);
      const isValidateBeforeNavigate = await handleValidateBeforeNavigate({ folderId, user, folderData });
      if (!isValidateBeforeNavigate) return;

      // navigate to folder
      const isRootFolderMine = folderData!.root_folder_user_id === user!.uid;
      const createParams = isRootFolderMine ? "my-storage" : "shared-with-me";
      navigate(`/storage/folders/${folderId}?st=${createParams}`);
    } catch (error) {
      console.error("Error navigating to folder:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  };

  return { handleNavigateToFolder };
};

export default useMessageNavigateToFolder;
