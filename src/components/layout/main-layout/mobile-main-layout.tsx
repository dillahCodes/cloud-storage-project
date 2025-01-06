import useBreadcrumbState from "@/features/breadcrumb/hooks/use-breadcrumb-state";
import useFileUploading from "@/features/file/hooks/use-file-uploading";
import { mobileMoveSelector } from "@/features/move-folder-or-file/slice/mobile-move-slice";
import { moveFoldersAndFilesDataSelector } from "@/features/move-folder-or-file/slice/move-folders-and-files-data-slice";
import useDetectLocation from "@/hooks/use-detect-location";
import { themeColors } from "@/theme/antd-theme";
import { Flex, Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import classNames from "classnames";
import React, { useMemo } from "react";
import Headroom from "react-headroom";
import { useSelector } from "react-redux";
import { MainLayoutProps } from ".";
import Breadcrumb from "../breadcrumb/breadcrumb";
import ButtonAddMobile from "../button-add-folder-and-file/button-add-mobile";
import ButtonMoveCancel from "../button-move/button-move-cancel";
import ButtonMoveWithModal from "../button-move/button-move-with-modal";
import ButtonUploadStatusModal from "../button-upload-status/buttton-upload-status-modal";
import MobileDrawer from "../drawer/mobile-drawer";
import MobileDrawerMenu from "../drawer/mobile-drawer-menu";
import MobileHeder from "../header/mobile-header";
import useMoveMobileErroMessage from "@/features/move-folder-or-file/hooks/use-move-mobile-error-message";
import withLoadingOverlay from "@components/hoc/with-loading-overlay";

const MobileMainLayout: React.FC<MainLayoutProps> = ({ children, showAddButton, withFooter = true, withBreadcrumb, showPasteButton }) => {
  useMoveMobileErroMessage();

  const { fileUploadingState } = useFileUploading();
  const { items } = useBreadcrumbState();
  const { parentFolderData } = useSelector(moveFoldersAndFilesDataSelector);

  const { isMoveFolderOrFileLocation } = useDetectLocation();
  const { fileId, folderId } = useSelector(mobileMoveSelector);

  const isPasteButtonVisible = useMemo(
    () => (fileId || folderId) && isMoveFolderOrFileLocation && showPasteButton,
    [fileId, folderId, isMoveFolderOrFileLocation, showPasteButton]
  );

  return (
    <Layout className="min-w-[360px]">
      <Headroom>
        <MobileHeder />
      </Headroom>

      <MobileDrawer>
        <MobileDrawerMenu />
      </MobileDrawer>

      <Flex vertical gap="middle" className={classNames("fixed  z-10 bottom-5 right-5")}>
        {fileUploadingState.fileUploadingList.length > 0 && <ButtonUploadStatusModal />}
        {isPasteButtonVisible && (
          <Flex vertical gap="middle">
            <ButtonMoveWithModal />
            {parentFolderData && <ButtonMoveCancel />}
          </Flex>
        )}
        {showAddButton && <ButtonAddMobile />}
      </Flex>

      <Layout className="min-h-screen" style={{ backgroundColor: themeColors.primary300 }}>
        {withBreadcrumb && (
          <div className="p-3 max-w-screen-lg mx-auto w-full ">
            <Breadcrumb items={items} />
          </div>
        )}

        <Content>{children}</Content>
      </Layout>

      {withFooter && (
        <Footer className="border-black border-t-2" style={{ backgroundColor: themeColors.primary200 }}>
          <div className="w-full h-full p-3">footer</div>
        </Footer>
      )}
    </Layout>
  );
};

export default MobileMainLayout;
export const MobileMainLayoutWithOverlayLoading = withLoadingOverlay(MobileMainLayout);
