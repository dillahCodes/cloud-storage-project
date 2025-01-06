import { useSelector } from "react-redux";
import { mobileMoveSelector } from "../slice/mobile-move-slice";
import { moveFoldersAndFilesDataSelector } from "../slice/move-folders-and-files-data-slice";
import { useCallback } from "react";

const useConfirmMobileMoveFile = () => {
  const { parentFolderData } = useSelector(moveFoldersAndFilesDataSelector);
  const { fileId, fileName, fileType } = useSelector(mobileMoveSelector);

  const confirmMoveFile = useCallback(() => {
    console.log("move file", fileId, fileName, fileType);
    console.log("to folder", parentFolderData);
  }, [fileId, fileName, fileType, parentFolderData]);

  return { confirmMoveFile };
};
export default useConfirmMobileMoveFile;
