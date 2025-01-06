import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { mobileMoveSelector } from "@/features/move-folder-or-file/slice/mobile-move-slice";
import { moveFoldersAndFilesDataSelector } from "@/features/move-folder-or-file/slice/move-folders-and-files-data-slice";
import FileIconsVariant from "@components/layout/file/file-icons-variant";
import Button from "@components/ui/button";
import { Flex, Spin } from "antd";
import { useMemo } from "react";
import { BsDatabase } from "react-icons/bs";
import { IoIosArrowForward, IoMdFolderOpen } from "react-icons/io";
import { useSelector } from "react-redux";

const MoveButtonInfo = () => {
  const { fileName, folderName, fileType } = useSelector(mobileMoveSelector);
  const { parentFolderData, parentFolderStatus } = useSelector(moveFoldersAndFilesDataSelector);

  const activeMove = useMemo((): ActiveMove => {
    if (fileName) return { type: "file", name: fileName, fileType };
    if (folderName) return { type: "folder", name: folderName };
    return null;
  }, [fileName, folderName, fileType]);

  const isLoading = useMemo(() => parentFolderStatus === "loading", [parentFolderStatus]);

  return (
    <Flex className="w-full p-3 py-4" gap="small">
      <RenderActiveMove activeMove={activeMove} />
      <Button type="primary" size="small" className="font-archivo text-black rounded-sm" icon={<IoIosArrowForward />} />
      {isLoading ? <Spin /> : <RenderTargetFolder parentFolderData={parentFolderData} />}
    </Flex>
  );
};

export default MoveButtonInfo;

const RenderTargetFolder: React.FC<{ parentFolderData: RootFolderGetData | SubFolderGetData | null }> = ({ parentFolderData }) => {
  return (
    <Button type="primary" size="small" className="font-archivo text-black rounded-sm" icon={parentFolderData ? <IoMdFolderOpen /> : <BsDatabase />}>
      {parentFolderData?.folder_name || "My Storage"}
    </Button>
  );
};

type ActiveMove = { type: "file"; name: string; fileType: string | null } | { type: "folder"; name: string } | null;
const RenderActiveMove: React.FC<{ activeMove: ActiveMove }> = ({ activeMove }) => {
  return (
    <Button
      type="primary"
      size="small"
      className="font-archivo text-black rounded-sm"
      icon={activeMove?.type === "file" ? <FileIconsVariant fileType={activeMove.fileType as string} /> : <IoMdFolderOpen />}
    >
      {activeMove?.name}
    </Button>
  );
};
