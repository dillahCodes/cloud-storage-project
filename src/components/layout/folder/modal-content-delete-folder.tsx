import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import useDeleteFolder from "@/features/folder/hooks/use-delete-folder";
import { resetFolderOptions, setFolderOptionsAction } from "@/features/folder/slice/folder-options-slice";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { LuTrash } from "react-icons/lu";
import { useDispatch } from "react-redux";

const { Text } = Typography;
interface ModalContentDeleteFolderProps {
  folderData: RootFolderGetData | SubFolderGetData;
}
const ModalContentDeleteFolder: React.FC<ModalContentDeleteFolderProps> = ({ folderData }) => {
  const dispatch = useDispatch();
  const { handleConfirmDeleteFolder } = useDeleteFolder(folderData);

  const handleCloseModal = () => dispatch(setFolderOptionsAction(null));

  const handleConfirmModal = () => {
    handleConfirmDeleteFolder();
    dispatch(resetFolderOptions());
  };

  return (
    <Flex className="w-full" vertical gap="small">
      {/* title */}
      <Flex align="center" gap="small">
        <Text className="font-bold font-archivo">Delete Folder</Text>
        <Text className="font-bold font-archivo">
          <LuTrash />
        </Text>
      </Flex>

      <Text className="font-archivo max-w-[95%] line-clamp-2">
        Are you sure you want to delete this folder? "{folderData.folder_name}" will be permanently deleted.
      </Text>

      {/* button */}
      <Flex align="center" gap="small" className="ml-auto">
        <Button className="w-fit rounded-sm text-black font-archivo" neoBrutalType="medium" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button type="primary" className="w-fit rounded-sm text-black font-archivo" neoBrutalType="medium" onClick={handleConfirmModal}>
          Confirm
        </Button>
      </Flex>
    </Flex>
  );
};

export default ModalContentDeleteFolder;
