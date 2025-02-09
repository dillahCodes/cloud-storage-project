import { auth, db } from "@/firebase/firebase-services";
import { RootFolderGetData, SubFolderGetData } from "../folder/folder";
import { doc, getDoc } from "firebase/firestore";

interface HandleCheckIsStorageAvailable {
  parentFolderData: RootFolderGetData | SubFolderGetData | null;
  oldRootFolderId: string | null;
}

const handleCheckIsStorageAvailable = async ({
  parentFolderData,
  oldRootFolderId,
}: HandleCheckIsStorageAvailable): Promise<boolean> => {
  const { currentUser } = auth;
  if (!currentUser) return false;

  try {
    // check is same root folder
    const isSameRootFolder = parentFolderData && parentFolderData.root_folder_id === oldRootFolderId;
    if (isSameRootFolder) return true;

    // generate user id, if parentFolderData is null its mean user move to root
    const createUserId = parentFolderData ? parentFolderData.root_folder_user_id : currentUser.uid;

    const userStorageRef = doc(db, "users-storage", createUserId);
    const userStorageSnap = await getDoc(userStorageRef);
    if (!userStorageSnap.exists()) return false;

    // calculate full condition
    const { storageCapacity, storageUsed } = userStorageSnap.data() as StorageData;
    const isNotEnoughSpace = storageUsed >= storageCapacity;
    if (isNotEnoughSpace) return false;

    return true;
  } catch (error) {
    console.error("Error during check is storage available:", error instanceof Error ? error.message : error);
    return false;
  }
};

export default handleCheckIsStorageAvailable;
