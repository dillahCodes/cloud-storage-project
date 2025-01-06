import { useCallback } from "react";
import { CreateFolderActivity } from "../folder-activity";
import { auth, db } from "@/firebase/firebase-services";
import { doc, setDoc } from "firebase/firestore";

const useAddActivityCreatedFile = () => {
  const handleAddActivityCreatedFile = useCallback(async (params: CreateFolderActivity) => {
    const { currentUser } = auth;

    if (!currentUser) return;
    const payload: CreateFolderActivity = params;

    try {
      const activityDocRef = doc(db, "folderActivities", payload.activityId);
      await setDoc(activityDocRef, payload);
    } catch (error) {
      console.error("error while adding activity created file: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  }, []);

  return { handleAddActivityCreatedFile };
};

export default useAddActivityCreatedFile;
