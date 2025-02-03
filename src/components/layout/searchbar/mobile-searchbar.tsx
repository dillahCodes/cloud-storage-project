import useSearchMyStorageLocation from "@/features/search-folder-or-file/hooks/use-search-my-storage-location";
import { resultSearchSelector } from "@/features/search-folder-or-file/slice/result-search-slice";
import { searchBarSelector } from "@/features/search-folder-or-file/slice/search-bar-slice";
import { Flex, Typography } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import MobileSearchbarHeader from "./mobile-searchbar-header";
import { SearchbarFilterAndCategory } from "./searchbar-filter-and-category";
import SearchbarResult from "./searchbar-result";
import useSortCategoryFileFileName from "@/features/search-folder-or-file/hooks/use-sort-category-file-file-name";
import useSortCategoryFileFileSize from "@/features/search-folder-or-file/hooks/use-sort-category-file-file-size";
import useSortCategoryFileFileUploadTime from "@/features/search-folder-or-file/hooks/use-sort-category-file-file-upload-time";
import useSortCategoryFolderFolderName from "@/features/search-folder-or-file/hooks/use-sort-category-folder-folder-name";
import useSortCategoryFolderLastModified from "@/features/search-folder-or-file/hooks/use-sort-category-folder-last-modified";

const { Text } = Typography;
const MobileSearchBar = () => {
  /**
   * hooks fetch data
   */
  useSearchMyStorageLocation();

  /**
   * hooks files sort category
   */
  useSortCategoryFileFileName();
  useSortCategoryFileFileSize();
  useSortCategoryFileFileUploadTime();

  /**
   * hooks folders sort category
   */
  useSortCategoryFolderFolderName();
  useSortCategoryFolderLastModified();

  /**
   * result state
   */
  const { dataLength } = useSelector(resultSearchSelector);

  /**
   * searchbar state
   */
  const { selectedSearchCategoryName, selectedLocationName } = useSelector(searchBarSelector);
  const renderSelectedSearchCategoryName = useMemo(() => {
    if (selectedLocationName === "notifications") return "notification";
    return selectedSearchCategoryName;
  }, [selectedLocationName, selectedSearchCategoryName]);

  return (
    <Flex vertical className="fixed inset-0 bg-[#fff1ff] z-50">
      <MobileSearchbarHeader />
      <SearchbarFilterAndCategory />

      {/* result */}
      <Flex className="w-full p-3" justify="space-between" align="center">
        <Text className="text-sm font-archivo  capitalize font-medium">result</Text>
        <Text className="text-sm font-archivo  capitalize font-medium">
          {dataLength} {renderSelectedSearchCategoryName}
          {dataLength > 1 ? "s" : ""} found
        </Text>
      </Flex>
      <SearchbarResult />
    </Flex>
  );
};

export default MobileSearchBar;
