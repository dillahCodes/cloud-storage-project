import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Modal } from "antd";
import React, { useState, useEffect } from "react";

interface WithModalProps {
  modalContent: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

const withModal = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent: React.FC<P & WithModalProps> = ({ modalContent, isOpen, onClose, onOpen, ...props }) => {
    const [isModalVisible, setIsModalVisible] = useState(isOpen || false);

    const handleOpenModal = () => (onOpen ? onOpen() : setIsModalVisible(true));
    const handleCloseModal = () => (onClose ? onClose() : setIsModalVisible(false));

    useEffect(() => {
      setIsModalVisible(isOpen || false);
    }, [isOpen]);

    return (
      <>
        <div onClick={handleOpenModal}>
          <Component {...(props as P)} />
        </div>

        <Modal
          open={isModalVisible}
          footer={null}
          onCancel={handleCloseModal}
          destroyOnClose={true}
          closeIcon={null}
          className="rounded-md"
          styles={{
            content: {
              borderRadius: "6px",
              backgroundColor: themeColors.primary300,
              padding: "12px",
              ...neoBrutalBorderVariants.medium,
            },
          }}
        >
          {modalContent}
        </Modal>
      </>
    );
  };

  return WrappedComponent;
};

export default withModal;
