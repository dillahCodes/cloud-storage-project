import { fileOptionsSelector, setActiveAction } from "@/features/file/slice/file-options-slice";
import { Modal } from "antd";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalContentDeleteFile from "./modal-content-delete-file";
import ModalContentInfoFile from "./modal-content-info-file";
import ModalContentDowloadFile from "./modal-content-dowload-file";
import ModalContentVisitFile from "./modal-content-visit-file";

const RenderModalFileOptions = () => {
  const dispatch = useDispatch();
  const { activeAction } = useSelector(fileOptionsSelector);

  const handleCloseModal = () => dispatch(setActiveAction(null));

  const modalContent = useMemo(() => {
    switch (activeAction) {
      case "delete":
        return <ModalContentDeleteFile />;
      case "details":
        return <ModalContentInfoFile />;
      case "dowload":
        return <ModalContentDowloadFile />;
      case "visit":
        return <ModalContentVisitFile />;
      default:
        return <p>Invalid action or no content provided.</p>;
    }
  }, [activeAction]);

  if (!activeAction) return null;

  return (
    <Modal
      open={!!activeAction}
      onCancel={handleCloseModal}
      footer={null}
      centered
      closeIcon={null}
      styles={{ content: { padding: "0px", backgroundColor: "transparent" } }}
    >
      {modalContent}
    </Modal>
  );
};

export default RenderModalFileOptions;
