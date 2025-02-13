import useUser from "@/features/auth/hooks/use-user";
import { db, storage } from "@/firebase/firebase-services";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveAction } from "../slice/file-options-slice";
import useSecuredFolderFileActions from "@/features/permissions/hooks/use-secured-folder-file-actions";
import { RootFileGetData, SubFileGetData } from "../file";

interface UseHandleDowloadFile {
  fileData: SubFileGetData | RootFileGetData | null;
}

interface AddRecentFileDataParams {
  fileId: string;
  userId: string;
}

const handleCheckRecentFileDataIsExist = async ({ fileId, userId }: AddRecentFileDataParams) => {
  const recentFilesRef = doc(db, "recent-files", `${userId}_${fileId}`);
  const recentFilesSnap = await getDoc(recentFilesRef);
  return recentFilesSnap.exists();
};

const addRecentFileData = async ({ fileId, userId }: AddRecentFileDataParams) => {
  const isExist = await handleCheckRecentFileDataIsExist({ fileId, userId });
  if (isExist) return;

  const recentFilesRef = doc(db, "recent-files", `${userId}_${fileId}`);
  await setDoc(recentFilesRef, {
    userId,
    fileId,
    createAt: serverTimestamp(),
    updateAt: serverTimestamp(),
  });
};

const useHandleDowloadFile = ({ fileData }: UseHandleDowloadFile) => {
  const dispatch = useDispatch();
  const { user } = useUser();

  const { handleCheckIsUserCanDoThisAction } = useSecuredFolderFileActions();
  const [isDownloadLoading, setIsDownloadLoading] = useState<boolean>(false);

  const handleCancelDowloadFile = useCallback(() => {
    dispatch(setActiveAction(null));
  }, [dispatch]);

  const handleConfirmDownlaodFile = useCallback(async () => {
    if (!fileData || !user) return;
    try {
      const isUserCanDoThisAction = handleCheckIsUserCanDoThisAction("dowload");
      if (!isUserCanDoThisAction) return;

      setIsDownloadLoading(true);
      const fileRef = ref(storage, `user-files/${fileData.file_id}/${fileData.file_name}`);
      const downloadUrl = await getDownloadURL(fileRef);

      await addRecentFileData({ fileId: fileData.file_id, userId: user.uid });

      window.open(downloadUrl, "_blank");

      setIsDownloadLoading(false);
    } catch (error) {
      console.error("Error downloading file:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [fileData, user, handleCheckIsUserCanDoThisAction]);

  return { handleCancelDowloadFile, handleConfirmDownlaodFile, isDownloadLoading };
};
export default useHandleDowloadFile;
