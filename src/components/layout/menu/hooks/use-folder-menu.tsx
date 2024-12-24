import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import useAddFolderStarred from "@/features/folder/hooks/use-add-folder-starred";
import useDetectLocation from "@/hooks/use-detect-location";
import useDrawer from "@/hooks/use-drawer";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import copyToClipboard from "@/util/copy-to-clipboard";
import { useCallback, useState } from "react";
import { LuActivity, LuFolderOpen, LuFolderOutput, LuInfo, LuLink, LuPenLine, LuTrash } from "react-icons/lu";
import { MdOutlineFolderSpecial } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export type ActionSelected = "rename" | "delete" | "move" | "details" | "activity" | null;

const useFolderOptionsMenu = (folderData: RootFolderGetData | SubFolderGetData) => {
  const { isSharedWithMeLocation, isStarredLocation } = useDetectLocation();
  const navigate = useNavigate();

  const { openDrawerDesktop, setDrawerDesktopTitle, setDrawerDesktopFolderId } = useDrawer();
  const { isDesktopDevice } = useGetClientScreenWidth();

  const [actionSelected, setActionSelected] = useState<ActionSelected>(null);

  const { addFolderToStarred } = useAddFolderStarred();

  /*
   * handle copy to clipboard
   */
  const handleClipboard = useCallback(async () => {
    const params: NestedBreadcrumbType = "shared-with-me";
    const folderId = folderData?.folder_id ?? "";

    const domain = window.location.origin;
    const url = `${domain}/storage/folders/${folderId}?st=${params}`;

    await copyToClipboard(url);
  }, [folderData.folder_id]);

  // Initial menu list
  const initialMenuList: MenuItem[] = [
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
      action: () => handleClipboard(),
    },
    {
      key: "organize",
      label: "Organize",
      icon: <LuFolderOpen />,
      isChildrenOpen: false,
      children: [
        {
          key: "move",
          label: "Move",
          action: () => setActionSelected("move"),
          icon: <LuFolderOutput />,
        },
        {
          key: "starred",
          label: "Starred",
          action: () => addFolderToStarred(folderData.folder_id, folderData.folder_name),
          icon: <MdOutlineFolderSpecial />,
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
          action: () => handleFolderDetails(),
          icon: <LuInfo />,
        },
        {
          key: "activity",
          label: "Activity",
          action: () => handleFolderActivity(),
          icon: <LuActivity />,
        },
      ],
    },
  ];

  const sharedFolderMenu: MenuItem[] = [
    {
      key: "delete",
      icon: <LuTrash />,
      label: "Delete",
      action: () => setActionSelected("delete"),
    },
  ];

  const [menuList, setMenuList] = useState<MenuItem[]>(initialMenuList);

  // Handle folder details navigation
  const handleFolderDetails = () => {
    setActionSelected("details");

    const isRootFolder = folderData.parent_folder_id === null;

    if (!isDesktopDevice) {
      const parentParam = isRootFolder ? folderData.folder_id : folderData.parent_folder_id;
      navigate(`/storage/folder/details/${folderData.folder_id}?parent=${parentParam}`);
    } else {
      openDrawerDesktop();
      setDrawerDesktopTitle("details");
      setDrawerDesktopFolderId(folderData.folder_id);
    }
  };

  // handle folder activity navigation
  const handleFolderActivity = () => {
    setActionSelected("activity");

    const isRootFolder = folderData.parent_folder_id === null;

    if (!isDesktopDevice) {
      const parentParam = isRootFolder ? folderData.folder_id : folderData.parent_folder_id;
      navigate(`/storage/folder/activity/${folderData.folder_id}?root=${parentParam}`);
    } else {
      openDrawerDesktop();
      setDrawerDesktopTitle("activity");
      setDrawerDesktopFolderId(folderData.root_folder_id);
    }
  };

  // Toggle visibility for children of a specific menu item
  const handleToggleChildren = (key: string) => {
    setMenuList((prevMenuList) => updateMenuListVisibility(prevMenuList, key));
  };

  // Update menu list visibility recursively
  const updateMenuListVisibility = (menuItems: MenuItem[], targetKey: string): MenuItem[] => {
    return menuItems.map((item) => {
      if (item.key === targetKey) return { ...item, isChildrenOpen: !item.isChildrenOpen };
      if (item.children) return { ...item, children: updateMenuListVisibility(item.children, targetKey) };
      return item;
    });
  };

  // Close all child menus
  const handleCloseAllChildren = () => {
    setMenuList((prevMenuList) => closeAllChildren(prevMenuList));
    setActionSelected(null);
  };

  const closeAllChildren = (items: MenuItem[]): MenuItem[] => {
    return items.map((item) => ({
      ...item,
      isChildrenOpen: false,
      children: item.children ? closeAllChildren(item.children) : undefined,
    }));
  };

  return {
    menuList: isSharedWithMeLocation || isStarredLocation ? sharedFolderMenu : menuList,
    handleToggleChildren,
    actionSelected,
    handleCloseAllChildren,
    setActionSelected,
  };
};

export default useFolderOptionsMenu;
