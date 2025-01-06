import { auth, db } from "@/firebase/firebase-services";
import { RenameFolderActivity } from "../folder-activity";
import { doc, setDoc } from "firebase/firestore";

const useAddActivityRenamedFolder = () => {
  const handleAddActivityRenamedFolder = async (params: RenameFolderActivity) => {
    const {
      renamedFolderId,
      renamedFolderName,
      activityId,
      activityByUserId,
      activityDate,
      type,
      folderId,
      folderName,
      parentFolderId,
      parentFolderName,
      rootFolderId,
      rootFolderOwnerUserId,
    } = params;
    const { currentUser } = auth;

    if (!currentUser) return;

    const payload: RenameFolderActivity = {
      type,
      activityId,

      rootFolderId,
      rootFolderOwnerUserId,

      parentFolderId,
      parentFolderName,

      folderId,
      folderName,

      renamedFolderId,
      renamedFolderName,

      activityByUserId,
      activityDate,
    };

    try {
      const activityDocRef = doc(db, "folderActivities", payload.activityId);
      await setDoc(activityDocRef, payload);
    } catch (error) {
      console.error("error while adding activity renamed folder: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  };

  return { handleAddActivityRenamedFolder };
};
export default useAddActivityRenamedFolder;
