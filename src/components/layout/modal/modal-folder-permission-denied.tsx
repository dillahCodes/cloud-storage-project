import useHandleFolderAccessModal from "@/features/permissions/hooks/use-handle-folder-access-modal";
import { Modal } from "antd";
import MoadlFolderPermissionDenied from "./modal-folder-permission-content-denied";

const ModalFolderPermissionDenied = () => {
  const { closeModal, isModalVisible } = useHandleFolderAccessModal();

  return (
    <Modal
      footer={null}
      closeIcon={null}
      open={isModalVisible}
      onCancel={closeModal}
      styles={{
        content: {
          padding: "16px",
          border: "2px solid",
          boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)",
        },
      }}
    >
      <MoadlFolderPermissionDenied closeModal={closeModal} />
    </Modal>
  );
};
export default ModalFolderPermissionDenied;
