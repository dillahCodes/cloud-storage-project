import { setActiveAction } from "@/features/file/slice/file-options-slice";
import useDetectLocation from "@/hooks/use-detect-location";
import { CgFileRemove } from "react-icons/cg";
import { LuTrash } from "react-icons/lu";
import { MdOutlineFileDownload, MdOutlineFileOpen } from "react-icons/md";
import { RiFileInfoLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import useHandleActionMoveFile from "./use-handle-action-move-file";
import { useMemo } from "react";

const useFileMenu = () => {
  const dispatch = useDispatch();
  const { isRecentlyViewedLocation } = useDetectLocation();
  const { handleMoveFile } = useHandleActionMoveFile();

  // Helper function to create menu items
  const createMenuItem = (key: string, icon: React.ReactNode, label: string, action?: () => void, isChildrenOpen: boolean = false) => ({
    key,
    icon,
    label,
    action,
    isChildrenOpen,
  });

  // File menu list
  const fileMenuList = useMemo(
    () => [
      createMenuItem("download file", <MdOutlineFileDownload />, "Download file", () => dispatch(setActiveAction("dowload"))),
      createMenuItem("delete", <LuTrash />, "Delete", () => dispatch(setActiveAction("delete"))),
      createMenuItem("move file", <CgFileRemove />, "Move file", () => handleMoveFile()),
      createMenuItem("file information", <RiFileInfoLine />, "File Information", () => dispatch(setActiveAction("details"))),
    ],
    [dispatch, handleMoveFile]
  );

  // Redent file menu list
  const redentFileMenuList = useMemo(
    () => [
      createMenuItem("delete", <LuTrash />, "Delete", () => dispatch(setActiveAction("delete"))),
      createMenuItem("go to file", <MdOutlineFileOpen />, "Go to file", () => dispatch(setActiveAction("visit"))),
      createMenuItem("file information", <RiFileInfoLine />, "File Information", () => dispatch(setActiveAction("details"))),
    ],
    [dispatch]
  );

  return { fileMenuList: isRecentlyViewedLocation ? redentFileMenuList : fileMenuList };
};

export default useFileMenu;
