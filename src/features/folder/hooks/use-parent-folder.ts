import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SubFolderGetData } from "../folder";
import { parentFolderSelector } from "../slice/parent-folder-slice";
import useFetchFolderData from "./use-fetch-folder-data";
import useParentFolderSetState from "./use-parent-folder-setstate";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { resetBreadcrumb } from "@/features/breadcrumb/slice/breadcrumb-slice";

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
        message.open({
          type: "error",
          content: "Folder not found.",
          className: "font-archivo text-sm capitalize",
        });
        navigate("/not-found", { replace: true, state: { message: "Folder not found." } });
        setStatus("failed");
      }
    };

    if (fetchParentFolderDataOnMount) fetchData();
  }, [fetchParentFolderDataOnMount, fetchFolderData, setParentFolderData, setStatus, navigate, dispatch]);

  // Reset data on mount
  useEffect(() => {
    if (resetParentFolderDataOnMount) resetFolderData();
  }, [resetParentFolderDataOnMount, resetFolderData]);

  return { parentFolderState };
};

export default useParentFolder;
