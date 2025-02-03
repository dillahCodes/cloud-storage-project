import { FolderResultSearch } from "@/features/search-folder-or-file/search";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import formatTimestamp from "@/util/format-timestamp";
import { Flex, Typography } from "antd";
import { useMemo } from "react";
import { IoMdFolderOpen } from "react-icons/io";

interface SearchbarItemFolder {
  folder: FolderResultSearch;
}

const { Text } = Typography;
const SearchbarItemFolder: React.FC<SearchbarItemFolder> = ({ folder }) => {
  const renderDate = useMemo(() => {
    if (folder.updated_at) return `${formatTimestamp(folder.updated_at.seconds)}`;
    else return `${formatTimestamp(folder.created_at.seconds)}`;
  }, [folder.created_at, folder.updated_at]);

  return (
    <Flex className="w-full" gap="middle">
      <Flex className="p-1.5 px-3  bg-[#ff87a6] rounded-sm border-black border-2" align="center" style={neoBrutalBorderVariants.small}>
        <Text className="text-xl">
          <IoMdFolderOpen />
        </Text>
      </Flex>
      <Flex vertical className="p-1 bg-[#FFB6C1] rounded-sm border-black border-2 w-full" style={neoBrutalBorderVariants.small}>
        <Text className="text-sm font-bold font-archivo">{folder.folder_name}</Text>
        <Text className="text-xs font-archivo">{renderDate}</Text>
      </Flex>
    </Flex>
  );
};
export default SearchbarItemFolder;
