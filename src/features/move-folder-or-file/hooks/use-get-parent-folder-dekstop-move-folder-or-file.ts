import { useDispatch, useSelector } from "react-redux";
import { dekstopMoveSelector } from "../slice/dekstop-move-slice";
import { collection, DocumentData, getDocs, query, QueryDocumentSnapshot, where } from "firebase/firestore";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { db } from "@/firebase/firebase-services";
import { useCallback, useEffect } from "react";
import { setMoveParentFolderData, setMoveParentFolderStatus } from "../slice/move-folders-and-files-data-slice";

interface UseGetParentFolderDataMoveFolderOrFileDekstopProps {
  shouldFetch: boolean;
}

/**
 * serialize - serialize timestamps data for redux toolkit
 **/
const handleSerializeFoldersData = (data: QueryDocumentSnapshot<DocumentData, DocumentData>): RootFolderGetData | SubFolderGetData => {
  const folderDataSerialized = {
    ...data.data(),
    created_at: JSON.parse(JSON.stringify(data.data().created_at)),
    updated_at: data.data().updated_at ? JSON.parse(JSON.stringify(data.data().updated_at)) : null,
  } as RootFolderGetData | SubFolderGetData;

  return folderDataSerialized;
};

/**
 * handle get parentFolderId
 */
const handleGetParentFolderId = async (parentId: string) => {
  const folderCollectionRef = collection(db, "folders");
  const folderQuery = query(folderCollectionRef, where("folder_id", "==", parentId));

  const folderSnapshot = await getDocs(folderQuery);

  return folderSnapshot.empty ? null : folderSnapshot.docs.map(handleSerializeFoldersData);
};

const useGetParentFolderDataMoveFolderOrFileDekstop = ({ shouldFetch }: UseGetParentFolderDataMoveFolderOrFileDekstopProps) => {
  const dispatch = useDispatch();
  const { parentFolderId } = useSelector(dekstopMoveSelector);

  const handleFetchParentFolder = useCallback(async () => {
    try {
      dispatch(setMoveParentFolderStatus("loading"));
      if (!parentFolderId) {
        dispatch(setMoveParentFolderData(null));
        dispatch(setMoveParentFolderStatus("succeeded"));
        return;
      }

      const parentFolderData = await handleGetParentFolderId(parentFolderId);
      if (!parentFolderData) {
        dispatch(setMoveParentFolderData(null));
        dispatch(setMoveParentFolderStatus("succeeded"));
        return;
      }

      dispatch(setMoveParentFolderData(parentFolderData[0] as RootFolderGetData | SubFolderGetData));
      dispatch(setMoveParentFolderStatus("succeeded"));
    } catch (error) {
      dispatch(setMoveParentFolderStatus("failed"));
      console.error("error while getting parent folder: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  }, [dispatch, parentFolderId]);

  useEffect(() => {
    if (shouldFetch) handleFetchParentFolder();
  }, [handleFetchParentFolder, shouldFetch]);
  // if (shouldFetch) console.log("get parent folder with id:", parentFolderId);
};

export default useGetParentFolderDataMoveFolderOrFileDekstop;
