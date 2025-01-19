import { db, storage } from "@/firebase/firebase-services";
import { message } from "antd";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fileOptionsSelector, setActiveAction } from "../slice/file-options-slice";
import useDetectLocation from "@/hooks/use-detect-location";
import useUser from "@/features/auth/hooks/use-user";

const handleDeleteFile = async (activeFileData: RootFileGetData | SubFileGetData) => {
  const fileDocRef = doc(db, "files", activeFileData.file_id);
  const fileStorageRef = ref(storage, `user-files/${activeFileData.file_id}/${activeFileData.file_name}`);
  await Promise.all([deleteDoc(fileDocRef), deleteObject(fileStorageRef)]);
};

const handleDeleteRecentFile = async (activeFileData: RootFileGetData | SubFileGetData, userId: string) => {
  const recentFilesRef = doc(db, "recent-files", `${userId}_${activeFileData.file_id}`);
  await deleteDoc(recentFilesRef);
};

const useHandleDeleteFile = () => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { activeFileData } = useSelector(fileOptionsSelector);
  const { isRecentlyViewedLocation } = useDetectLocation();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCancel = () => dispatch(setActiveAction(null));
  const handleConfirm = useCallback(async () => {
    if (!activeFileData || !user) return;

    try {
      setIsLoading(true);
      isRecentlyViewedLocation ? await handleDeleteRecentFile(activeFileData, user.uid) : await handleDeleteFile(activeFileData);

      message.open({
        type: "success",
        content: "File deleted successfully.",
        className: "font-archivo text-sm",
        key: "file-delete-success",
        onClose: () => isRecentlyViewedLocation && window.location.reload(),
      });

      setIsLoading(false);
      dispatch(setActiveAction(null));
    } catch (error) {
      console.error("Error deleting file:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [activeFileData, dispatch, isRecentlyViewedLocation, user]);

  return { handleCancel, handleConfirm, isLoading };
};

export default useHandleDeleteFile;
