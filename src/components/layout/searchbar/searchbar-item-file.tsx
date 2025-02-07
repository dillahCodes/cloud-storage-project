import { FileSearchResult } from "@/features/search-folder-or-file/search";
import { selectedSearchResultSelector } from "@/features/search-folder-or-file/slice/selected-search-result-selector";
import useHover from "@/hooks/use-hover";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import formatFileSize from "@/util/format-file-size";
import { Flex, Typography } from "antd";
import classNames from "classnames";
import { useMemo } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { useSelector } from "react-redux";
import FileIconsVariant from "../file/file-icons-variant";
import useSearchClickResultSearch from "@/features/search-folder-or-file/hooks/use-search-click-result-search";

interface SearchbarItemFileProps {
  file: FileSearchResult;
}

const { Text } = Typography;
const SearchbarItemFile: React.FC<SearchbarItemFileProps> = ({ file }) => {
  const { selectedDataId } = useSelector(selectedSearchResultSelector);
  const { isHover, handleEndHover, handleStartHover } = useHover();
  const { handleClickResultSearch } = useSearchClickResultSearch();

  const isSelected = useMemo(() => file.file_id === selectedDataId, [file.file_id, selectedDataId]);
  const handleClick = () => handleClickResultSearch(file);

  return (
    <Flex
      id={`search-result-${file.file_id}`}
      className="w-full"
      gap="middle"
      onClick={handleClick}
      onMouseEnter={handleStartHover}
      onMouseLeave={handleEndHover}
      onTouchEnd={handleEndHover}
      onTouchStart={handleStartHover}
    >
      <Flex
        className="p-1.5 px-3  bg-[#ff87a6] rounded-sm border-black border-2"
        align="center"
        style={neoBrutalBorderVariants.small}
      >
        <Text className="text-xl">
          <FileIconsVariant fileType={file.file_type} />
        </Text>
      </Flex>
      <Flex
        align="center"
        justify="space-between"
        className={classNames("p-1 bg-[#FFB6C1]  rounded-sm border-black border-2 w-full", {
          "bg-[#ff87a6]": isHover || isSelected,
        })}
        style={neoBrutalBorderVariants.small}
      >
        <Flex vertical>
          <Text className="text-sm font-bold font-archivo">{file.file_name}</Text>
          <Text className="text-xs font-archivo">{formatFileSize(parseInt(file?.file_size ?? "0"))}</Text>
        </Flex>

        {(isHover || isSelected) && (
          <Text
            className="text-xl bg-[#ffff] font-archivo flex items-center p-1 border-2 border-black"
            style={neoBrutalBorderVariants.small}
          >
            <GoArrowUpRight />
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
export default SearchbarItemFile;
