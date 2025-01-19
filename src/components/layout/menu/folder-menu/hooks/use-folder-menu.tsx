import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import useAddFolderStarred from "@/features/folder/hooks/use-add-folder-starred";
import { setFolderOptionsAction } from "@/features/folder/slice/folder-options-slice";
import useDetectLocation from "@/hooks/use-detect-location";
import { useCallback, useMemo, useState } from "react";
import { LuActivity, LuFolderOutput, LuInfo, LuLink, LuPenLine, LuTrash } from "react-icons/lu";
import { MdFolderOpen } from "react-icons/md";
import { PiFolderStarFill } from "react-icons/pi";
import { useDispatch } from "react-redux";
import useHandleActionFolderMenu from "./use-handle-action-folder-menu";
import useHandleNavigationFolderMenu from "./use-handle-navigation-folder-menu";
import useHandleUpdateFolderMenu from "./use-handle-update-folder-menu";

// Helper function to create menu items
const createMenuItem = (
  key: string,
  icon: React.ReactNode,
  label: string,
  action?: () => void,
  isChildrenOpen: boolean = false,
  children?: MenuItem[]
) => ({
  key,
  icon,
  label,
  action,
  isChildrenOpen,
  children,
});

const useFolderOptionsMenu = (folderData: RootFolderGetData | SubFolderGetData) => {
  const dispatch = useDispatch();
  const { isSharedWithMeLocation, isStarredLocation } = useDetectLocation();

  /**
   * folder handling
   */
  const { closeAllChildren, updateMenuListVisibility } = useHandleUpdateFolderMenu();
  const { handleFolderActivity, handleFolderDetails } = useHandleNavigationFolderMenu();
  const { handleClipboard, handleMoveFolder } = useHandleActionFolderMenu();
  const { addFolderToStarred } = useAddFolderStarred();

  // Folder menu list
  const initialMenu = useMemo(
    () => [
      createMenuItem("rename", <LuPenLine />, "Rename", () => dispatch(setFolderOptionsAction("rename"))),
      createMenuItem("delete", <LuTrash />, "Delete", () => dispatch(setFolderOptionsAction("delete"))),
      createMenuItem("share link", <LuLink />, "Share Link", () => handleClipboard(folderData)),

      createMenuItem("organize", <MdFolderOpen />, "Organize", undefined, false, [
        createMenuItem("move", <LuFolderOutput />, "Move", () => handleMoveFolder(folderData.folder_id, folderData.folder_name)),
        createMenuItem("starred", <PiFolderStarFill />, "Starred", () => addFolderToStarred(folderData.folder_id, folderData.folder_name)),
      ]),

      createMenuItem("folder information", <LuInfo />, "Folder Information", undefined, false, [
        createMenuItem("details", <LuInfo />, "Details", () => handleFolderDetails(folderData)),
        createMenuItem("activity", <LuActivity />, "Activity", () => handleFolderActivity(folderData)),
      ]),
    ],
    [folderData, handleClipboard, handleMoveFolder, addFolderToStarred, handleFolderDetails, handleFolderActivity, dispatch]
  );

  const [folderMenuList, setFolderMenuList] = useState<MenuItem[]>(initialMenu);

  // Toggle children menus
  const handleToggleChildren = (key: string) => {
    setFolderMenuList((prevMenuList) => updateMenuListVisibility(prevMenuList, key));
  };

  const flattenMenuItems = useCallback((menuList: MenuItem[]): MenuItem[] => {
    return menuList.reduce<MenuItem[]>((acc, item) => {
      acc.push(item);
      if (item.children) {
        acc = acc.concat(flattenMenuItems(item.children));
      }
      return acc;
    }, []);
  }, []);

  const menuWillRender = useMemo(() => {
    // Flatten the menu list to access nested keys
    if (isSharedWithMeLocation) {
      const flattenedMenu = flattenMenuItems(folderMenuList);
      return flattenedMenu.filter((item) => ["delete", "starred"].includes(item.key));
    }

    if (isStarredLocation) {
      const flattenedMenu = flattenMenuItems(folderMenuList);
      return flattenedMenu.filter((item) => ["delete"].includes(item.key));
    }

    return folderMenuList;
  }, [folderMenuList, isSharedWithMeLocation, flattenMenuItems, isStarredLocation]);

  // Close all children menus and reset selection
  const handleCloseAllChildren = () => setFolderMenuList((prevMenuList) => closeAllChildren(prevMenuList));

  return {
    folderMenuList: menuWillRender,
    handleToggleChildren,
    handleCloseAllChildren,
  };
};

export default useFolderOptionsMenu;
