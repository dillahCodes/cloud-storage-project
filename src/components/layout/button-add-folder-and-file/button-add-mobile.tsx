import useAddFile from "@/features/file/hooks/use-add-file";
import useAddFolder from "@/features/folder/hooks/use-add-folder";
import { parentFolderSelector } from "@/features/folder/slice/parent-folder-slice";
import withModal from "@components/hoc/with-modal";
import Button from "@components/ui/button";
import { memo, useState } from "react";
import { RiFolderAddLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import ModalAddContent from "./modal-add-content";
import ModalAddFolderContent from "./modal-add-folder-content";

const ButtonWithModal = withModal(Button);
const ButtonAddMobile: React.FC = () => {
  const parentFolderState = useSelector(parentFolderSelector);
  const { folderName, handleSetFolderName, handleConfirmAddFolder } = useAddFolder();

  const { handleSetAndUploadFile } = useAddFile();

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

  const renderModalContent = () => {
    switch (modalStatus) {
      case "add-folder":
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
      default:
        return <ModalAddContent setModalStatus={setModalStatus} setFile={handleSetAndUploadFile} />;
    }
  };

  return (
    <ButtonWithModal
      modalContent={renderModalContent()}
      isOpen={modalOpen}
      onClose={handleOnCloseModal}
      onOpen={handleOnOpenModal}
      neoBrutalType="medium"
      size="large"
      className="text-black font-archivo rounded-sm border-2 bg-[#fff1ff] p-7"
      icon={
        <div className="animate-wiggle animate-infinite animate-duration-[5000ms] animate-ease-in animate-fill-both text-3xl">
          <RiFolderAddLine className="text-3xl" />
        </div>
      }
    />
  );
};

export default memo(ButtonAddMobile);
