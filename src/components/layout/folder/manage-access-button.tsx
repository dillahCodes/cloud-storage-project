import useModalManageAccessContentSetState from "@/features/folder/hooks/use-modal-manage-access-content-setstate";
import useModalManageAccessContentState from "@/features/folder/hooks/use-modal-manage-access-content-state";
import { resetCollaboratorsState } from "@/features/folder/slice/modal-add-selected-collaborators";
import withModal from "@components/hoc/with-modal";
import Button from "@components/ui/button";
import { Typography } from "antd";
import { GrGlobe } from "react-icons/gr";
import { useDispatch } from "react-redux";
import AddCollaboratorsModalComponent from "./add-collaborators-modal-component";
import ManageAccessModalComponent from "./manage-access-modal";

interface ManageAccessButtonProps {
  disabledButton?: boolean;
}

const ButtonWithModal = withModal(Button);
const { Text } = Typography;

const ManageAccessButton: React.FC<ManageAccessButtonProps> = ({ disabledButton }) => {
  const dispatch = useDispatch();

  const { contentWillRender, isModalManageAccessOpen } = useModalManageAccessContentState();
  const { setModalContentWillRender } = useModalManageAccessContentSetState({});

  const { setModalOpen } = useModalManageAccessContentSetState({});

  const handleCloseModal = () => {
    setModalOpen(false);
    dispatch(resetCollaboratorsState());

    /**
     * wait after animation to change state
     */
    setTimeout(() => {
      setModalContentWillRender("manage-access");
    }, 500);
  };
  const handleOpenModal = () => setModalOpen(true);

  const renderModalContent = () => {
    switch (contentWillRender) {
      case "manage-access":
        return <ManageAccessModalComponent />;

      case "add-persons":
        return <AddCollaboratorsModalComponent />;

      default:
        return null;
    }
  };

  return (
    <ButtonWithModal
      isOpen={isModalManageAccessOpen}
      onClose={handleCloseModal}
      onClick={handleOpenModal}
      disabled={disabledButton}
      modalContent={renderModalContent()}
      type="primary"
      className="w-fit text-black"
      icon={<GrGlobe />}
    >
      <Text className="text-md font-archivo capitalize">manage access</Text>
    </ButtonWithModal>
  );
};

export default ManageAccessButton;
