import withModal from "@components/hoc/with-modal";
import Button from "@components/ui/button";
import { memo, useState } from "react";
import { RiFolderAddLine } from "react-icons/ri";
import ModalAddContent from "./modal-add-content";
import ModalAddFolderContent from "./modal-add-folder-content";
import useAddFolder from "@/features/folder/hooks/use-add-folder";
import { useParams } from "react-router-dom";
import useShowFloatingNotification from "@/features/folder/hooks/use-show-floating-notification";
import useAddFile from "@/features/file/hooks/use-add-file";
import useParentFolder from "@/features/folder/hooks/use-parent-folder";

const ButtonWithModal = withModal(Button);
const ButtonAddMobile: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();

  const { parentFolderState } = useParentFolder({
    fetchParentFolderDataOnMount: false,
    resetParentFolderDataOnMount: false,
    folderId,
  });
  const { folderName, handleSetFolderName, handleConfirmAddFolder, addFolderStatus } = useAddFolder();
  const { floatingNotificationContext } = useShowFloatingNotification(addFolderStatus, "bottomLeft", false);

  const { handleSetAndUploadFile } = useAddFile({ parent_folder_id: folderId });

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
    <>
      {floatingNotificationContext}
      <ButtonWithModal
        modalContent={
          modalStatus === "add-folder" ? (
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
          ) : (
            <ModalAddContent setModalStatus={setModalStatus} setFile={handleSetAndUploadFile} />
          )
        }
        isOpen={modalOpen}
        onClose={handleOnCloseModal}
        onOpen={handleOnOpenModal}
        neoBrutalType="medium"
        size="large"
        className="text-black font-archivo rounded-sm fixed bottom-4 right-4 z-10  bg-[#fff1ff] p-7"
        icon={<RiFolderAddLine className="text-2xl" />}
      />
    </>
  );
};

export default memo(ButtonAddMobile);
