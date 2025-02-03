import { searchBarSelector } from "@/features/search-folder-or-file/slice/search-bar-slice";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import { Typography } from "antd";
import classNames from "classnames";
import { IoMdArrowRoundUp } from "react-icons/io";
import { useSelector } from "react-redux";

const { Text } = Typography;

interface SearchbarSortModeProps {
  toggleSortBy: () => void;
}
const SearchbarSortMode: React.FC<SearchbarSortModeProps> = ({ toggleSortBy }) => {
  const { sortBy } = useSelector(searchBarSelector);

  return (
    <Text
      onClick={toggleSortBy}
      className={classNames("text-xl p-1 border-2 cursor-pointer border-black bg-[#FFB6C1]")}
      style={neoBrutalBorderVariants.small}
    >
      <IoMdArrowRoundUp className={classNames("transition-all duration-300", { "rotate-180": sortBy === "desc" })} />
    </Text>
  );
};

export default SearchbarSortMode;
