import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Button, Flex, Typography } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import FileIconsVariant from "./file-icons-variant";
import RenderResponsiveFileName from "./responsive-file-name";

interface FileProps {
  name: string;
  fileType: string;
}

const { Text } = Typography;
const VariantFileListItem: React.FC<FileProps> = ({ name, fileType }) => {
  return (
    <Flex
      className="border-2 border-black rounded-md cursor-pointer w-full p-3"
      gap="small"
      align="center"
      justify="space-between"
      style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.primary200 }}
    >
      <Flex align="center" gap="small">
        <Text className="text-xl">
          <FileIconsVariant fileType={fileType} />
        </Text>
        <Text className=" text-sm font-archivo">
          <RenderResponsiveFileName fileName={name} />
        </Text>
      </Flex>

      <Button
        size="small"
        className="p-0.5 text-black bg-transparent shadow-none border-none"
        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
          e.stopPropagation();

          console.log("opened file settings");
        }}
      >
        <BsThreeDotsVertical className="text-xl" />
      </Button>
    </Flex>
  );
};

export default VariantFileListItem;
