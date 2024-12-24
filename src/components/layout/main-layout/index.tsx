import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import React, { useMemo } from "react";
import MobileMainLayout from "./mobile-main-layout";
import DesktopMainLayout from "./desktop-main-layout";
import useFolderPermissionState from "@/features/folder/hooks/use-folder-permission-state";
import useHandleFolderAccessModal from "@/features/folder/hooks/use-handle-folder-access-modal";
import { Modal, Typography } from "antd";
import Alert from "@components/ui/alert";

export interface MainLayoutProps {
  children: React.ReactNode;
  showAddButton: boolean;
  withFooter?: boolean;
  withBreadcrumb?: boolean;
}

const { Text } = Typography;
const MainLayout: React.FC<MainLayoutProps> = ({ children, showAddButton, withFooter, withBreadcrumb = true }) => {
  const { statusFetch } = useFolderPermissionState();
  const isGetPermissionSuccess = useMemo(() => {
    return statusFetch.CollaboratorsFetchStatus === "succeeded" && statusFetch.GeneralAccessFetchStatus === "succeeded";
  }, [statusFetch]);

  const { closeModal, isModalVisible } = useHandleFolderAccessModal(isGetPermissionSuccess);

  const { isMobileDevice } = useGetClientScreenWidth();
  return isMobileDevice ? (
    <MobileMainLayout showAddButton={showAddButton} withBreadcrumb={withBreadcrumb} withFooter={withFooter}>
      <Modal
        footer={null}
        closeIcon={null}
        open={isModalVisible}
        onCancel={closeModal}
        styles={{
          content: {
            padding: "0",
          },
        }}
      >
        <Alert
          className="w-full"
          neoBrutalVariants="medium"
          message={<Text className="font-archivo text-base font-medium">Restricted Access</Text>}
          description={<Text className="font-archivo text-sm">You don't have permission to add folder or file in this folder.</Text>}
          type="warning"
          showIcon
        />
      </Modal>

      {children}
    </MobileMainLayout>
  ) : (
    <DesktopMainLayout withBreadcrumb={withBreadcrumb} withFooter={withFooter}>
      <Modal
        footer={null}
        closeIcon={null}
        open={isModalVisible}
        onCancel={closeModal}
        styles={{
          content: {
            padding: "0",
          },
        }}
      >
        <Alert
          className="w-full"
          neoBrutalVariants="medium"
          message={<Text className="font-archivo text-base font-medium">Restricted Access</Text>}
          description={<Text className="font-archivo text-sm">You don't have permission to add folder or file in this folder.</Text>}
          type="warning"
          showIcon
        />
      </Modal>

      {children}
    </DesktopMainLayout>
  );
};

export default MainLayout;
