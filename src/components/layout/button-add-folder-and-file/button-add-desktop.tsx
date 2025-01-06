import useAddFolder from "@/features/folder/hooks/use-add-folder";
import useShowFloatingNotification from "@/features/folder/hooks/use-show-floating-notification";
import withModal from "@components/hoc/with-modal";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { useState } from "react";
import { RiFolderAddLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import ModalAddContent from "./modal-add-content";
import ModalAddFolderContent from "./modal-add-folder-content";
import useAddFile from "@/features/file/hooks/use-add-file";
import useParentFolder from "@/features/folder/hooks/use-parent-folder";

interface ButtonWithModalProps {
  showText?: boolean;
}

const { Text } = Typography;
const ButtonWithModal = withModal(Button);

const ButtonAddDesktop: React.FC<ButtonWithModalProps> = ({ showText }) => {
  const { folderId } = useParams<{ folderId: string }>();

  const { parentFolderState } = useParentFolder({ fetchParentFolderDataOnMount: false, resetParentFolderDataOnMount: false, folderId });
  const { folderName, handleSetFolderName, handleConfirmAddFolder, addFolderStatus } = useAddFolder();
  const { floatingNotificationContext } = useShowFloatingNotification(addFolderStatus, "bottomRight", true);

  const { handleSetAndUploadFile } = useAddFile({ parentFolderData: parentFolderState });

  const [modalStatus, setModalStatus] = useState<ModalStatus>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAfterAddFolder = () => {
    setModalOpen((prev) => !prev);
    setTimeout(() => setModalStatus(null), 500);
  };

  const handleOnCancelAddFolder = () => setModalStatus(null);

  const handleOnCloseModal = () => {
    setTimeout(() => setModalStatus(null), 500);
    setModalOpen((prev) => !prev);
  };

  const handleOnOpenModal = () => setModalOpen((prev) => !prev);

  return (
    <ButtonWithModal
      type="primary"
      neoBrutalType="medium"
      size="large"
      className="h-[45px]"
      isOpen={modalOpen}
      onClose={handleOnCloseModal}
      onOpen={handleOnOpenModal}
      modalContent={
        modalStatus === "add-folder" ? (
          <ModalAddFolderContent
            onCancel={handleOnCancelAddFolder}
            handleSetFolderName={handleSetFolderName}
            folderName={folderName}
            handleConfirmAddFolder={() =>
              handleConfirmAddFolder({ parentFolderData: parentFolderState.parentFolderData, afterAddFolder: handleAfterAddFolder })
            }
          />
        ) : (
          <ModalAddContent setModalStatus={setModalStatus} setFile={handleSetAndUploadFile} />
        )
      }
    >
      {floatingNotificationContext}
      <Flex align="center" gap="middle" className="rounded-md w-full">
        <Text className="text-lg">
          <RiFolderAddLine />
        </Text>
        {showText && <Text className="cfloatingNotificationApitalize text-base font-archivo">add</Text>}
      </Flex>
    </ButtonWithModal>
  );
};

export default ButtonAddDesktop;
