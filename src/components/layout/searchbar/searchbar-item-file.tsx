import { FileSearchResult } from "@/features/search-folder-or-file/search";
import { Flex, Typography } from "antd";
import FileIconsVariant from "../file/file-icons-variant";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import formatFileSize from "@/util/format-file-size";

interface SearchbarItemFileProps {
  file: FileSearchResult;
}

const { Text } = Typography;
const SearchbarItemFile: React.FC<SearchbarItemFileProps> = ({ file }) => {
  return (
    <Flex className="w-full" gap="middle">
      <Flex className="p-1.5 px-3  bg-[#ff87a6] rounded-sm border-black border-2" align="center" style={neoBrutalBorderVariants.small}>
        <Text className="text-xl">
          <FileIconsVariant fileType={file.file_type} />
        </Text>
      </Flex>
      <Flex vertical className="p-1 bg-[#FFB6C1] rounded-sm border-black border-2 w-full" style={neoBrutalBorderVariants.small}>
        <Text className="text-sm font-bold font-archivo">{file.file_name}</Text>
        <Text className="text-xs font-archivo">{formatFileSize(parseInt(file?.file_size ?? "0"))}</Text>
      </Flex>
    </Flex>
  );
};
export default SearchbarItemFile;
