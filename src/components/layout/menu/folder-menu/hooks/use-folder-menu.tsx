import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import useAddFolderStarred from "@/features/folder/hooks/use-add-folder-starred";
import useDetectLocation from "@/hooks/use-detect-location";
import { useState } from "react";
import { LuActivity, LuFolderOutput, LuInfo, LuLink, LuPenLine, LuTrash } from "react-icons/lu";
import { MdFolderOpen } from "react-icons/md";
import { PiFolderStarFill } from "react-icons/pi";
import useHandleNavigationFolderMenu from "./use-handle-navigation-folder-menu";
import useHandleUpdateFolderMenu from "./use-handle-update-folder-menu";
import useHandleActionFolderMenu from "./use-handle-action-folder-menu";

export type ActionSelected = "rename" | "delete" | "details" | "activity" | "move" | "copy-link" | "starred" | null;

const useFolderOptionsMenu = (folderData: RootFolderGetData | SubFolderGetData) => {
  const { closeAllChildren, updateMenuListVisibility } = useHandleUpdateFolderMenu();
  const { handleFolderActivity, handleFolderDetails } = useHandleNavigationFolderMenu();

  const { handleClipboard, handleMoveFolder } = useHandleActionFolderMenu();
  const { addFolderToStarred } = useAddFolderStarred();

  const { isSharedWithMeLocation, isStarredLocation } = useDetectLocation();
  const [actionSelected, setActionSelected] = useState<ActionSelected>(null);

  const [menuList, setMenuList] = useState<MenuItem[]>([
    {
      key: "rename",
      icon: <LuPenLine />,
      label: "Rename",
      action: () => setActionSelected("rename"),
    },
    {
      key: "delete",
      icon: <LuTrash />,
      label: "Delete",
      action: () => setActionSelected("delete"),
    },
    {
      key: "share link",
      icon: <LuLink />,
      label: "Share Link",
      action: () => handleClipboard(folderData, setActionSelected),
    },
    {
      key: "organize",
      icon: <MdFolderOpen />,
      label: "Organize",
      isChildrenOpen: false,
      children: [
        {
          key: "move",
          label: "Move",
          action: () => handleMoveFolder(folderData.folder_id, folderData.folder_name, setActionSelected),
          icon: <LuFolderOutput />,
        },
        {
          key: "starred",
          label: "Starred",
          action: () => addFolderToStarred(folderData.folder_id, folderData.folder_name, setActionSelected),
          icon: <PiFolderStarFill />,
        },
      ],
    },
    {
      key: "folder information",
      icon: <LuInfo />,
      label: "Folder Information",
      isChildrenOpen: false,
      children: [
        {
          key: "details",
          label: "Details",
          action: () => handleFolderDetails(folderData),
          icon: <LuInfo />,
        },
        {
          key: "activity",
          label: "Activity",
          action: () => handleFolderActivity(folderData),
          icon: <LuActivity />,
        },
      ],
    },
  ]);

  const onlyDeleteMenu = menuList.filter((item) => item.key === "delete");

  const handleToggleChildren = (key: string) => {
    setMenuList((prevMenuList) => updateMenuListVisibility(prevMenuList, key));
  };

  const handleCloseAllChildren = () => {
    setMenuList((prevMenuList) => closeAllChildren(prevMenuList));
    setActionSelected(null);
  };

  // Choose menu list based on location
  const computedMenuList = isSharedWithMeLocation || isStarredLocation ? onlyDeleteMenu : menuList;

  return {
    menuList: computedMenuList,
    handleToggleChildren,
    actionSelected,
    handleCloseAllChildren,
    setActionSelected,
  };
};

export default useFolderOptionsMenu;
