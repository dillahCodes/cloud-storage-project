import useDekstopMoveValidation from "@/features/move-folder-or-file/hooks/use-desktop-move-validation";
import useGetDektopMovePermissionFolder from "@/features/move-folder-or-file/hooks/use-get-dektop-move-permission-folder";
import useGetFilesDekstopMoveFolderOrFile from "@/features/move-folder-or-file/hooks/use-get-files-dekstop-move-folder-or-file";
import useGetFodlersDektopMoveFolderOrFile from "@/features/move-folder-or-file/hooks/use-get-folders-dektop-move-folder-or-file";
import useGetParentFolderDataMoveFolderOrFileDekstop from "@/features/move-folder-or-file/hooks/use-get-parent-folder-dekstop-move-folder-or-file";
import { dekstopMoveSelector, resetDektopMoveState } from "@/features/move-folder-or-file/slice/dekstop-move-slice";
import useDetectLocation from "@/hooks/use-detect-location";
import abbreviateText from "@/util/abbreviate-text";
import { Flex, Modal, Typography } from "antd";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DekstopMoveBackButtonModalContent from "./dekstop-move-back-button-modal-content";
import DektopMoveFooterModalContent from "./dekstop-move-footer-modal-content";
import DektopMoveMappingFoldersAndFilesContent from "./dekstop-move-mapping-folders-and-files-modal-content";
import DektopMoveCurrentLocationModalContent from "./dektop-move-current-location-modal-content";

const { Text } = Typography;
const DektopMoveModal = () => {
  const { isMystorageLocation } = useDetectLocation();
  /**
   * state and dispatch hooks
   */
  const dispatch = useDispatch();
  const { isModalOpen, folderName, parentFolderId, fileName } = useSelector(dekstopMoveSelector);
  const isMoveFile = useMemo(() => Boolean(fileName), [fileName]);

  /**
   * validation move button
   */
  useDekstopMoveValidation();

  /**
   * get permission
   */
  const { isGetPermissionSuccess } = useGetDektopMovePermissionFolder();

  /**
   * fetch parent folder data
   */
  const shouldFetchParentFolder = useMemo(() => isModalOpen || (isModalOpen && !isMystorageLocation), [isModalOpen, isMystorageLocation]);
  useGetParentFolderDataMoveFolderOrFileDekstop({ shouldFetch: shouldFetchParentFolder });

  /**
   * fetch folders data
   */
  const shouldFetchFolders = useMemo(
    () => (isModalOpen && isGetPermissionSuccess) || (isMystorageLocation && isModalOpen),
    [isModalOpen, isGetPermissionSuccess, isMystorageLocation]
  );
  useGetFodlersDektopMoveFolderOrFile({ shouldFetch: shouldFetchFolders });

  /**
   * fetch files data
   */
  const shouldFetchFiles = useMemo(
    () => (isModalOpen && isGetPermissionSuccess) || (isMystorageLocation && isModalOpen),
    [isModalOpen, isGetPermissionSuccess, isMystorageLocation]
  );
  useGetFilesDekstopMoveFolderOrFile({ shouldFetch: shouldFetchFiles });

  const handleCloseModal = () => dispatch(resetDektopMoveState());

  return (
    <Modal
      title={null}
      open={isModalOpen}
      onCancel={handleCloseModal}
      closeIcon={null}
      footer={null}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      {/*
       * TITLE AND CURRENT LOCATION
       */}
      <Flex vertical gap="middle" className="w-full p-3">
        <Text className="font-archivo font-bold text-lg ">
          Move "{isMoveFile ? abbreviateText(fileName as string, 20) : abbreviateText(folderName as string, 20)}"
        </Text>
        <DektopMoveCurrentLocationModalContent />
        {parentFolderId && <DekstopMoveBackButtonModalContent />}
      </Flex>

      {/*
       * MAPPING FOLDERS AND FILES
       */}
      <div className="w-full border border-black" />
      <DektopMoveMappingFoldersAndFilesContent />
      <div className="w-full border border-black" />

      {/*
       * FOOTER MODAL
       */}
      <DektopMoveFooterModalContent />
    </Modal>
  );
};

export default DektopMoveModal;
