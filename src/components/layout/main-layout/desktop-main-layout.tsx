import useBreadcrumbState from "@/features/breadcrumb/hooks/use-breadcrumb-state";
import useFileUploading from "@/features/file/hooks/use-file-uploading";
import useDrawer from "@/hooks/use-drawer";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { themeColors } from "@/theme/antd-theme";
import withLoadingOverlay from "@components/hoc/with-loading-overlay";
import { Flex, Layout } from "antd";
import { Footer } from "antd/es/layout/layout";
import classNames from "classnames";
import { MainLayoutProps } from ".";
import Breadcrumb from "../breadcrumb/breadcrumb";
import ButtonMoveWithModal from "../button-move/button-move-with-modal";
import ButtonUploadStatusModal from "../button-upload-status/buttton-upload-status-modal";
import DesktopDrawer from "../drawer/dekstop-drawer";
import DesktopDrawerActivity from "../drawer/desktop-drawer-activity";
import DesktopDrawerNotification from "../drawer/desktop-drawer-notification";
import FolderDetails from "../folder/folder-details";
import DekstopHeader from "../header/desktop-header";
import DektopMoveModal from "../modal/dektop-move-modal";
import DesktopSider from "../sider/desktop-sider";

const DesktopMainLayout: React.FC<Omit<MainLayoutProps, "showAddButton" | "showPasteButton">> = ({ children, withFooter = true, withBreadcrumb }) => {
  const { isTabletDevice, isDesktopDevice } = useGetClientScreenWidth();
  const { fileUploadingState } = useFileUploading();
  const { drawerState } = useDrawer();
  const { items } = useBreadcrumbState();

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
                {fileUploadingState.fileUploadingList.length > 0 && <ButtonUploadStatusModal />}
              </Flex>
              {children}
            </div>
          </main>
          {withFooter && (
            <Footer className="border-black border-t-2" style={{ backgroundColor: themeColors.primary200 }}>
              <div className="w-full h-full p-3 bold">footer</div>
            </Footer>
          )}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DesktopMainLayout;
export const DektopMainLayoutWithOverlayLoading = withLoadingOverlay(DesktopMainLayout);
