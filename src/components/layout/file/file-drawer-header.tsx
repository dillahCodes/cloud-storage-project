import abbreviateText from "@/util/abbreviate-text";
import { Flex, Typography } from "antd";
import FileIconsVariant from "./file-icons-variant";

interface FileDrawerHeaderProps {
  fileName: string;
  fileType: string;
}

const { Text } = Typography;
const FileDrawerHeader: React.FC<FileDrawerHeaderProps> = ({ fileName, fileType }) => {
  return (
    <Flex className="w-full" align="center" gap="middle">
      <Text className="text-base font-archivo">
        <FileIconsVariant fileType={fileType} />
      </Text>
      <Text className="text-base font-archivo">{abbreviateText(fileName, 20)}</Text>
    </Flex>
  );
};

export default FileDrawerHeader;
