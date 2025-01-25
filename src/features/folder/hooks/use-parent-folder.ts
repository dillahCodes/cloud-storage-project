import { resetBreadcrumb } from "@/features/breadcrumb/slice/breadcrumb-slice";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SubFolderGetData } from "../folder";
import { parentFolderSelector } from "../slice/parent-folder-slice";
import useFetchFolderData from "./use-fetch-folder-data";
import useParentFolderSetState from "./use-parent-folder-setstate";

interface UseParentFolderProps {
  fetchParentFolderDataOnMount: boolean;
  resetParentFolderDataOnMount: boolean;
  folderId: string | undefined;
}
const useParentFolder = ({ fetchParentFolderDataOnMount, resetParentFolderDataOnMount, folderId }: UseParentFolderProps) => {
  const navigate = useNavigate();
  const parentFolderState = useSelector(parentFolderSelector);

  const { setParentFolderData, resetFolderData, setStatus } = useParentFolderSetState();
  const { fetchFolderData } = useFetchFolderData(folderId);

  const isValidFolderId = useMemo(() => folderId && folderId.trim() !== "", [folderId]);

  const dispatch = useDispatch();

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      const folderData = await fetchFolderData();
      if (folderData) {
        setParentFolderData({
          isValidParentFolder: true,
          parentFolderData: folderData as SubFolderGetData,
          status: "succeeded",
        });
        setStatus("succeeded");
      } else {
        dispatch(resetBreadcrumb());
        navigate("/not-found", { replace: true, state: { message: "Folder not found." } });
        setStatus("failed");
      }
    };

    if (fetchParentFolderDataOnMount && isValidFolderId) fetchData();
  }, [fetchParentFolderDataOnMount, fetchFolderData, setParentFolderData, setStatus, navigate, dispatch, isValidFolderId]);

  // Reset data on mount
  useEffect(() => {
    if (resetParentFolderDataOnMount) resetFolderData();
  }, [resetParentFolderDataOnMount, resetFolderData]);

  return { parentFolderState };
};

export default useParentFolder;
