import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import FileIconsVariant from "./file-icons-variant";
import RenderResponsiveFileName from "./responsive-file-name";

const { Text } = Typography;

interface FileProps {
  name: string;
  fileType: string;
}
const FileComponent: React.FC<FileProps> = ({ name, fileType }) => {
  return (
    <Flex
      vertical
      gap="small"
      className="w-full h-fit border-2 border-black p-2 rounded-md"
      style={{ ...neoBrutalBorderVariants.medium, background: themeColors.primary200 }}
    >
      <Flex className="w-full" align="center" gap="small" justify="space-between">
        <Text className="text-lg font-archivo">
          <FileIconsVariant fileType={fileType} />
        </Text>
        <RenderResponsiveFileName fileName={name} />
        <Button icon={<BsThreeDotsVertical />} className="p-0 border-none shadow-none text-black bg-transparent" />
      </Flex>
      <Flex
        align="center"
        justify="center"
        className="h-[150px] border-2 border-black rounded-sm"
        style={{ background: themeColors.primary300, ...neoBrutalBorderVariants.small }}
      >
        <Text className="text-6xl font-archivo">
          <FileIconsVariant fileType={fileType} />
        </Text>
      </Flex>
    </Flex>
  );
};
export default FileComponent;
