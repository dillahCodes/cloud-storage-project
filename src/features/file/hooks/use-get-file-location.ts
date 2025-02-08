import useUser from "@/features/auth/hooks/use-user";
import { SubFolderGetData } from "@/features/folder/folder";
import { db } from "@/firebase/firebase-services";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { RootFileGetData, SubFileGetData } from "../file";

interface FileLocationData {
  labelButton: "my storage" | string;
  path: string;
  icon: "storage" | "folder";
}

interface UseGetFileLocation {
  fileData: SubFileGetData | RootFileGetData | null;
}
const useGetFileLoaction = ({ fileData }: UseGetFileLocation) => {
  const { user } = useUser();
  const [fileLocationData, setFileLocationData] = useState<FileLocationData>({
    labelButton: "my storage",
    path: "/storage/my-storage",
    icon: "storage",
  });

  const handleGetParentFolder = useCallback(async () => {
    try {
      if (!fileData || !fileData.parent_folder_id) return;

      const folderDocRef = doc(db, "folders", fileData.parent_folder_id);
      const folderSnapshot = await getDoc(folderDocRef);
      return folderSnapshot.exists() ? folderSnapshot.data() : null;
    } catch (error) {
      console.error("error while getting parent folder: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  }, [fileData]);

  const handleSetSubFileLocation = useCallback(async () => {
    if (!fileData || !user) return;

    const isRootFolderIsMine = fileData.root_folder_user_id === user.uid;
    const parentFolderData = await handleGetParentFolder();
    const parentFolderDataSerialized = parentFolderData
      ? (JSON.parse(JSON.stringify(parentFolderData)) as SubFolderGetData)
      : null;
    if (!parentFolderDataSerialized) return;

    setFileLocationData({
      labelButton: parentFolderDataSerialized.folder_name,
      path: `/storage/folders/${parentFolderDataSerialized.folder_id}?st=${isRootFolderIsMine ? "my-storage" : "shared-with-me"}`,
      icon: "folder",
    });
  }, [fileData, user, handleGetParentFolder]);

  const handleSetRootFileLocation = useCallback(() => {
    setFileLocationData({
      labelButton: "my storage",
      path: "/storage/my-storage",
      icon: "storage",
    });
  }, []);

  useEffect(() => {
    if (!fileData) return;
    !fileData.parent_folder_id ? handleSetRootFileLocation() : handleSetSubFileLocation();
  }, [fileData, handleSetRootFileLocation, handleSetSubFileLocation]);

  return { fileLocationData };
};

export default useGetFileLoaction;
