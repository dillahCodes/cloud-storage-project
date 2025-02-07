import useSearchMyStorageLocation from "@/features/search-folder-or-file/hooks/use-search-my-storage-location";
import useSearchRecentFilesLocation from "@/features/search-folder-or-file/hooks/use-search-recent-files-location";
import useSearchSharedWithMeLocation from "@/features/search-folder-or-file/hooks/use-search-shared-with-me-location";
import useSearchStarredFoldersLocation from "@/features/search-folder-or-file/hooks/use-search-starred-folders-location";
import useSortCategoryFileFileName from "@/features/search-folder-or-file/hooks/use-sort-category-file-file-name";
import useSortCategoryFileFileSize from "@/features/search-folder-or-file/hooks/use-sort-category-file-file-size";
import useSortCategoryFileFileUploadTime from "@/features/search-folder-or-file/hooks/use-sort-category-file-file-upload-time";
import useSortCategoryFolderFolderName from "@/features/search-folder-or-file/hooks/use-sort-category-folder-folder-name";
import useSortCategoryFolderLastModified from "@/features/search-folder-or-file/hooks/use-sort-category-folder-last-modified";
import { resultSearchSelector } from "@/features/search-folder-or-file/slice/result-search-slice";
import { searchBarSelector } from "@/features/search-folder-or-file/slice/search-bar-slice";
import { Flex, Typography } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import MobileSearchbarHeader from "./mobile-searchbar-header";
import SearchbarEmpty from "./searchbar-empty";
import { SearchbarFilterAndCategory } from "./searchbar-filter-and-category";
import SearchbarResult from "./searchbar-result";

const { Text } = Typography;
const MobileSearchBar = () => {
  /**
   * searchbar state
   */
  const { selectedLocationName, selectedSearchCategoryName } = useSelector(searchBarSelector);

  /**
   * hooks fetch search data
   */
  const shouldFetchMyStorageLocation = useMemo(() => selectedLocationName === "my-storage", [selectedLocationName]);
  useSearchMyStorageLocation({ shouldFetch: shouldFetchMyStorageLocation });
  const shouldFetchSharedLocation = useMemo(() => selectedLocationName === "shared-with-me", [selectedLocationName]);
  useSearchSharedWithMeLocation({ shouldFetch: shouldFetchSharedLocation });
  const shouldFetchRecentFiles = useMemo(() => selectedLocationName === "recent", [selectedLocationName]);
  useSearchRecentFilesLocation({ shouldFetch: shouldFetchRecentFiles });
  const shouldFetchStarredFolders = useMemo(() => selectedLocationName === "starred", [selectedLocationName]);
  useSearchStarredFoldersLocation({ shouldFetch: shouldFetchStarredFolders });

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
  const isEmpty = useMemo(() => dataLength === 0, [dataLength]);

  return (
    <Flex vertical className="fixed inset-0 bg-[#fff1ff] z-50">
      <MobileSearchbarHeader />
      <SearchbarFilterAndCategory />

      {/* result */}
      <Flex className="w-full p-3" justify="space-between" align="center">
        <Text className="text-sm font-archivo  capitalize font-medium">result</Text>
        <Text className="text-sm font-archivo  capitalize font-medium">
          {dataLength} {selectedSearchCategoryName}
          {dataLength > 1 ? "s" : ""} found
        </Text>
      </Flex>
      {isEmpty && <SearchbarEmpty />}
      {!isEmpty && <SearchbarResult />}
    </Flex>
  );
};

export default MobileSearchBar;
