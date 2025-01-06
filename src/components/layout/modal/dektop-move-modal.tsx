import { closeModal, dekstopMoveSelector } from "@/features/move-folder-or-file/slice/dekstop-move-slice";
import { Flex, Modal, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import DektopMoveFooterModalContent from "./dekstop-move-footer-modal-content";
import DektopMoveMappingFoldersAndFilesContent from "./dekstop-move-mapping-folders-and-files-modal-content";
import DektopMoveCurrentLocationModalContent from "./dektop-move-current-location-modal-content";
import useGetFodlersDektopMoveFolderOrFile from "@/features/move-folder-or-file/hooks/use-get-folders-dektop-move-folder-or-file";
import useGetParentFolderDataMoveFolderOrFileDekstop from "@/features/move-folder-or-file/hooks/use-get-parent-folder-dekstop-move-folder-or-file";
import DekstopMoveBackButtonModalContent from "./dekstop-move-back-button-modal-content";
import useDekstopMoveValidation from "@/features/move-folder-or-file/hooks/use-desktop-move-validation";
import useGetFilesDekstopMoveFolderOrFile from "@/features/move-folder-or-file/hooks/use-get-files-dekstop-move-folder-or-file";

const { Text } = Typography;
const DektopMoveModal = () => {
  /**
   * state and dispatch hooks
   */
  const dispatch = useDispatch();
  const { isModalOpen, folderName, parentFolderId } = useSelector(dekstopMoveSelector);

  /**
   * validation move button
   */
  useDekstopMoveValidation();

  /**
   * fetch folders data
   */
  useGetFodlersDektopMoveFolderOrFile({ shouldFetch: isModalOpen });

  /**
   * fetch files data
   */
  useGetFilesDekstopMoveFolderOrFile({ shouldFetch: isModalOpen });

  /**
   * fetch parent folder data
   */
  useGetParentFolderDataMoveFolderOrFileDekstop({ shouldFetch: isModalOpen });

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

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
        <Text className="font-archivo font-bold text-lg ">Move "{folderName}"</Text>
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
