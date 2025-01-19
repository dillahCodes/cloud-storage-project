import { useDispatch, useSelector } from "react-redux";
import { dekstopMoveSelector } from "../slice/dekstop-move-slice";
import { collection, DocumentData, getDocs, orderBy, query, Query, QueryDocumentSnapshot, where } from "firebase/firestore";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { auth, db } from "@/firebase/firebase-services";
import { useCallback, useEffect } from "react";
import { setMoveFoldersData, setMoveFolderStatus } from "../slice/move-folders-and-files-data-slice";

interface UseGetFodlersDektopMoveFolderOrFileProps {
  shouldFetch: boolean;
}

/**
 * serialize - serialize timestamps data for redux toolkit
 **/
const handleSerializeFoldersData = (
  data: QueryDocumentSnapshot<DocumentData, DocumentData>,
  isRoot: boolean
): RootFolderGetData | SubFolderGetData => {
  const folderDataSerialized = {
    ...data.data(),
    created_at: JSON.parse(JSON.stringify(data.data().created_at)),
    updated_at: data.data().updated_at ? JSON.parse(JSON.stringify(data.data().updated_at)) : null,
  };

  return isRoot ? (folderDataSerialized as RootFolderGetData) : (folderDataSerialized as SubFolderGetData);
};

/**
 * Build the query based on the parent_folder_id and isRoot
 */
const buildQuery = (isRoot: boolean, parent_folder_id: string | null): Query<DocumentData> => {
  const { currentUser } = auth;
  const foldersRef = collection(db, "folders");

  const isSubFolder = !isRoot && parent_folder_id;

  return isSubFolder
    ? query(foldersRef, where("parent_folder_id", "==", parent_folder_id), orderBy("created_at", "desc"))
    : query(foldersRef, where("parent_folder_id", "==", null), where("owner_user_id", "==", currentUser?.uid), orderBy("created_at", "desc"));
};

/**
 * handle get folder data
 */
const handleGetFodlerData = async (parentId: string | null) => {
  const isRoot = !parentId;

  const q = buildQuery(isRoot, parentId ?? null);
  const folderSnapshot = await getDocs(q);
  return folderSnapshot.empty ? null : folderSnapshot.docs.map((doc) => handleSerializeFoldersData(doc, isRoot));
};

const useGetFodlersDektopMoveFolderOrFile = ({ shouldFetch }: UseGetFodlersDektopMoveFolderOrFileProps) => {
  const dispatch = useDispatch();
  const { parentFolderId } = useSelector(dekstopMoveSelector);

  // console.log({ parentFolderId });

  const fetchFoldersData = useCallback(
    async (parentFolderId: string | null) => {
      try {
        dispatch(setMoveFolderStatus("loading"));
        const folderDataSnapshot = await handleGetFodlerData(parentFolderId);
        parentFolderId
          ? dispatch(setMoveFoldersData(folderDataSnapshot as SubFolderGetData[]))
          : dispatch(setMoveFoldersData(folderDataSnapshot as RootFolderGetData[]));

        dispatch(setMoveFolderStatus("succeeded"));
      } catch (error) {
        dispatch(setMoveFolderStatus("failed"));
        console.error("Error fetching folders data:", error instanceof Error ? error.message : "An unknown error occurred.");
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (shouldFetch) fetchFoldersData(parentFolderId);
  }, [fetchFoldersData, parentFolderId, shouldFetch]);
};
export default useGetFodlersDektopMoveFolderOrFile;
