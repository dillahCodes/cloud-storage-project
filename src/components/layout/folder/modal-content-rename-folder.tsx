import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import useChangeFolderName from "@/features/folder/hooks/use-change-folder-name";
import { resetFolderOptions, setFolderOptionsAction } from "@/features/folder/slice/folder-options-slice";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import Button from "@components/ui/button";
import { Flex, Input, Typography } from "antd";
import { LuPenLine } from "react-icons/lu";
import { useDispatch } from "react-redux";

const { Text } = Typography;
interface ModalContentRenameFolderProps {
  folderData: RootFolderGetData | SubFolderGetData;
}
const ModalContentRenameFolder: React.FC<ModalContentRenameFolderProps> = ({ folderData }) => {
  const dispatch = useDispatch();
  const { handleInputChange, newFolderNameValue, handleConfirmChangeFolderName } = useChangeFolderName(folderData);

  const handleCloseModal = () => dispatch(setFolderOptionsAction(null));
  const handleConfirm = () => {
    dispatch(resetFolderOptions());
    handleConfirmChangeFolderName();
  };

  return (
    <Flex className="w-full" vertical gap="middle">
      {/* title */}
      <Flex align="center" gap="small">
        <Text className="font-bold font-archivo">Rename Folder</Text>
        <Text className="font-bold font-archivo">
          <LuPenLine />
        </Text>
      </Flex>

      {/* input */}
      <Input
        className="w-full min-w-full  border-2 border-black rounded-sm max-w-xs placeholder:font-archivo"
        placeholder="Enter New Folder Name"
        type="text"
        size="large"
        name="change-folder-name"
        value={newFolderNameValue}
        onChange={handleInputChange}
        style={neoBrutalBorderVariants.medium}
      />

      {/* button */}
      <Flex align="center" gap="small" className="ml-auto">
        <Button className="w-fit rounded-sm text-black font-archivo" neoBrutalType="medium" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          type="primary"
          disabled={!newFolderNameValue || newFolderNameValue === folderData.folder_name}
          onClick={handleConfirm}
          className="w-fit rounded-sm text-black font-archivo"
          neoBrutalType="medium"
        >
          Confirm
        </Button>
      </Flex>
    </Flex>
  );
};

export default ModalContentRenameFolder;
