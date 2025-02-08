import useUser from "@/features/auth/hooks/use-user";
import { db } from "@/firebase/firebase-services";
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFiles, setStatus } from "../slice/file-slice";
import { RootFileGetData, SubFileGetData } from "../file";

const handleGetRecentFilesData = async (userId: string) => {
  const recentFilesRef = collection(db, "recent-files");
  const q = query(recentFilesRef, where("userId", "==", userId), orderBy("createAt", "desc"));
  const recentFilesSnap = await getDocs(q);
  return recentFilesSnap.empty ? null : recentFilesSnap.docs.map((doc) => JSON.parse(JSON.stringify(doc.data())));
};

const handleDeleteRecentFileData = async (fileId: string, userId: string) => {
  const recentFilesRef = doc(db, "recent-files", `${userId}_${fileId}`);
  await deleteDoc(recentFilesRef);
};

const handleGetFilesData = async (fileIds: string[], userId: string) => {
  const promises = fileIds.map(async (fileId) => {
    const fileRef = doc(db, "files", fileId);
    const fileSnap = await getDoc(fileRef);

    if (fileSnap.exists()) return JSON.parse(JSON.stringify(fileSnap.data()));

    await handleDeleteRecentFileData(fileId, userId);
    return null;
  });

  const results = await Promise.allSettled(promises);
  return results
    .filter((result) => result.status === "fulfilled" && result.value !== null)
    .map((result) => (result as PromiseFulfilledResult<unknown>).value) as RootFileGetData[] | SubFileGetData[];
};

const useGetRecentFile = () => {
  const dispatch = useDispatch();
  const { user } = useUser();

  const handleGetRecentFiles = useCallback(async () => {
    try {
      dispatch(setStatus("loading"));
      if (!user) {
        dispatch(setStatus("failed"));
        return;
      }

      const recentFiles = await handleGetRecentFilesData(user.uid);
      if (!recentFiles) {
        dispatch(setStatus("failed"));
        return;
      }

      const extractRecentFileIds: string[] = recentFiles.map(({ fileId }) => fileId as string);
      const filesData = await handleGetFilesData(extractRecentFileIds, user.uid);

      dispatch(setFiles(filesData));
      dispatch(setStatus("succeeded"));
    } catch (error) {
      dispatch(setStatus("failed"));
      console.error("Error getting recent files:", error instanceof Error ? error.message : "An unknown error occurred");
    }
  }, [user, dispatch]);

  useEffect(() => {
    user && handleGetRecentFiles();
  }, [user, handleGetRecentFiles]);
};

export default useGetRecentFile;
