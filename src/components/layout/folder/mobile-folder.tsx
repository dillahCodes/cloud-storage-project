import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import useHandleClickFolder from "@/features/folder/hooks/use-handle-click-folder";
import { folderOptionsSelector } from "@/features/folder/slice/folder-options-slice";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import React, { memo, useMemo } from "react";
import { MdFolderOpen } from "react-icons/md";
import { useSelector } from "react-redux";
import useFolderOptionsMenu from "../menu/folder-menu/hooks/use-folder-menu";
import MenuItemComponent from "../menu/menu-item";
import MobileFolderOptionsButtonWithBottomDrawer from "./mobile-folder-options-button";
import RenderResponsiveTextMemoized from "./responsive-folder-name";

interface FolderProps {
  folderData: RootFolderGetData | SubFolderGetData;
}

const { Text } = Typography;

const MobileFolder: React.FC<FolderProps> = ({ folderData }) => {
  const { handleToggleChildren, folderMenuList, handleCloseAllChildren } = useFolderOptionsMenu(folderData);
  const { handleClickFolder, handleClickMobileFolderOptions, handleCloseDrawerFolderMobileOptions } = useHandleClickFolder();
  const { selectedFolderData } = useSelector(folderOptionsSelector);

  const isDrawerOpen = useMemo(() => {
    return Boolean(selectedFolderData?.folder_id === folderData.folder_id);
  }, [folderData, selectedFolderData]);

  const handleCloseDrawer = (e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => {
    handleCloseDrawerFolderMobileOptions(e);
    handleCloseAllChildren();
  };

  return (
    <>
      <Flex
        className="border-2 border-black rounded-md cursor-pointer w-full p-3"
        gap="small"
        align="center"
        justify="space-between"
        onClick={(e: React.MouseEvent<HTMLElement>) => handleClickFolder(folderData, e)}
        style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.primary200 }}
      >
        <FolderName folderName={folderData.folder_name} />

        {/* Mobile folder options and drawer menu */}
        <div id="folder-options" onClick={(e) => handleClickMobileFolderOptions(folderData, e)}>
          <MobileFolderOptionsButtonWithBottomDrawer
            drawerContent={<MobileFolderMenu menuList={folderMenuList} handleToggleChildren={handleToggleChildren} />}
            open={isDrawerOpen}
            onClose={(e) => handleCloseDrawer(e)}
            height={"auto"}
            title={<FolderName folderName={folderData.folder_name} />}
            closeIcon={null}
            placement="bottom"
            styles={{
              content: { borderRadius: "10px 10px 0 0" },
              header: {
                padding: "12px",
                backgroundColor: themeColors.primary300,
                borderBottomColor: "black",
                borderBottomWidth: "2px",
              },
              body: { backgroundColor: themeColors.primary300, padding: "12px" },
            }}
          />
        </div>
      </Flex>
    </>
  );
};

MobileFolder.displayName = "MobileFolder";

export default memo(MobileFolder);

const MobileFolderMenu: React.FC<{
  menuList: MenuItem[];
  handleToggleChildren: (key: string) => void;
}> = ({ menuList, handleToggleChildren }) => {
  return (
    <Flex className="w-full" vertical gap="small">
      <MenuItemComponent menuList={menuList} handleToggleChildren={handleToggleChildren} />
    </Flex>
  );
};

const FolderName: React.FC<{ folderName: string }> = ({ folderName }) => {
  return (
    <Flex align="center" gap="small">
      <Text>
        <MdFolderOpen className="text-xl" />
      </Text>
      <Text className="text-sm font-archivo">
        <RenderResponsiveTextMemoized folderName={folderName} />
      </Text>
    </Flex>
  );
};
