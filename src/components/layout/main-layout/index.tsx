import { dekstopMoveSelector } from "@/features/move-folder-or-file/slice/dekstop-move-slice";
import { mobileMoveSelector } from "@/features/move-folder-or-file/slice/mobile-move-slice";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import ModalFolderPermissionDenied from "../modal/modal-folder-permission-denied";
import { DektopMainLayoutWithOverlayLoading } from "./desktop-main-layout";
import { MobileMainLayoutWithOverlayLoading } from "./mobile-main-layout";

export interface MainLayoutProps {
  children: React.ReactNode;
  showAddButton: boolean;
  showPasteButton: boolean;
  withFooter?: boolean;
  withBreadcrumb?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showAddButton, withFooter, withBreadcrumb = true, showPasteButton }) => {
  const moveMobileSelector = useSelector(mobileMoveSelector);
  const isMoveFile = useMemo(() => !!moveMobileSelector.fileId, [moveMobileSelector.fileId]);
  const isMobileMoveLoading = useMemo(() => moveMobileSelector.moveStatus === "loading", [moveMobileSelector.moveStatus]);

  const moveDektopSelector = useSelector(dekstopMoveSelector);
  const isDekstopMoveFile = useMemo(() => !!moveDektopSelector.fileId, [moveDektopSelector.fileId]);
  const isDektopMoveLoading = useMemo(() => moveDektopSelector.dekstopMoveStatus === "loading", [moveDektopSelector.dekstopMoveStatus]);

  const renderMobileMoveMessage = useMemo(() => (isMoveFile ? "Moving File..." : "Moving Folder..."), [isMoveFile]);
  const renderDektopMoveMessage = useMemo(() => (isDekstopMoveFile ? "Moving File..." : "Moving Folder..."), [isDekstopMoveFile]);

  const { isMobileDevice } = useGetClientScreenWidth();

  return isMobileDevice ? (
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
      {children}
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
      {children}
    </DektopMainLayoutWithOverlayLoading>
  );
};

export default MainLayout;
