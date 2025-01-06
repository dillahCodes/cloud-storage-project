import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { setParentFolderStatus } from "@/features/folder/slice/parent-folder-slice";
import { db } from "@/firebase/firebase-services";
import { collection, DocumentData, getDocs, query, QueryDocumentSnapshot, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setMoveParentFolderData } from "../slice/move-folders-and-files-data-slice";
import { mobileMoveSelector } from "../slice/mobile-move-slice";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { message } from "antd";

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

/**
 * get params
 */
const params = ["parentId"] as const;
const parseParam = (key: string, getSearchParams: URLSearchParams) => {
  const value = getSearchParams.get(key);
  return value === "null" || value === "" ? null : value;
};

const useGetParentFolderData = () => {
  const [isInValidParentFolder, setIsInValidParentFolder] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isMobileDevice } = useGetClientScreenWidth();
  const { moveFromLocationPath } = useSelector(mobileMoveSelector);

  const { "0": searchParams } = useSearchParams();
  const [parentId] = params.map((key) => parseParam(key, searchParams));

  const handleFetch = useCallback(async () => {
    try {
      dispatch(setParentFolderStatus("loading"));
      if (!parentId) {
        dispatch(setMoveParentFolderData(null));
        dispatch(setParentFolderStatus("succeeded"));
        return;
      }

      const parentFolderDataSnapshot = await handleGetParentFolderId(parentId);
      if (!parentFolderDataSnapshot) {
        setIsInValidParentFolder(true);
        dispatch(setMoveParentFolderData(null));
        dispatch(setParentFolderStatus("succeeded"));
        return;
      }

      const parentFolderData = parentFolderDataSnapshot[0];

      parentFolderData.parent_folder_id
        ? dispatch(setMoveParentFolderData(parentFolderData as SubFolderGetData))
        : dispatch(setMoveParentFolderData(parentFolderData as RootFolderGetData));

      dispatch(setParentFolderStatus("succeeded"));
    } catch (error) {
      console.error("Error fetching parent folder data:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [parentId, dispatch]);

  useEffect(() => {
    if (!isInValidParentFolder || !moveFromLocationPath) return;

    if (isMobileDevice) navigate(moveFromLocationPath);

    message.open({
      type: "error",
      content: "Parent folder not found.",
      className: "font-archivo text-sm",
    });
  }, [isMobileDevice, moveFromLocationPath, navigate, isInValidParentFolder]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);
};

export default useGetParentFolderData;
