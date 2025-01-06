import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Flex, Modal, Typography } from "antd";
import { forwardRef, useCallback, useEffect } from "react";
import { MdFolderOpen } from "react-icons/md";
import useFolderOptionsMenu from "../menu/folder-menu/hooks/use-folder-menu";
import MenuItemComponent from "../menu/menu-item";
import { DesktopFolderOptionsButtonWithFloatingElement } from "./desktop-folder-options-button";
import ModalContentDeleteFolder from "./modal-content-delete-folder";
import ModalContentRenameFolder from "./modal-content-rename-folder";
import RenderResponsiveTextMemoized from "./responsive-folder-name";

interface FolderProps {
  folderData: RootFolderGetData | SubFolderGetData;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const { Text } = Typography;
const DesktopFolder = forwardRef<HTMLDivElement, FolderProps>(({ folderData, onClick }, ref) => {
  const [modal, modalContextHolder] = Modal.useModal();
  const { handleToggleChildren, menuList, handleCloseAllChildren, actionSelected } = useFolderOptionsMenu(folderData);

  const renderModalContent = useCallback(() => {
    switch (actionSelected) {
      case "rename":
        return <ModalContentRenameFolder folderData={folderData} afterCloseButton={handleCloseAllChildren} />;
      case "delete":
        return (
          <ModalContentDeleteFolder folderData={folderData} afterCloseButton={handleCloseAllChildren} afterDeleteFolder={handleCloseAllChildren} />
        );

      default:
        return null;
    }
  }, [actionSelected, folderData, handleCloseAllChildren]);

  useEffect(() => {
    // only show modal rename and delete on dektop version
    if (actionSelected === null || !["rename", "delete"].includes(actionSelected)) return;

    modal.info({
      content: renderModalContent(),
      icon: null,
      styles: { content: { padding: "12px" } },
      footer: null,
      afterClose: () => handleCloseAllChildren(),
      maskClosable: true,
    });
  }, [modal, renderModalContent, actionSelected, handleCloseAllChildren]);

  return (
    <>
      {modalContextHolder}
      <Flex
        ref={ref}
        className="border-2 border-black rounded-md cursor-pointer w-full p-3"
        gap="small"
        align="center"
        justify="space-between"
        onClick={onClick}
        style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.primary200 }}
      >
        <Flex align="center" gap="small" id="folder-name">
          <MdFolderOpen className="text-xl" />
          <Text className="text-sm font-archivo">
            <RenderResponsiveTextMemoized folderName={folderData.folder_name} />
          </Text>
        </Flex>

        <div id="folder-options">
          <DesktopFolderOptionsButtonWithFloatingElement
            rightPosition={21.5}
            parentZIndex={2}
            parentFloatingElementClassName="rounded-md"
            parentId={`folder-options-floating-element-${folderData.folder_id}`}
            floatingElement={
              <Flex className="p-2 min-w-[300px] h-auto w-full border-2 border-black rounded-md" vertical gap="small">
                <MenuItemComponent menuList={menuList} handleToggleChildren={handleToggleChildren} />
              </Flex>
            }
          />
        </div>
      </Flex>
    </>
  );
});

DesktopFolder.displayName = "DesktopFolder";

export default DesktopFolder;
