import { useCallback, useEffect } from "react";
import { moveFoldersAndFilesDataSelector } from "../slice/move-folders-and-files-data-slice";
import { useDispatch, useSelector } from "react-redux";
import { dekstopMoveSelector, setModalMoveButtonDisabled } from "../slice/dekstop-move-slice";

const useDekstopMoveValidation = () => {
  const dispatch = useDispatch();
  const { folderId } = useSelector(dekstopMoveSelector);
  const { foldersData, folderStatus } = useSelector(moveFoldersAndFilesDataSelector);

  const handleValidation = useCallback(() => {
    const isFolderExist = foldersData?.some((folder) => folder.folder_id === folderId) || folderStatus === "loading";
    dispatch(setModalMoveButtonDisabled(isFolderExist ? true : false));
  }, [dispatch, folderId, foldersData, folderStatus]);

  useEffect(() => {
    handleValidation();
  }, [handleValidation]);
};

export default useDekstopMoveValidation;
