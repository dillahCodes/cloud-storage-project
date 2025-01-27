import { auth, db } from "@/firebase/firebase-services";
import { collection, DocumentData, getDocs, orderBy, Query, query, QueryDocumentSnapshot, where } from "firebase/firestore";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moveFoldersAndFilesDataSelector, setMoveFoldersData, setMoveFolderStatus } from "../slice/move-folders-and-files-data-slice";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";

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

interface UseGetFoldersForMoveFolderOrFileProps {
  shouldFetch: boolean;
}

const useGetFoldersForMoveFolderOrFile = ({ shouldFetch }: UseGetFoldersForMoveFolderOrFileProps) => {
  const dispatch = useDispatch();

  const { parentFolderData, parentFolderStatus } = useSelector(moveFoldersAndFilesDataSelector);
  const parentId = useMemo(() => parentFolderData?.folder_id, [parentFolderData]);
  const isParentLoading = useMemo(() => parentFolderStatus === "loading", [parentFolderStatus]);

  const fetchFolderData = useCallback(
    async (parentFolderId: string | null) => {
      try {
        dispatch(setMoveFolderStatus("loading"));

        const folderDataSnapshot = await handleGetFodlerData(parentFolderId);
        parentId
          ? dispatch(setMoveFoldersData(folderDataSnapshot as SubFolderGetData[]))
          : dispatch(setMoveFoldersData(folderDataSnapshot as RootFolderGetData[]));

        dispatch(setMoveFolderStatus("succeeded"));
      } catch (error) {
        dispatch(setMoveFolderStatus("failed"));
        console.error("Error fetching folder data:", error);
      }
    },
    [dispatch, parentId]
  );

  useEffect(() => {
    if (isParentLoading) return;
    shouldFetch && fetchFolderData(parentId ?? null);
  }, [parentId, fetchFolderData, shouldFetch, isParentLoading]);
};

export default useGetFoldersForMoveFolderOrFile;
