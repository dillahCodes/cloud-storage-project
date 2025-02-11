import useBreadcrumbState from "@/features/breadcrumb/hooks/use-breadcrumb-state";
import useFileUploading from "@/features/file/hooks/use-file-uploading";
import useMoveMobileErroMessage from "@/features/move-folder-or-file/hooks/use-move-mobile-error-message";
import { mobileMoveSelector } from "@/features/move-folder-or-file/slice/mobile-move-slice";
import { searchBarSelector } from "@/features/search-folder-or-file/slice/search-bar-slice";
import useDetectLocation from "@/hooks/use-detect-location";
import { themeColors } from "@/theme/antd-theme";
import withLoadingOverlay from "@components/hoc/with-loading-overlay";
import { Flex, Layout, Typography } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import classNames from "classnames";
import React, { useMemo } from "react";
import Headroom from "react-headroom";
import { useSelector } from "react-redux";
import { MainLayoutProps } from ".";
import Breadcrumb from "../breadcrumb/breadcrumb";
import ButtonAddMobile from "../button-add-folder-and-file/button-add-mobile";
import ButtonMoveWithModal from "../button-move/button-move-with-modal";
import ButtonUploadStatusModal from "../button-upload-status/buttton-upload-status-modal";
import MobileDrawer from "../drawer/mobile-drawer";
import MobileDrawerMenu from "../drawer/mobile-drawer-menu";
import MobileHeder from "../header/mobile-header";
import MobileSearchBar from "../searchbar/mobile-searchbar";
import { FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";

const { Text, Link } = Typography;
const MobileMainLayout: React.FC<MainLayoutProps> = ({
  children,
  showAddButton,
  withFooter = true,
  withBreadcrumb,
  showPasteButton,
}) => {
  useMoveMobileErroMessage();

  const { fileUploadingState } = useFileUploading();
  const isFileUploadingButtonOpen = useMemo(() => {
    return (
      fileUploadingState.fileUploadingList.length > 0 &&
      fileUploadingState.fileUploadingList.some((file) => ["uploading"].includes(file.status))
    );
  }, [fileUploadingState]);

  const { items } = useBreadcrumbState();

  const { isMoveFolderOrFileLocation } = useDetectLocation();

  const { fileId, folderId } = useSelector(mobileMoveSelector);
  const { isSearchbarOpen } = useSelector(searchBarSelector);

  const isPasteButtonVisible = useMemo(() => {
    return (fileId || folderId) && isMoveFolderOrFileLocation && showPasteButton;
  }, [fileId, folderId, isMoveFolderOrFileLocation, showPasteButton]);

  return (
    <Layout className="min-w-[360px]">
      {/* header */}
      <Headroom className="z-50">
        <MobileHeder />
      </Headroom>

      {/* drawer */}
      <MobileDrawer>
        <MobileDrawerMenu />
      </MobileDrawer>

      {/* search overlay */}
      {isSearchbarOpen && <MobileSearchBar />}

      <Flex vertical gap="middle" className={classNames("fixed  z-10 bottom-5 right-5")}>
        {isFileUploadingButtonOpen && <ButtonUploadStatusModal />}
        {isPasteButtonVisible && (
          <Flex vertical gap="middle">
            <ButtonMoveWithModal />
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
          <Flex className="w-full p-3" align="center" justify="space-between" gap="middle">
            <Text className="text-sm font-archivo text-[#fff1ff]">Created with ❤️ by DillahCodes</Text>
            <Flex align="center" gap="small">
              <Link className="text-[#fff1ff] text-2xl" href="https://www.instagram.com/dillah.codes" target="_blank">
                <FaInstagram />
              </Link>
              <Link className="text-[#fff1ff] text-2xl" href="https://www.linkedin.com/in/abdillahjuniansyah" target="_blank">
                <FaLinkedin />
              </Link>
              <Link className="text-[#fff1ff] text-2xl" href="https://www.tiktok.com/@dillah.codes" target="_blank">
                <FaTiktok />
              </Link>
            </Flex>
          </Flex>
        </Footer>
      )}
    </Layout>
  );
};

export default MobileMainLayout;
export const MobileMainLayoutWithOverlayLoading = withLoadingOverlay(MobileMainLayout);
