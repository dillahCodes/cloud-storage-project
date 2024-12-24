import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { resetFiles, setFiles, setStatus } from "../slice/file-slice";

const useFilesSetState = () => {
  const dispatch = useDispatch();

  const setFilesState = useCallback((data: FileState["files"]) => dispatch(setFiles(data)), [dispatch]);
  const setFilesStatusState = useCallback(
    (status: FileState["status"]) => dispatch(setStatus(status)),
    [dispatch]
  );
  const resetFilesState = useCallback(() => dispatch(resetFiles()), [dispatch]);

  return { setFilesState, setFilesStatusState, resetFilesState };
};

export default useFilesSetState;
