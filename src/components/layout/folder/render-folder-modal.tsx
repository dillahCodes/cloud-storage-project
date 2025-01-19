import { folderOptionsSelector, setFolderOptionsAction } from "@/features/folder/slice/folder-options-slice";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ModalContentDeleteFolder from "./modal-content-delete-folder";
import ModalContentRenameFolder from "./modal-content-rename-folder";

const RenderFolderModal = () => {
  const dispatch = useDispatch();
  const { actionSelected, selectedFolderData } = useSelector(folderOptionsSelector);

  const handleCloseModal = () => dispatch(setFolderOptionsAction(null));
  const renderModal = () => {
    if (!selectedFolderData) return <div>{actionSelected}</div>;

    switch (actionSelected) {
      case "delete":
        return <ModalContentDeleteFolder folderData={selectedFolderData} />;

      case "rename":
        return <ModalContentRenameFolder folderData={selectedFolderData} />;

      default:
        return <div>{actionSelected}</div>;
    }
  };

  return (
    <Modal
      open={!!actionSelected}
      onCancel={handleCloseModal}
      footer={null}
      closeIcon={null}
      styles={{
        content: neoBrutalBorderVariants.small,
      }}
      classNames={{
        content: "p-3 rounded-md bg-[#fff1ff]",
      }}
    >
      {renderModal()}
    </Modal>
  );
};

export default RenderFolderModal;
