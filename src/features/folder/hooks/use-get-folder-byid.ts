import { useCallback, useEffect, useMemo, useState } from "react";
import { RootFolderGetData, SubFolderGetData } from "../folder";
import { db } from "@/firebase/firebase-services";
import { doc, getDoc } from "firebase/firestore";

const useGetFolderById = (folderId: string | null | undefined) => {
  const [folderData, setFolderData] = useState<RootFolderGetData | SubFolderGetData | null>(null);
  const [status, setStatus] = useState<"loading" | "succeeded" | "failed" | "idle">("idle");

  const isValidFolderId = useMemo(() => folderId && folderId.trim() !== "", [folderId]);

  const handleFetchFolderId = useCallback(async (currentFolderId: string) => {
    try {
      setStatus("loading");
      const folderRef = doc(db, "folders", currentFolderId);
      const folderSnapshot = await getDoc(folderRef);

      /**
       * not found condition
       */
      if (!folderSnapshot.exists()) {
        setFolderData(null);
        setStatus("succeeded");
        return;
      }

      /**
       * success condition
       */
      const folderData = JSON.parse(JSON.stringify(folderSnapshot.data())) as RootFolderGetData | SubFolderGetData;
      setFolderData(folderData);
      setStatus("succeeded");
    } catch (error) {
      console.error("Error fetching folder data:", error instanceof Error ? error.message : "An unknown error occurred.");
      setStatus("failed");
    }
  }, []);

  useEffect(() => {
    if (isValidFolderId) {
      handleFetchFolderId(folderId!);
    } else {
      setFolderData(null);
      setStatus("idle");
    }
  }, [folderId, handleFetchFolderId, isValidFolderId]);

  return { folderData, status };
};

export default useGetFolderById;
