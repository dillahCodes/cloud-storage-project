import { useSelector } from "react-redux";
import { mobileMoveSelector } from "../slice/mobile-move-slice";
import { useCallback, useEffect, useMemo } from "react";
import { MobileFolderOrFileMoveLocalStorageKey } from "../move-folder-or-file";

const MOBILE_MOVE_STATE_KEY: MobileFolderOrFileMoveLocalStorageKey = "moveFolderOrFileMobile";

const useSaveMobileMoveStateToLocalStorage = () => {
  const { fileId, fileName, folderId, folderName, moveFromLocationPath } = useSelector(mobileMoveSelector);

  const isStateNotEmpty = useMemo(
    () => !!(fileId || fileName || folderId || folderName || moveFromLocationPath),
    [fileId, fileName, folderId, folderName, moveFromLocationPath]
  );

  const handleSaveToLocalStorage = useCallback(() => {
    const state = JSON.stringify({ fileId, fileName, folderId, folderName, moveFromLocationPath });
    localStorage.setItem(MOBILE_MOVE_STATE_KEY, state);
  }, [fileId, fileName, folderId, folderName, moveFromLocationPath]);

  useEffect(() => {
    if (isStateNotEmpty) handleSaveToLocalStorage();
  }, [isStateNotEmpty, handleSaveToLocalStorage]);

  return { handleSaveToLocalStorage };
};

export default useSaveMobileMoveStateToLocalStorage;
