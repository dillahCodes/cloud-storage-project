import { dekstopMoveSelector } from "@/features/move-folder-or-file/slice/dekstop-move-slice";
import { mobileMoveSelector } from "@/features/move-folder-or-file/slice/mobile-move-slice";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import ModalFolderPermissionDenied from "../modal/modal-folder-permission-denied";
import { DektopMainLayoutWithOverlayLoading } from "./desktop-main-layout";
import { MobileMainLayoutWithOverlayLoading } from "./mobile-main-layout";
import FolderOrFileFindOverlay from "../folder-or-file-overlay/folder-or-file-find-overlay";
import { Analytics } from "@vercel/analytics/react";

export interface MainLayoutProps {
  children: React.ReactNode;
  showAddButton: boolean;
  showPasteButton: boolean;
  withFooter?: boolean;
  withBreadcrumb?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showAddButton,
  withFooter,
  withBreadcrumb = true,
  showPasteButton,
}) => {
  const { fileId: mobileMoveFileId, moveStatus: mobileMoveStatus } = useSelector(mobileMoveSelector);
  const isMoveFile = useMemo(() => mobileMoveFileId !== null, [mobileMoveFileId]);
  const isMobileMoveLoading = useMemo(() => mobileMoveStatus === "loading", [mobileMoveStatus]);

  const { fileId: dekstopMoveFileId, dekstopMoveStatus } = useSelector(dekstopMoveSelector);
  const isDekstopMoveFile = useMemo(() => dekstopMoveFileId !== null, [dekstopMoveFileId]);
  const isDektopMoveLoading = useMemo(() => dekstopMoveStatus === "loading", [dekstopMoveStatus]);

  // move message
  const renderMobileMoveMessage = useMemo(() => (isMoveFile ? "Moving File..." : "Moving Folder..."), [isMoveFile]);
  const renderDektopMoveMessage = useMemo(() => (isDekstopMoveFile ? "Moving File..." : "Moving Folder..."), [isDekstopMoveFile]);

  const { isMobileDevice, isTabletDevice } = useGetClientScreenWidth();

  return (
    <>
      {isMobileDevice || isTabletDevice ? (
        <MobileMainLayoutWithOverlayLoading
          loadingText={renderMobileMoveMessage}
          opacity={0.7}
          showLoading={isMobileMoveLoading}
          zIndex={40}
          showAddButton={showAddButton}
          withBreadcrumb={withBreadcrumb}
          withFooter={withFooter}
          showPasteButton={showPasteButton}
        >
          <ModalFolderPermissionDenied />
          <FolderOrFileFindOverlay />
          {children}
          <Analytics />
        </MobileMainLayoutWithOverlayLoading>
      ) : (
        <DektopMainLayoutWithOverlayLoading
          loadingText={renderDektopMoveMessage}
          opacity={0.7}
          showLoading={isDektopMoveLoading}
          zIndex={40}
          withBreadcrumb={withBreadcrumb}
          withFooter={withFooter}
        >
          <ModalFolderPermissionDenied />
          <FolderOrFileFindOverlay />
          {children}
          <Analytics />
        </DektopMainLayoutWithOverlayLoading>
      )}
    </>
  );
};

export default MainLayout;
