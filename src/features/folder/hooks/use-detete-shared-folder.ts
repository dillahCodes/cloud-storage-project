import { auth, db } from "@/firebase/firebase-serices";
import { collection, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect } from "react";

interface UseDeleteSharedFolderProps {
  parentFolderId: string | undefined;
  shouldFetch: boolean;
}
const useDeleteSharedFolder = ({ parentFolderId, shouldFetch }: UseDeleteSharedFolderProps) => {
  const handleDeleteSharedFolder = useCallback(async () => {
    const { currentUser } = auth;

    if (!currentUser || !parentFolderId) return;

    try {
      const sharedWithMeFoldersCollection = collection(db, "sharedWithMeFolders");
      const sharedFolderQuery = query(sharedWithMeFoldersCollection, where("folderId", "==", parentFolderId));
      const sharedFolderSnapshot = await getDocs(sharedFolderQuery);

      if (sharedFolderSnapshot.empty) return;

      const promises = sharedFolderSnapshot.docs.map(async (doc) => deleteDoc(doc.ref));
      await Promise.all(promises);
    } catch (error) {
      console.error("error while delete sharedFolder: ", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [parentFolderId]);

  useEffect(() => {
    if (!parentFolderId || !shouldFetch) return;
    handleDeleteSharedFolder();
  }, [handleDeleteSharedFolder, parentFolderId, shouldFetch]);
};

export default useDeleteSharedFolder;
