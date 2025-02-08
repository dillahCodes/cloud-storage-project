import { useDispatch, useSelector } from "react-redux";
import { dekstopMoveSelector } from "../slice/dekstop-move-slice";
import useUser from "@/features/auth/hooks/use-user";
import { useCallback, useEffect } from "react";
import { setMoveFilesData, setMoveFileStatus } from "../slice/move-folders-and-files-data-slice";
import { collection, getDocs, orderBy, query, Query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase-services";
import { RootFileGetData, SubFileGetData } from "@/features/file/file";

const handleFilteredDataFile = (file: RootFileGetData | SubFileGetData): RootFileGetData | SubFileGetData => {
  if (file.parent_folder_id) {
    return {
      ...file,
      updated_at: JSON.parse(JSON.stringify(file.updated_at)),
      created_at: JSON.parse(JSON.stringify(file.created_at)),
    } as SubFileGetData;
  }

  return {
    ...file,
    parent_folder_id: null,
    updated_at: JSON.parse(JSON.stringify(file.updated_at)),
    created_at: JSON.parse(JSON.stringify(file.created_at)),
  } as RootFileGetData;
};

const buildQuery = (parentFolderId: string | null, userId: string): Query => {
  const filesRef = collection(db, "files");
  const isRoot = !parentFolderId;

  return isRoot
    ? query(filesRef, where("parent_folder_id", "==", null), where("owner_user_id", "==", userId), orderBy("created_at", "desc"))
    : query(filesRef, where("parent_folder_id", "==", parentFolderId), orderBy("created_at", "desc"));
};

const handleGetFilesData = async (parentFolderId: string | null, userId: string) => {
  const q = buildQuery(parentFolderId, userId);
  const fileSnapshot = await getDocs(q);
  return fileSnapshot.empty
    ? null
    : fileSnapshot.docs.map((doc) => handleFilteredDataFile(doc.data() as RootFileGetData | SubFileGetData));
};

interface UseGetFilesDekstopMoveFolderOrFileParams {
  shouldFetch: boolean;
}
const useGetFilesDekstopMoveFolderOrFile = ({ shouldFetch }: UseGetFilesDekstopMoveFolderOrFileParams) => {
  const dispatch = useDispatch();
  const { parentFolderId } = useSelector(dekstopMoveSelector);
  const { user } = useUser();

  const fetchFilesData = useCallback(async () => {
    if (!user) return;

    try {
      dispatch(setMoveFileStatus("loading"));

      const filesData = await handleGetFilesData(parentFolderId, user.uid);
      parentFolderId
        ? dispatch(setMoveFilesData(filesData as SubFileGetData[]))
        : dispatch(setMoveFilesData(filesData as RootFileGetData[]));

      dispatch(setMoveFileStatus("succeeded"));
    } catch (error) {
      dispatch(setMoveFileStatus("failed"));
      console.error("Error fetching file data:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [parentFolderId, user, dispatch]);

  useEffect(() => {
    shouldFetch && fetchFilesData();
  }, [fetchFilesData, shouldFetch]);
};

export default useGetFilesDekstopMoveFolderOrFile;
