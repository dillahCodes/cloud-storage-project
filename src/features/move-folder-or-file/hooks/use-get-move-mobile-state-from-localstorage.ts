import { useCallback, useEffect, useMemo } from "react";
import { MobileFolderOrFileMoveLocalStorageKey } from "../move-folder-or-file";
import {
  mobileMoveSelector,
  setMobileMoveFileId,
  setMobileMoveFileName,
  setMobileMoveFolderId,
  setMobileMoveFolderName,
  setMobileMoveFromLocationPath,
} from "../slice/mobile-move-slice";
import { useDispatch, useSelector } from "react-redux";

const MOBILE_MOVE_STATE_KEY: MobileFolderOrFileMoveLocalStorageKey = "moveFolderOrFileMobile";

const useGetMoveMobileStateFromLocalStorage = () => {
  const dispatch = useDispatch();
  const { fileId, fileName, folderId, folderName, moveFromLocationPath } = useSelector(mobileMoveSelector);

  // Check if any state is missing
  const isStateMissing = useMemo(
    () => !fileId && !fileName && !folderId && !folderName && !moveFromLocationPath,
    [fileId, fileName, folderId, folderName, moveFromLocationPath]
  );

  const handleGetFromLocalStorage = useCallback(() => {
    try {
      const state = localStorage.getItem(MOBILE_MOVE_STATE_KEY);
      if (!state) return;

      const parsedState = JSON.parse(state);
      if (!parsedState) return;

      dispatch(setMobileMoveFileId(parsedState.fileId));
      dispatch(setMobileMoveFileName(parsedState.fileName));
      dispatch(setMobileMoveFolderId(parsedState.folderId));
      dispatch(setMobileMoveFolderName(parsedState.folderName));
      dispatch(setMobileMoveFromLocationPath(parsedState.moveFromLocationPath));
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (isStateMissing) handleGetFromLocalStorage();
  }, [isStateMissing, handleGetFromLocalStorage]);
};

export default useGetMoveMobileStateFromLocalStorage;
