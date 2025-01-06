import { auth, db } from "@/firebase/firebase-services";
import { doc, setDoc } from "firebase/firestore";
import { useCallback } from "react";
import { CreateFolderActivity } from "../folder-activity";

const useAddActivityCreatedFolder = () => {
  const handleAddActivityCreatedFolder = useCallback(async (params: CreateFolderActivity) => {
    const { currentUser } = auth;

    if (!currentUser) return;
    const payload: CreateFolderActivity = params;

    try {
      const activityDocRef = doc(db, "folderActivities", payload.activityId);
      await setDoc(activityDocRef, payload);
    } catch (error) {
      console.error("error while adding activity created folder: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  }, []);

  return { handleAddActivityCreatedFolder };
};

export default useAddActivityCreatedFolder;
