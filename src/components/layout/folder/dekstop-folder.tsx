import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import useHandleClickFolder from "@/features/folder/hooks/use-handle-click-folder";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import { memo } from "react";
import { MdFolderOpen } from "react-icons/md";
import useFolderOptionsMenu from "../menu/folder-menu/hooks/use-folder-menu";
import MenuItemComponent from "../menu/menu-item";
import { DesktopFolderOptionsButtonWithFloatingElement } from "./desktop-folder-options-button";
import RenderResponsiveTextMemoized from "./responsive-folder-name";

interface FolderProps {
  folderData: RootFolderGetData | SubFolderGetData;
}

const { Text } = Typography;
const DesktopFolder: React.FC<FolderProps> = ({ folderData }) => {
  const { handleToggleChildren, folderMenuList } = useFolderOptionsMenu(folderData);
  const { handleClickFolder } = useHandleClickFolder();

  return (
    <Flex
      id={folderData.folder_id}
      className="border-2 border-black rounded-md cursor-pointer w-full p-3"
      gap="small"
      align="center"
      justify="space-between"
      onClick={(e) => handleClickFolder(folderData, e)}
      style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.primary200 }}
    >
      {/* folder name and icon */}
      <Flex align="center" gap="small" id="folder-name">
        <MdFolderOpen className="text-xl" />
        <Text className="text-sm font-archivo">
          <RenderResponsiveTextMemoized folderName={folderData.folder_name} />
        </Text>
      </Flex>

      {/* folder options button */}
      <div id="folder-options">
        <DesktopFolderOptionsButtonWithFloatingElement
          rightPosition={21.5}
          parentZIndex={2}
          parentId={`folder-options-floating-element-${folderData.folder_id}`}
          parentFloatingElementClassName="rounded-md min-w-[300px]  opacity-0 h-0 transition-all duration-300 right-0"
          floatingElement={
            <Flex className="p-2 min-w-[300px] h-auto w-full border-2 border-black rounded-md" vertical gap="small">
              <MenuItemComponent menuList={folderMenuList} handleToggleChildren={handleToggleChildren} />
            </Flex>
          }
        />
      </div>
    </Flex>
  );
};

DesktopFolder.displayName = "DesktopFolder";

export default memo(DesktopFolder);
