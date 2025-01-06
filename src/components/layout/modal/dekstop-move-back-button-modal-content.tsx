import { setMoveParentFolderId } from "@/features/move-folder-or-file/slice/dekstop-move-slice";
import { moveFoldersAndFilesDataSelector } from "@/features/move-folder-or-file/slice/move-folders-and-files-data-slice";
import Button from "@components/ui/button";
import { Flex, Spin, Typography } from "antd";
import { IoArrowBackSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const { Text } = Typography;
const DekstopMoveBackButtonModalContent: React.FC = () => {
  const dispatch = useDispatch();
  const { parentFolderData, parentFolderStatus } = useSelector(moveFoldersAndFilesDataSelector);

  const handleBackToPreviousFolder = () => dispatch(setMoveParentFolderId(parentFolderData?.parent_folder_id ?? null));

  if (parentFolderStatus === "loading") return <Spin />;

  return (
    <Flex align="center" gap="middle">
      <Button type="primary" icon={<IoArrowBackSharp className="text-lg text-black" />} onClick={handleBackToPreviousFolder} />
      <Text className=" font-archivo text-base">{parentFolderData?.folder_name}</Text>
    </Flex>
  );
};

export default DekstopMoveBackButtonModalContent;
