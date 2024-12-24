import { useCallback, useEffect, useState } from "react";
import { RootFolderGetData, SubFolderGetData } from "../folder";
import { db } from "@/firebase/firebase-serices";
import { doc, getDoc } from "firebase/firestore";

const useGetFolderById = (folderId: string | null | undefined) => {
  const [folderData, setFolderData] = useState<RootFolderGetData | SubFolderGetData | null>(null);
  const [status, setStatus] = useState<"loading" | "succeeded" | "failed" | "idle">("idle");

  const handleFetchFolderId = useCallback(async (currentFolderId: string) => {
    try {
      setStatus("loading");

      const folderRef = doc(db, "folders", currentFolderId);
      const folderSnapshot = await getDoc(folderRef);
      const folderData = folderSnapshot.data() as RootFolderGetData | SubFolderGetData;

      const filteredFolderData: RootFolderGetData | SubFolderGetData = {
        ...folderData,
        created_at: JSON.parse(JSON.stringify(folderData.created_at)),
        updated_at: JSON.parse(JSON.stringify(folderData.updated_at)),
      };

      setFolderData(filteredFolderData);
      setStatus("succeeded");
    } catch (error) {
      console.error("Error fetching folder data:", error instanceof Error ? error.message : "An unknown error occurred.");
      setStatus("failed");
    }
  }, []);

  useEffect(() => {
    if (folderId && folderId.trim() !== "") {
      handleFetchFolderId(folderId);
    } else {
      setFolderData(null);
      setStatus("idle");
    }
  }, [folderId, handleFetchFolderId]);

  return { folderData, status };
};

export default useGetFolderById;
