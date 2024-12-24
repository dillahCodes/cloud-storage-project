import { auth, db } from "@/firebase/firebase-serices";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef } from "react";
import { SharedWithMeData } from "../folder";

interface UseAddSharedWithMeFolderDataProps {
  shouldAdd: boolean;
  sharedFolderId: string;
}

const useAddSharedWithMeFolderData = ({ shouldAdd, sharedFolderId }: UseAddSharedWithMeFolderDataProps) => {
  const sharedFolderIdRef = useRef<string | null>(null); // using ref for disable value change in re-render

  // set initial parent folder id using ref for disable value change in re-render
  useEffect(() => {
    if (sharedFolderIdRef.current === null && sharedFolderId) sharedFolderIdRef.current = sharedFolderId;
  }, [sharedFolderId]);

  const handleCheckIfSharedFolderIsNotExist = useCallback(async () => {
    const { currentUser } = auth;
    if (!sharedFolderIdRef.current || !currentUser) return;

    const sharedWithMeFolderRef = doc(db, "sharedWithMeFolders", `${currentUser.uid}_${sharedFolderIdRef.current}`);
    const result = await getDoc(sharedWithMeFolderRef);
    return !result.exists();
  }, [sharedFolderIdRef]);

  const handleAddSharedWithMeFolderData = useCallback(async () => {
    const { currentUser } = auth;
    try {
      if (!currentUser || !sharedFolderIdRef.current) return;

      const sharedWithMeFolderData: SharedWithMeData = {
        folderId: sharedFolderIdRef.current,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: null,
      };

      const isDataNotExist = await handleCheckIfSharedFolderIsNotExist();
      if (!isDataNotExist) return;

      const sharedWithMeFolderRef = doc(db, "sharedWithMeFolders", `${currentUser.uid}_${sharedFolderIdRef.current}`);
      await setDoc(sharedWithMeFolderRef, sharedWithMeFolderData);
    } catch (error) {
      console.error("Error adding shared with me folder data:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [, handleCheckIfSharedFolderIsNotExist]);

  useEffect(() => {
    if (shouldAdd) handleAddSharedWithMeFolderData();
  }, [shouldAdd, handleAddSharedWithMeFolderData]);
};

export default useAddSharedWithMeFolderData;
