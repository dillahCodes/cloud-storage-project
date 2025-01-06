import withModal from "@components/hoc/with-modal";
import { useMemo, useState } from "react";
import ButtonMove from "./button-move";
import { Flex, Typography } from "antd";
import { mobileMoveSelector } from "@/features/move-folder-or-file/slice/mobile-move-slice";
import { useSelector } from "react-redux";
import { moveFoldersAndFilesDataSelector } from "@/features/move-folder-or-file/slice/move-folders-and-files-data-slice";
import { LuFolderOutput } from "react-icons/lu";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import Button from "@components/ui/button";
import useConfirmMobileMoveFolder from "@/features/move-folder-or-file/hooks/use-confirm-mobile-move-folder";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import useConfirmMobileMoveFile from "@/features/move-folder-or-file/hooks/use-confirm-mobile-move-file";

const ButtonWithModal = withModal(ButtonMove);

const ButtonMoveWithModal = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <ButtonWithModal
      isOpen={isModalOpen}
      onOpen={handleOpenModal}
      onClose={handleCloseModal}
      modalContent={<ModalMoveContent onClose={handleCloseModal} onMove={handleCloseModal} />}
    />
  );
};

export default ButtonMoveWithModal;

interface ModalMoveContentProps {
  onClose: () => void;
  onMove: () => void;
}
type ActiveMove = { type: "file"; name: string; fileType: string | null } | { type: "folder"; name: string } | null;

const { Text } = Typography;
const ModalMoveContent: React.FC<ModalMoveContentProps> = ({ onClose, onMove }) => {
  const { isMobileDevice } = useGetClientScreenWidth();

  const { fileName, folderName, fileType } = useSelector(mobileMoveSelector);
  const { parentFolderData } = useSelector(moveFoldersAndFilesDataSelector);

  const { confirmMobileMoveFolder } = useConfirmMobileMoveFolder();
  const { confirmMoveFile } = useConfirmMobileMoveFile();

  const activeMove = useMemo((): ActiveMove => {
    if (fileName) return { type: "file", name: fileName, fileType };
    if (folderName) return { type: "folder", name: folderName };
    return null;
  }, [fileName, folderName, fileType]);

  const handleMove = () => {
    if (!isMobileDevice) return;
    activeMove?.type === "folder" ? confirmMobileMoveFolder() : confirmMoveFile();
    onMove();
  };

  return (
    <Flex className="w-full" vertical gap="small">
      {activeMove && (
        <Flex align="center" gap="middle">
          {/* icon modal */}
          <Text className="text-3xl p-2 bg-[#FFD3E0] rounded-sm border-black border-2" style={neoBrutalBorderVariants.small}>
            <LuFolderOutput />
          </Text>
          {/* text modal */}
          <Flex gap={4} vertical>
            <Text className="font-archivo font-bold text-base">Confirm Move</Text>
            <Text className="font-archivo text-sm">
              The {activeMove.type === "file" ? "file" : "folder"} <strong>{activeMove.name}</strong> will be moved to{" "}
              <strong>{parentFolderData?.folder_name || "My Storage"}</strong>.
            </Text>
          </Flex>
        </Flex>
      )}
      {/* modal footer */}
      <Flex className="w-full mt-4" justify="end" align="center" gap="small">
        <Button className="font-archivo text-black rounded-sm capitalize" onClick={onClose}>
          cancel
        </Button>
        <Button type="primary" className="font-archivo text-black capitalize rounded-sm" onClick={handleMove}>
          confirm
        </Button>
      </Flex>
    </Flex>
  );
};
