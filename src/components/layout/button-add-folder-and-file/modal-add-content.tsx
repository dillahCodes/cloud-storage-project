import useFolderPermissionState from "@/features/folder/hooks/use-folder-permission-state";
import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { useRef } from "react";
import { RiFileAddLine, RiFolderAddLine } from "react-icons/ri";

interface ModalAddContentProps {
  setModalStatus: React.Dispatch<React.SetStateAction<ModalStatus>>;
  setFile: () => void;
}

const { Text } = Typography;
const ModalAddContent: React.FC<ModalAddContentProps> = ({ setModalStatus, setFile }) => {
  const fileButtonRef = useRef(null);

  const { subFolderPermission, isRootFolder } = useFolderPermissionState();

  const isHavePermission = isRootFolder || subFolderPermission.canCRUD;

  return (
    <Flex className="w-full" gap="middle" wrap>
      {isHavePermission ? (
        <>
          <Button
            type="primary"
            size="large"
            className="text-black font-archivo rounded-sm"
            onClick={() => setModalStatus("add-folder")}
            icon={<RiFolderAddLine />}
            neoBrutalType="medium"
          >
            New Folder
          </Button>
          <Button
            onClick={setFile}
            ref={fileButtonRef}
            type="primary"
            size="large"
            className="text-black font-archivo rounded-sm"
            neoBrutalType="medium"
            icon={<RiFileAddLine />}
          >
            Upload File
          </Button>
        </>
      ) : (
        <Alert
          className="w-full"
          neoBrutalVariants="medium"
          message={<Text className="font-archivo text-base font-medium">Restricted Access</Text>}
          description={
            <Text className="font-archivo text-sm">
              You don't have permission to add folder or file in this folder.
            </Text>
          }
          type="warning"
          showIcon
        />
      )}
    </Flex>
  );
};

export default ModalAddContent;
