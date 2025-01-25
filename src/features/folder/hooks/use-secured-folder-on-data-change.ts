import { useEffect, useState } from "react";
import { doc, onSnapshot, DocumentReference } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase-services";
import { SecuredFolderStatus, SecurredFolderData } from "../folder";

interface UseSecuredFolderOnDataChange {
  folderId: string;
}

interface SubscribeToSecuredFolderParams {
  setStatus: React.Dispatch<React.SetStateAction<SecuredFolderStatus>>;
  setIsSecuredFolderActive: React.Dispatch<React.SetStateAction<boolean>>;
  folderId: string;
}

/**
 * Helper function to build the query for the secured folder
 */
const buildQuery = (folderId: string): DocumentReference => {
  const { currentUser } = auth;
  if (!currentUser) throw new Error("User is not authenticated.");

  return doc(db, "secured-folder", `${currentUser.uid}_${folderId}`);
};

/**
 * Function to subscribe to the secured folder document
 */
const subscribeToSecuredFolder = ({ setStatus, folderId, setIsSecuredFolderActive }: SubscribeToSecuredFolderParams) => {
  const query = buildQuery(folderId);

  setStatus("loading");

  const unsubscribe = onSnapshot(
    query,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = JSON.parse(JSON.stringify(docSnap.data())) as SecurredFolderData;
        setIsSecuredFolderActive(data.isSecuredFolderActive);
        setStatus("succeded");
      } else {
        setIsSecuredFolderActive(false);
        setStatus("failed");
      }
    },
    (error) => {
      setStatus("failed");
      console.error("Error fetching secured folder data:", error instanceof Error ? error.message : "Unknown error");
    }
  );

  return unsubscribe;
};

/**
 * Main Hook: UseSecuredFolderOnDataChange
 */
const useSecuredFolderOnDataChange = ({ folderId }: UseSecuredFolderOnDataChange) => {
  const [isSecuredFolderActive, setIsSecuredFolderActive] = useState<boolean>(false);
  const [statusFetch, setStatusFetch] = useState<SecuredFolderStatus>("idle");

  useEffect(() => {
    if (!folderId || !auth.currentUser) {
      console.warn("Invalid folder ID or user is not authenticated.");
      return;
    }

    const unsubscribe = subscribeToSecuredFolder({
      folderId,
      setStatus: setStatusFetch,
      setIsSecuredFolderActive,
    });

    return () => unsubscribe();
  }, [folderId]);

  return { isSecuredFolderActive, statusFetch };
};

export default useSecuredFolderOnDataChange;