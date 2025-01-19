import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  mobileMoveSelector,
  setMobileMoveFileId,
  setMobileMoveFileName,
  setMobileMoveFileType,
  setMobileMoveFolderId,
  setMobileMoveFolderName,
  setMobileMoveFromLocationPath,
} from "../slice/mobile-move-slice";
import { MobileFolderOrFileMoveLocalStorageKey } from "../move-folder-or-file";

const MOBILE_MOVE_STATE_KEY: MobileFolderOrFileMoveLocalStorageKey = "moveFolderOrFileMobile";

const useGetMoveMobileStateFromLocalStorage = () => {
  const dispatch = useDispatch();
  const { fileId, fileName, folderId, folderName, moveFromLocationPath, fileType } = useSelector(mobileMoveSelector);

  const isStateMissing = useMemo(() => {
    return !fileId && !fileName && !folderId && !folderName && !moveFromLocationPath && !fileType;
  }, [fileId, fileName, folderId, folderName, moveFromLocationPath, fileType]);

  const handleGetFromLocalStorage = useCallback(() => {
    const state = localStorage.getItem(MOBILE_MOVE_STATE_KEY);
    if (!state) return;

    try {
      const parsedState = JSON.parse(state);
      if (!parsedState) return;

      dispatch(setMobileMoveFileId(parsedState.fileId));
      dispatch(setMobileMoveFileName(parsedState.fileName));
      dispatch(setMobileMoveFolderId(parsedState.folderId));
      dispatch(setMobileMoveFolderName(parsedState.folderName));
      dispatch(setMobileMoveFromLocationPath(parsedState.moveFromLocationPath));
      dispatch(setMobileMoveFileType(parsedState.fileType));
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (isStateMissing) handleGetFromLocalStorage();
  }, [isStateMissing, handleGetFromLocalStorage]);
};

export default useGetMoveMobileStateFromLocalStorage;
