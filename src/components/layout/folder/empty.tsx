import { Flex, Layout, Typography } from "antd";
import emptyIlustration from "@assets/File-bundle-amico.svg";
import { RiFolderAddLine } from "react-icons/ri";
import { useMemo } from "react";

const { Text } = Typography;

interface FolderEmptyProps {
  isSharedFolder?: boolean;
  isStarred?: boolean;
}
const FolderEmpty: React.FC<FolderEmptyProps> = ({ isSharedFolder, isStarred }) => {
  const renderText = useMemo(() => {
    if (isSharedFolder && !isStarred)
      return "This shared folder is currently empty. You can ask the owner for the folder link or check back later.";
    else if (isStarred && !isSharedFolder) return "No starred  folders yet!";
    return "No files or folders yet! Start adding by clicking the add button";
  }, [isSharedFolder, isStarred]);

  return (
    <Layout className="flex items-center justify-center p-3">
      <Flex vertical className="w-fit mx-auto" align="center" gap="middle">
        <img src={emptyIlustration} alt="empty folder" className="max-w-[200px] mx-auto" />
        <Text className="text-sm text-center font-archivo font-bold">
          <Text>{renderText}</Text>

          {!isSharedFolder && !isStarred && <RiFolderAddLine className="inline ml-2" />}
        </Text>
      </Flex>
    </Layout>
  );
};

export default FolderEmpty;
