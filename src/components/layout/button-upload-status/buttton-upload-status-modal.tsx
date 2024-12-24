import withModal from "@components/hoc/with-modal";
import ButtonUploadStatus from "./button-upload-status";
import useFileUploading from "@/features/file/hooks/use-file-uploading";
import ModalStatusUploadContent from "./modal-status-upload-content";

const ButtonUploadStatusWithModal = withModal(ButtonUploadStatus);

const ButtonUploadStatusModal: React.FC = () => {
  const { fileUploadingState } = useFileUploading();
  return <ButtonUploadStatusWithModal modalContent={<ModalStatusUploadContent />} notifCount={fileUploadingState.fileUploadingList.length} />;
};

export default ButtonUploadStatusModal;
