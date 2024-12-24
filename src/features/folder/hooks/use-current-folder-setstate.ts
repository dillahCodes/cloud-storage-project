import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { CurrentFoldersState } from "../current-folders";
import { setCurrentFolders, setCurrentFoldersStatus } from "../slice/current-folders-slice";

const useCurrentFolderSetState = () => {
  const dispatch = useDispatch();

  const setFolders = useCallback(
    (data: CurrentFoldersState["folders"]) => dispatch(setCurrentFolders(data)),
    [dispatch]
  );

  const setStatus = useCallback(
    (status: CurrentFoldersState["status"]) => dispatch(setCurrentFoldersStatus(status)),
    [dispatch]
  );

  return { setFolders, setStatus };
};

export default useCurrentFolderSetState;
