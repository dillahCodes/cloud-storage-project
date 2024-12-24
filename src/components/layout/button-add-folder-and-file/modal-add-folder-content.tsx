import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import Button from "@components/ui/button";
import { Flex, Input, Typography } from "antd";

interface ModalAddFolderContentProps {
  onCancel: () => void;
  handleSetFolderName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  folderName: string;
  handleConfirmAddFolder: () => void;
}

const { Text } = Typography;
const ModalAddFolderContent: React.FC<ModalAddFolderContentProps> = ({
  onCancel,
  handleSetFolderName,
  folderName,
  handleConfirmAddFolder,
}) => {
  return (
    <Flex className="w-full" gap="middle" vertical>
      <Text className="capitalize text-base font-archivo font-bold">New Folder</Text>
      <Input
        className="w-full border-2 border-black rounded-sm"
        name="folderName"
        type="text"
        placeholder="Folder Name"
        size="large"
        value={folderName}
        onChange={handleSetFolderName}
        style={neoBrutalBorderVariants.medium}
        required
      />
      <Flex gap="middle" className="ml-auto">
        <Button size="large" className="text-black font-archivo rounded-sm" neoBrutalType="medium" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleConfirmAddFolder}
          // onClick={() => handleConfirmAddFolder({ parentFolderId: folderId })}
          size="large"
          className="text-black font-archivo rounded-sm"
          neoBrutalType="medium"
          // disabled={addFolderStatus.status === "loading"}
        >
          Create
        </Button>
      </Flex>
    </Flex>
  );
};

export default ModalAddFolderContent;
