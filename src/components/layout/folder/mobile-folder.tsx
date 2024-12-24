import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Flex, Modal, Typography } from "antd";
import React, { forwardRef, useCallback, useEffect } from "react";
import { MdFolderOpen } from "react-icons/md";
import MobileFolderOptionsButtonWithBottomDrawer from "./mobile-folder-options-button";
import RenderResponsiveTextMemoized from "./responsive-folder-name";
import useFolderOptionsMenu from "../menu/hooks/use-folder-menu";
import MenuItemComponent from "../menu/menu-item";
import ModalContentRenameFolder from "./modal-content-rename-folder";
import ModalContentDeleteFolder from "./modal-content-delete-folder";

interface FolderProps extends React.HTMLAttributes<HTMLDivElement> {
  folderData: RootFolderGetData | SubFolderGetData;
  isDrawerMobileOpen: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  setMobileOpenedFolderId: React.Dispatch<React.SetStateAction<string | null>>;
}

const { Text } = Typography;

// Define the MobileFolder component with forwardRef
const MobileFolder = forwardRef<HTMLDivElement, FolderProps>(
  ({ folderData, isDrawerMobileOpen, onClick, setMobileOpenedFolderId, ...props }, ref) => {
    const [modal, modalContextHolder] = Modal.useModal();
    const { handleToggleChildren, menuList, handleCloseAllChildren, actionSelected } = useFolderOptionsMenu(folderData);

    const renderModalContent = useCallback(() => {
      switch (actionSelected) {
        case "rename":
          return <ModalContentRenameFolder folderData={folderData} afterCloseButton={handleCloseAllChildren} />;
        case "delete":
          return (
            <ModalContentDeleteFolder
              folderData={folderData}
              afterCloseButton={handleCloseAllChildren}
              afterDeleteFolder={handleCloseAllChildren}
            />
          );

        default:
          return null;
      }
    }, [actionSelected, folderData, handleCloseAllChildren]);

    const handleDrawerOnClose = () => {
      setMobileOpenedFolderId(null);
      handleCloseAllChildren();
    };

    useEffect(() => {
      if (actionSelected === null) return;

      modal.info({
        content: renderModalContent(),
        icon: null,
        styles: { content: { padding: "12px" } },
        footer: null,
        afterClose: () => handleCloseAllChildren(),
        maskClosable: true,
      });
    }, [modal, renderModalContent, actionSelected, handleCloseAllChildren, setMobileOpenedFolderId]);

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
          {...props}
          style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.primary200 }}
        >
          <Flex align="center" gap="small">
            <Text>
              <MdFolderOpen className="text-xl" />
            </Text>
            <Text className="text-sm font-archivo">
              <RenderResponsiveTextMemoized folderName={folderData.folder_name} />
            </Text>
          </Flex>

          {/* mobile folder options and drawer menu */}
          <div id="folder-options">
            <MobileFolderOptionsButtonWithBottomDrawer
              // menu
              children={
                <Flex className="w-full" vertical gap="small">
                  <MenuItemComponent menuList={menuList} handleToggleChildren={handleToggleChildren} />
                </Flex>
              }
              open={isDrawerMobileOpen}
              onClose={handleDrawerOnClose}
              height={"auto"}
              title={
                <Flex align="center" gap="small">
                  <Text>
                    <MdFolderOpen className="text-xl" />
                  </Text>
                  <Text className="text-sm font-archivo">
                    <RenderResponsiveTextMemoized folderName={folderData.folder_name} />
                  </Text>
                </Flex>
              }
              closeIcon={null}
              placement="bottom"
              styles={{
                content: { borderRadius: "10px 10px 0 0" },
                header: { padding: "12px", backgroundColor: themeColors.primary300, borderBottomColor: "black", borderBottomWidth: "2px" },
                body: { backgroundColor: themeColors.primary300, padding: "12px" },
              }}
            />
          </div>
        </Flex>
      </>
    );
  }
);

// Set a display name for debugging
MobileFolder.displayName = "MobileFolder";

export default MobileFolder;
