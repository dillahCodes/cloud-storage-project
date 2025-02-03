import { db } from "@/firebase/firebase-services";
import useDetectLocation from "@/hooks/use-detect-location";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { message } from "antd";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { mobileMoveSelector } from "../slice/mobile-move-slice";
import { moveFoldersAndFilesDataSelector, setMoveParentFolderData, setMoveParentFolderStatus } from "../slice/move-folders-and-files-data-slice";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";

/**
 * handle get parentFolderId
 */
const handleGetParentFolderId = async (parentId: string) => {
  const folderDoc = doc(db, "folders", parentId);
  const folderSnap = await getDoc(folderDoc);
  return folderSnap.exists() ? (JSON.parse(JSON.stringify(folderSnap.data())) as RootFolderGetData | SubFolderGetData) : null;
};

const useGetParentFolderData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { "0": searchParams } = useSearchParams();

  const { isMoveFolderOrFileLocation, isSubMoveFolderOrFileLocation } = useDetectLocation();
  const { isMobileDevice } = useGetClientScreenWidth();

  const [parentId, setParentId] = useState<string | null>(searchParams.get("parentId") || null);
  const { moveFromLocationPath } = useSelector(mobileMoveSelector);
  const { parentFolderStatus } = useSelector(moveFoldersAndFilesDataSelector);

  const isParentLoading = useMemo(() => parentFolderStatus === "loading", [parentFolderStatus]);

  /**
   * handle get and update parentId
   */
  const handleGetAndUpdateParentId = useCallback(() => {
    const newParentId = searchParams.get("parentId") || null;
    if (newParentId === parentId) return;
    setParentId(newParentId);
  }, [parentId, searchParams]);

  /**
   * handle fetch parent folder
   */
  const handleFetch = useCallback(async () => {
    try {
      dispatch(setMoveParentFolderStatus("loading"));
      if (!parentId) {
        dispatch(setMoveParentFolderData(null));
        dispatch(setMoveParentFolderStatus("succeeded"));
        return;
      }

      const parentFolderDataSnapshot = await handleGetParentFolderId(parentId);
      if (!parentFolderDataSnapshot) {
        dispatch(setMoveParentFolderData(null));
        dispatch(setMoveParentFolderStatus("succeeded"));
        return;
      }

      parentFolderDataSnapshot.parent_folder_id
        ? dispatch(setMoveParentFolderData(parentFolderDataSnapshot as SubFolderGetData))
        : dispatch(setMoveParentFolderData(parentFolderDataSnapshot as RootFolderGetData));

      dispatch(setMoveParentFolderStatus("succeeded"));
    } catch (error) {
      console.error("Error fetching parent folder data:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [parentId, dispatch]);

  /**
   * handle parent folder not found
   */
  useEffect(() => {
    if (!moveFromLocationPath || isParentLoading || isMoveFolderOrFileLocation) return;
    if (isMobileDevice) navigate(moveFromLocationPath);

    message.open({
      type: "error",
      content: "Parent folder not found.",
      className: "font-archivo text-sm",
    });
  }, [isMobileDevice, moveFromLocationPath, navigate, isParentLoading, isMoveFolderOrFileLocation]);

  /**
   * handle fetch in mount
   */
  useEffect(() => {
    handleGetAndUpdateParentId();
  }, [handleGetAndUpdateParentId]);

  useEffect(() => {
    isSubMoveFolderOrFileLocation && handleFetch();
  }, [handleFetch, isSubMoveFolderOrFileLocation]);
};

export default useGetParentFolderData;
