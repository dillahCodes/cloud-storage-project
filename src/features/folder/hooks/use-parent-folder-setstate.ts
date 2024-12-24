import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ParentFolderData } from "../folder";
import { resetParentFolder, setParentFolder, setStatusParentFolder } from "../slice/parent-folder-slice";

const useParentFolderSetState = () => {
  const dispatch = useDispatch();

  const setParentFolderData = useCallback((data: ParentFolderData) => dispatch(setParentFolder(data)), [dispatch]);
  const resetFolderData = useCallback(() => dispatch(resetParentFolder()), [dispatch]);
  const setStatus = useCallback((status: ParentFolderData["status"]) => dispatch(setStatusParentFolder(status)), [dispatch]);

  return { setParentFolderData, resetFolderData, setStatus };
};

export default useParentFolderSetState;
