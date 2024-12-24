import useFileUploading from "@/features/file/hooks/use-file-uploading";
import useDrawer from "@/hooks/use-drawer";
import { themeColors } from "@/theme/antd-theme";
import { Layout } from "antd";
import { Footer } from "antd/es/layout/layout";
import { MainLayoutProps } from ".";
import ButtonUploadStatusModal from "../button-upload-status/buttton-upload-status-modal";
import DesktopDrawer from "../drawer/dekstop-drawer";
import DesktopDrawerActivity from "../drawer/desktop-drawer-activity";
import DesktopDrawerNotification from "../drawer/desktop-drawer-notification";
import FolderDetails from "../folder/folder-details";
import DekstopHeader from "../header/desktop-header";
import DesktopSider from "../sider/desktop-sider";
import useBreadcrumbState from "@/features/breadcrumb/hooks/use-breadcrumb-state";
import Breadcrumb from "../breadcrumb/breadcrumb";

const DesktopMainLayout: React.FC<Omit<MainLayoutProps, "showAddButton">> = ({
  children,
  withFooter = true,
  withBreadcrumb,
}) => {
  const { fileUploadingState } = useFileUploading();
  const { drawerState } = useDrawer();
  const { items } = useBreadcrumbState();

  return (
    <Layout className="max-h-screen">
      <DesktopSider />
      <DesktopDrawer>
        {drawerState.desktopDrawerTitle === "notification" && <DesktopDrawerNotification />}
        {drawerState.desktopDrawerTitle === "activity" && <DesktopDrawerActivity />}
        {drawerState.desktopDrawerTitle === "details" && <FolderDetails />}
      </DesktopDrawer>
      <Layout>
        <DekstopHeader />
        <Layout className="overflow-y-auto">
          <main>
            {withBreadcrumb && (
              <div className="p-3 max-w-screen-lg mx-auto w-full">
                <Breadcrumb items={items} />
              </div>
            )}
            <div className="min-h-screen" id="container-main-layout">
              {fileUploadingState.fileUploadingList.length > 0 && <ButtonUploadStatusModal />}

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
