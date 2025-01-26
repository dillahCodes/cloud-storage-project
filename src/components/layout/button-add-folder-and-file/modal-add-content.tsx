import { parentFolderPermissionSelector } from "@/features/permissions/slice/parent-folder-permission";
import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { useMemo, useRef } from "react";
import { RiFileAddLine, RiFolderAddLine } from "react-icons/ri";
import { useSelector } from "react-redux";

interface ModalAddContentProps {
  setModalStatus: React.Dispatch<React.SetStateAction<ModalStatus>>;
  setFile: () => void;
}

const { Text } = Typography;
const ModalAddContent: React.FC<ModalAddContentProps> = ({ setModalStatus, setFile }) => {
  const fileButtonRef = useRef(null);

  const { actionPermissions, permissionsDetails } = useSelector(parentFolderPermissionSelector);

  const isHavePermission = useMemo(() => {
    return !permissionsDetails.isSubFolderLocation || (permissionsDetails.isSubFolderLocation && actionPermissions.canCRUD);
  }, [permissionsDetails.isSubFolderLocation, actionPermissions.canCRUD]);

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
          description={<Text className="font-archivo text-sm">You don't have permission to add folder or file in this folder.</Text>}
          type="warning"
          showIcon
        />
      )}
    </Flex>
  );
};

export default ModalAddContent;
