import { FirebaseUserData } from "@/features/auth/auth";
import useUser from "@/features/auth/hooks/use-user";
import { db } from "@/firebase/firebase-services";
import { collection, doc, getDocs, limit, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { SharedWithMeData, SubFolderGetData } from "../folder";
import { parentFolderSelector } from "../slice/parent-folder-slice";

interface UseAddSharedWithMeFolderDataProps {
  shouldAdd: boolean;
}

interface HandleAddSharedWithMeFolderData {
  parentFolderData: SubFolderGetData;
  userData: FirebaseUserData;
}

const handleAddSharedWithMeFolderData = async ({ parentFolderData, userData }: HandleAddSharedWithMeFolderData) => {
  const sharedWithMeFolderRef = doc(db, "sharedWithMeFolders", `${userData.uid}_${parentFolderData.folder_id}`);
  const sharedWithMeFolderData: SharedWithMeData = {
    folderId: parentFolderData.folder_id,
    userId: userData.uid,
    rootFolderId: parentFolderData.root_folder_id,
    createdAt: serverTimestamp(),
    updatedAt: null,
  };
  await setDoc(sharedWithMeFolderRef, sharedWithMeFolderData);
};

const handleCheckIsSharedWithMeFolderDataExist = async ({ parentFolderData, userData }: HandleAddSharedWithMeFolderData): Promise<boolean> => {
  const sharedWithMeFolderCollection = collection(db, "sharedWithMeFolders");

  // Define query to find shared folder data matching rootFolderId and userId
  const sharedWithMeFolderQuery = query(
    sharedWithMeFolderCollection,
    where("rootFolderId", "==", parentFolderData.root_folder_id),
    where("userId", "==", userData.uid),
    limit(1)
  );

  // Execute query and check if results exist
  const sharedWithMeFolderSnapshot = await getDocs(sharedWithMeFolderQuery);
  return sharedWithMeFolderSnapshot.size > 0;
};

const useAddSharedWithMeFolderData = ({ shouldAdd }: UseAddSharedWithMeFolderDataProps) => {
  const { parentFolderData, status } = useSelector(parentFolderSelector);
  const { user } = useUser();

  const handleConfirmAddSharedWithMeData = useCallback(async () => {
    try {
      /**
       * Invalid add shared with me folder data
       */
      const isInvalidAddSharedWithMeFolder = !parentFolderData || !user || status !== "succeeded";
      if (isInvalidAddSharedWithMeFolder) return;

      /**
       * return if shared folder exists
       */
      const isSharedFolderExists = await handleCheckIsSharedWithMeFolderDataExist({ parentFolderData, userData: user });
      if (isSharedFolderExists) return;

      /**
       * add shared folder data
       */
      await handleAddSharedWithMeFolderData({ parentFolderData, userData: user });
    } catch (error) {
      console.error("Error adding shared with me folder data:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [parentFolderData, status, user]);

  useEffect(() => {
    if (shouldAdd) handleConfirmAddSharedWithMeData();
  }, [shouldAdd, handleConfirmAddSharedWithMeData]);
};

export default useAddSharedWithMeFolderData;
