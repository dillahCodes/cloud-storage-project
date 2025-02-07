import { searchBarSelector } from "@/features/search-folder-or-file/slice/search-bar-slice";
import { useSelector } from "react-redux";
import { SearchbarFilterAndCategory } from "./searchbar-filter-and-category";
import { resultSearchSelector } from "@/features/search-folder-or-file/slice/result-search-slice";
import { Flex, Typography } from "antd";

const { Text } = Typography;
const DekstopSearchbarHeader = () => {
  /**
   * searchbar state
   */
  const { selectedSearchCategoryName } = useSelector(searchBarSelector);
  /**
   * result state
   */
  const { dataLength } = useSelector(resultSearchSelector);

  return (
    <>
      <SearchbarFilterAndCategory />

      {/* result */}
      <Flex className="w-full p-3" justify="space-between" align="center">
        <Text className="text-sm font-archivo  capitalize font-medium">result</Text>
        <Text className="text-sm font-archivo  capitalize font-medium">
          {dataLength} {selectedSearchCategoryName}
          {dataLength > 1 ? "s" : ""} found
        </Text>
      </Flex>
    </>
  );
};

export default DekstopSearchbarHeader;
