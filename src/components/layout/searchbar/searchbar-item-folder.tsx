import useSearchClickResultSearch from "@/features/search-folder-or-file/hooks/use-search-click-result-search";
import { FolderResultSearch } from "@/features/search-folder-or-file/search";
import { selectedSearchResultSelector } from "@/features/search-folder-or-file/slice/selected-search-result-selector";
import useHover from "@/hooks/use-hover";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import formatTimestamp from "@/util/format-timestamp";
import { Flex, Typography } from "antd";
import classNames from "classnames";
import { useMemo } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { IoMdFolderOpen } from "react-icons/io";
import { useSelector } from "react-redux";

interface SearchbarItemFolder {
  folder: FolderResultSearch;
}

const { Text } = Typography;
const SearchbarItemFolder: React.FC<SearchbarItemFolder> = ({ folder }) => {
  const { selectedDataId } = useSelector(selectedSearchResultSelector);

  const { handleEndHover, handleStartHover, isHover } = useHover();
  const { handleClickResultSearch } = useSearchClickResultSearch();

  const isSelected = useMemo(() => folder.folder_id === selectedDataId, [folder.folder_id, selectedDataId]);
  const handleClick = () => handleClickResultSearch(folder);

  const renderDate = useMemo(() => {
    if (folder.updated_at) return `${formatTimestamp(folder.updated_at.seconds)}`;
    else return `${formatTimestamp(folder.created_at.seconds)}`;
  }, [folder.created_at, folder.updated_at]);

  return (
    <Flex
      id={`search-result-${folder.folder_id}`}
      className="w-full"
      gap="middle"
      onMouseEnter={handleStartHover}
      onMouseLeave={handleEndHover}
      onTouchEnd={handleEndHover}
      onTouchStart={handleStartHover}
      onClick={handleClick}
    >
      <Flex
        className="p-1.5 px-3  bg-[#ff87a6] rounded-sm border-black border-2"
        align="center"
        style={neoBrutalBorderVariants.small}
      >
        <Text className="text-xl">
          <IoMdFolderOpen />
        </Text>
      </Flex>
      <Flex
        justify="space-between"
        className={classNames("p-1 bg-[#FFB6C1] rounded-sm border-black border-2 w-full", {
          "bg-[#ff87a6]": isHover || isSelected,
        })}
        style={neoBrutalBorderVariants.small}
      >
        <Flex vertical>
          <Text className="text-sm font-bold font-archivo">{folder.folder_name}</Text>
          <Text className="text-xs font-archivo">{renderDate}</Text>
        </Flex>

        {(isHover || isSelected) && (
          <Text
            className="text-xl bg-[#ffff] font-archivo p-1 flex items-center border-2 border-black"
            style={neoBrutalBorderVariants.small}
          >
            <GoArrowUpRight />
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
export default SearchbarItemFolder;
