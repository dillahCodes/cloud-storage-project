import { Flex, Layout, Typography } from "antd";
import emptyIlustration from "@assets/File-bundle-amico.svg";
import { RiFolderAddLine } from "react-icons/ri";
import { useMemo } from "react";

const { Text } = Typography;

interface FolderEmptyProps {
  isSharedFolder?: boolean;
  isStarred?: boolean;
  isRecent?: boolean;
  isMoveFolderOrFile?: boolean;
}

const FolderEmpty: React.FC<FolderEmptyProps> = ({ isSharedFolder = false, isStarred = false, isRecent = false, isMoveFolderOrFile = false }) => {
  if ([isSharedFolder, isStarred, isRecent].filter(Boolean).length > 1) {
    throw new Error("Only one of 'isSharedFolder', 'isStarred', or 'isRecent' can be true.");
  }

  const renderText = useMemo(() => {
    const textMapping: { [key: string]: string } = {
      shared: "This shared folder is currently empty. You can ask the owner for the folder link or check back later.",
      starred: "No starred folders yet!",
      recent: "No recent folders yet!",
      isMoveFolderOrFile: "No files or folders yet!",
      default: "No files or folders yet! Start adding by clicking the add button.",
    };

    if (isSharedFolder) return textMapping.shared;
    if (isStarred) return textMapping.starred;
    if (isRecent) return textMapping.recent;
    if (isMoveFolderOrFile) return textMapping.isMoveFolderOrFile;
    return textMapping.default;
  }, [isSharedFolder, isStarred, isRecent, isMoveFolderOrFile]);

  return (
    <Layout className="flex items-center justify-center p-3">
      <Flex vertical className="w-fit mx-auto" align="center" gap="middle">
        <img src={emptyIlustration} alt="empty folder" className="max-w-[200px] mx-auto" />
        <Text className="text-sm text-center font-archivo font-bold">
          <Text>{renderText}</Text>
          {!isSharedFolder && !isStarred && !isRecent && !isMoveFolderOrFile && <RiFolderAddLine className="inline ml-2" />}
        </Text>
      </Flex>
    </Layout>
  );
};

export default FolderEmpty;
