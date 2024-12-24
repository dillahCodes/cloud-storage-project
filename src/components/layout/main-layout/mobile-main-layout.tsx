import useFileUploading from "@/features/file/hooks/use-file-uploading";
import { themeColors } from "@/theme/antd-theme";
import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import React from "react";
import Headroom from "react-headroom";
import { MainLayoutProps } from ".";
import ButtonAddMobile from "../button-add-folder-and-file/button-add-mobile";
import ButtonUploadStatusModal from "../button-upload-status/buttton-upload-status-modal";
import MobileDrawer from "../drawer/mobile-drawer";
import MobileDrawerMenu from "../drawer/mobile-drawer-menu";
import MobileHeder from "../header/mobile-header";
import useBreadcrumbState from "@/features/breadcrumb/hooks/use-breadcrumb-state";
import Breadcrumb from "../breadcrumb/breadcrumb";

const MobileMainLayout: React.FC<MainLayoutProps> = ({
  children,
  showAddButton,
  withFooter = true,
  withBreadcrumb,
}) => {
  const { fileUploadingState } = useFileUploading();
  const { items } = useBreadcrumbState();

  return (
    <Layout className="min-w-[360px]">
      <Headroom>
        <MobileHeder />
      </Headroom>

      <MobileDrawer>
        <MobileDrawerMenu />
      </MobileDrawer>

      {showAddButton && <ButtonAddMobile />}
      {fileUploadingState.fileUploadingList.length > 0 && <ButtonUploadStatusModal />}
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
