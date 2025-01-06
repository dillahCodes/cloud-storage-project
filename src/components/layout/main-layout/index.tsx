import useFolderPermissionState from "@/features/folder/hooks/use-folder-permission-state";
import useHandleFolderAccessModal from "@/features/folder/hooks/use-handle-folder-access-modal";
import { dekstopMoveSelector } from "@/features/move-folder-or-file/slice/dekstop-move-slice";
import { mobileMoveSelector } from "@/features/move-folder-or-file/slice/mobile-move-slice";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import Alert from "@components/ui/alert";
import { Modal, Typography } from "antd";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { DektopMainLayoutWithOverlayLoading } from "./desktop-main-layout";
import { MobileMainLayoutWithOverlayLoading } from "./mobile-main-layout";

export interface MainLayoutProps {
  children: React.ReactNode;
  showAddButton: boolean;
  showPasteButton: boolean;
  withFooter?: boolean;
  withBreadcrumb?: boolean;
}

const { Text } = Typography;
const MainLayout: React.FC<MainLayoutProps> = ({ children, showAddButton, withFooter, withBreadcrumb = true, showPasteButton }) => {
  const moveMobileSelector = useSelector(mobileMoveSelector);
  const isMobileMoveLoading = useMemo(() => moveMobileSelector.moveStatus === "loading", [moveMobileSelector.moveStatus]);

  const moveDektopSelector = useSelector(dekstopMoveSelector);
  const isDektopMoveLoading = useMemo(() => moveDektopSelector.dekstopMoveStatus === "loading", [moveDektopSelector.dekstopMoveStatus]);

  const { statusFetch } = useFolderPermissionState();
  const isGetPermissionSuccess = useMemo(() => {
    return statusFetch.CollaboratorsFetchStatus === "succeeded" && statusFetch.GeneralAccessFetchStatus === "succeeded";
  }, [statusFetch]);

  const { closeModal, isModalVisible } = useHandleFolderAccessModal(isGetPermissionSuccess);

  const { isMobileDevice } = useGetClientScreenWidth();
  return isMobileDevice ? (
    <MobileMainLayoutWithOverlayLoading
      opacity={0.7}
      showLoading={isMobileMoveLoading}
      zIndex={40}
      showAddButton={showAddButton}
      withBreadcrumb={withBreadcrumb}
      withFooter={withFooter}
      showPasteButton={showPasteButton}
    >
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
    </MobileMainLayoutWithOverlayLoading>
  ) : (
    <DektopMainLayoutWithOverlayLoading
      opacity={0.7}
      showLoading={isDektopMoveLoading}
      zIndex={40}
      withBreadcrumb={withBreadcrumb}
      withFooter={withFooter}
    >
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
    </DektopMainLayoutWithOverlayLoading>
  );
};

export default MainLayout;
