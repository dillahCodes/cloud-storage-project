import { useCallback } from "react";
import { DeleteFolderActivity } from "../folder-activity";
import { auth, db } from "@/firebase/firebase-services";
import { doc, setDoc } from "firebase/firestore";

const useAddActivityDeletedFolder = () => {
  const handleAddActivityDeletedFolder = useCallback(async (params: DeleteFolderActivity) => {
    const { currentUser } = auth;
    const payload: DeleteFolderActivity = params;

    try {
      if (!currentUser) return;

      const activityDocRef = doc(db, "folderActivities", payload.activityId);
      await setDoc(activityDocRef, payload);
    } catch (error) {
      console.error("Error adding activity deleted folder:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, []);

  return { handleAddActivityDeletedFolder };
};

export default useAddActivityDeletedFolder;
