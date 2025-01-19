import { useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { mobileMoveSelector } from "../slice/mobile-move-slice";
import { MobileFolderOrFileMoveLocalStorageKey } from "../move-folder-or-file";

const MOBILE_MOVE_STATE_KEY: MobileFolderOrFileMoveLocalStorageKey = "moveFolderOrFileMobile";

const useSaveMobileMoveStateToLocalStorage = () => {
  const { fileId, fileName, folderId, folderName, moveFromLocationPath, fileType } = useSelector(mobileMoveSelector);

  // Check if the state is not empty
  const isStateNotEmpty = useMemo(() => {
    return Boolean(fileId || fileName || folderId || folderName || moveFromLocationPath || fileType);
  }, [fileId, fileName, folderId, folderName, moveFromLocationPath, fileType]);

  // Save state to localStorage
  const handleSaveToLocalStorage = useCallback(() => {
    const state = JSON.stringify({
      fileId,
      fileName,
      folderId,
      folderName,
      moveFromLocationPath,
      fileType,
    });
    localStorage.setItem(MOBILE_MOVE_STATE_KEY, state);
  }, [fileId, fileName, folderId, folderName, moveFromLocationPath, fileType]);

  // Trigger save when state changes and is not empty
  useEffect(() => {
    if (isStateNotEmpty) handleSaveToLocalStorage();
  }, [isStateNotEmpty, handleSaveToLocalStorage]);

  return { handleSaveToLocalStorage };
};

export default useSaveMobileMoveStateToLocalStorage;
