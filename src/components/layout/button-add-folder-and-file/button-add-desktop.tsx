import useAddFile from "@/features/file/hooks/use-add-file";
import useAddFolder from "@/features/folder/hooks/use-add-folder";
import { parentFolderSelector } from "@/features/folder/slice/parent-folder-slice";
import withModal from "@components/hoc/with-modal";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { useCallback, useMemo, useState } from "react";
import { RiFolderAddLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import ModalAddContent from "./modal-add-content";
import ModalAddFolderContent from "./modal-add-folder-content";

interface ButtonWithModalProps {
  showText?: boolean;
}

const { Text } = Typography;
const ButtonWithModal = withModal(Button);

const ButtonAddDesktop: React.FC<ButtonWithModalProps> = ({ showText = false }) => {
  const parentFolderState = useSelector(parentFolderSelector);

  const { folderName, handleSetFolderName, handleConfirmAddFolder } = useAddFolder();
  const { handleSetAndUploadFile } = useAddFile();

  const [modalStatus, setModalStatus] = useState<ModalStatus>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Handle open/close modal
  const toggleModalOpen = useCallback(() => {
    setModalOpen((prev) => !prev);
  }, []);

  const closeModalWithDelay = useCallback(() => {
    setTimeout(() => setModalStatus(null), 500);
    toggleModalOpen();
  }, [toggleModalOpen]);

  // Handle actions after folder is added
  const handleAfterAddFolder = useCallback(() => {
    toggleModalOpen();
    setTimeout(() => setModalStatus(null), 500);
  }, [toggleModalOpen]);

  const handleOnCancelAddFolder = useCallback(() => {
    setModalStatus(null);
  }, []);

  // Render modal content based on modalStatus
  const renderModalContent = useMemo(() => {
    if (modalStatus === "add-folder") {
      return (
        <ModalAddFolderContent
          onCancel={handleOnCancelAddFolder}
          handleSetFolderName={handleSetFolderName}
          folderName={folderName}
          handleConfirmAddFolder={() =>
            handleConfirmAddFolder({
              parentFolderData: parentFolderState.parentFolderData,
              afterAddFolder: handleAfterAddFolder,
            })
          }
        />
      );
    }

    return <ModalAddContent setModalStatus={setModalStatus} setFile={handleSetAndUploadFile} />;
  }, [
    folderName,
    handleAfterAddFolder,
    handleConfirmAddFolder,
    handleOnCancelAddFolder,
    handleSetAndUploadFile,
    handleSetFolderName,
    modalStatus,
    parentFolderState.parentFolderData,
  ]);

  return (
    <ButtonWithModal
      type="primary"
      neoBrutalType="medium"
      size="large"
      className="h-[45px]"
      isOpen={modalOpen}
      onClose={closeModalWithDelay}
      onOpen={toggleModalOpen}
      modalContent={renderModalContent}
    >
      <Flex align="center" gap="middle" className="rounded-md w-full">
        <Text className="text-lg">
          <RiFolderAddLine />
        </Text>
        {showText && <Text className="capitalize text-base font-archivo">Add</Text>}
      </Flex>
    </ButtonWithModal>
  );
};

export default ButtonAddDesktop;
