import useBreadcrumbState from "@/features/breadcrumb/hooks/use-breadcrumb-state";
import useFileUploading from "@/features/file/hooks/use-file-uploading";
import useDrawer from "@/hooks/use-drawer";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { themeColors } from "@/theme/antd-theme";
import withLoadingOverlay from "@components/hoc/with-loading-overlay";
import { Flex, Layout, Typography } from "antd";
import { Footer } from "antd/es/layout/layout";
import classNames from "classnames";
import { MainLayoutProps } from ".";
import Breadcrumb from "../breadcrumb/breadcrumb";
import ButtonUploadStatusModal from "../button-upload-status/buttton-upload-status-modal";
import DesktopDrawer from "../drawer/dekstop-drawer";
import DesktopDrawerActivity from "../drawer/desktop-drawer-activity";
import DesktopDrawerNotification from "../drawer/desktop-drawer-notification";
import FolderDetails from "../folder/folder-details";
import DekstopHeader from "../header/desktop-header";
import DektopMoveModal from "../modal/dektop-move-modal";
import DesktopSider from "../sider/desktop-sider";
import { FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";
import { useMemo } from "react";

const { Text, Link } = Typography;
const DesktopMainLayout: React.FC<Omit<MainLayoutProps, "showAddButton" | "showPasteButton">> = ({
  children,
  withFooter = true,
  withBreadcrumb,
}) => {
  const { isTabletDevice, isDesktopDevice } = useGetClientScreenWidth();
  const { fileUploadingState } = useFileUploading();
  const { drawerState } = useDrawer();
  const { items } = useBreadcrumbState();

  const isFileUploadingButtonOpen = useMemo(() => {
    return (
      fileUploadingState.fileUploadingList.length > 0 &&
      fileUploadingState.fileUploadingList.some((file) => ["uploading"].includes(file.status))
    );
  }, [fileUploadingState]);

  return (
    <Layout className="max-h-screen">
      <DesktopSider />
      <DektopMoveModal />
      <DesktopDrawer>
        {drawerState.desktopDrawerTitle === "notification" && <DesktopDrawerNotification />}
        {drawerState.desktopDrawerTitle === "activity" && <DesktopDrawerActivity />}
        {drawerState.desktopDrawerTitle === "details" && <FolderDetails />}
      </DesktopDrawer>
      <Layout>
        <DekstopHeader />
        <Layout className="overflow-y-auto" id="container-main-layout">
          <main>
            {withBreadcrumb && (
              <div className="p-3 max-w-screen-lg mx-auto w-full">
                <Breadcrumb items={items} />
              </div>
            )}
            <div className="min-h-screen">
              <Flex
                vertical
                gap="middle"
                className={classNames("fixed  z-10", {
                  "bottom-5 right-5": isTabletDevice,
                  "bottom-10 right-10": isDesktopDevice,
                })}
              >
                {isFileUploadingButtonOpen && <ButtonUploadStatusModal />}
              </Flex>
              {children}
            </div>
          </main>
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
      </Layout>
    </Layout>
  );
};

export default DesktopMainLayout;
export const DektopMainLayoutWithOverlayLoading = withLoadingOverlay(DesktopMainLayout);
