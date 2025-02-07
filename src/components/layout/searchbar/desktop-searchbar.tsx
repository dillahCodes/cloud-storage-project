import useDekstopSearchArrowControls from "@/features/search-folder-or-file/hooks/use-dekstop-search-arrow-controls";
import useSearch from "@/features/search-folder-or-file/hooks/use-search";
import useSearchMyStorageLocation from "@/features/search-folder-or-file/hooks/use-search-my-storage-location";
import useSearchRecentFilesLocation from "@/features/search-folder-or-file/hooks/use-search-recent-files-location";
import useSearchSharedWithMeLocation from "@/features/search-folder-or-file/hooks/use-search-shared-with-me-location";
import useSearchStarredFoldersLocation from "@/features/search-folder-or-file/hooks/use-search-starred-folders-location";
import useSortCategoryFileFileName from "@/features/search-folder-or-file/hooks/use-sort-category-file-file-name";
import useSortCategoryFileFileSize from "@/features/search-folder-or-file/hooks/use-sort-category-file-file-size";
import useSortCategoryFileFileUploadTime from "@/features/search-folder-or-file/hooks/use-sort-category-file-file-upload-time";
import useSortCategoryFolderFolderName from "@/features/search-folder-or-file/hooks/use-sort-category-folder-folder-name";
import useSortCategoryFolderLastModified from "@/features/search-folder-or-file/hooks/use-sort-category-folder-last-modified";
import { resetResultSearch, resultSearchSelector } from "@/features/search-folder-or-file/slice/result-search-slice";
import { resetSerchbarState, searchBarSelector } from "@/features/search-folder-or-file/slice/search-bar-slice";
import { withDynamicFloatingElement } from "@components/hoc/with-dynamic-floating-element";
import Searchbar from "@components/ui/searchbar";
import { Flex } from "antd";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DekstopSearchbarHeader from "./dekstop-searchbar-header";
import SearchbarEmpty from "./searchbar-empty";
import SearchbarResult from "./searchbar-result";

const SearchbarWithFloatingElement = withDynamicFloatingElement(Searchbar);
const DekstopSearchbar = () => {
  const dispatch = useDispatch();
  /**
   * searchbar state
   */
  const { selectedLocationName } = useSelector(searchBarSelector);

  /**
   * search hook
   */
  const { handleSearchInputChange, inputValue, setInputValue } = useSearch();

  /**
   * result state
   */
  const { dataLength } = useSelector(resultSearchSelector);

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
   * hook arrow key controls
   */
  const { handleKeyDown } = useDekstopSearchArrowControls();

  /*
   * render conditions
   */
  const isEmpty = useMemo(() => dataLength === 0, [dataLength]);

  /**
   * floating element callback onclose
   */
  const callBackFloatingIsOpen = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        dispatch(resetResultSearch());
        dispatch(resetSerchbarState());
        setInputValue("");
      }
    },
    [dispatch, setInputValue]
  );

  return (
    <div className="w-2/4 max-w-[400px]" id="desktop-searchbar">
      <SearchbarWithFloatingElement
        inputValue={inputValue}
        handleInputKeyDown={handleKeyDown}
        callbackIsOpen={callBackFloatingIsOpen}
        handleInputChange={handleSearchInputChange}
        wraperClassName="z-20"
        isOriginalComponentExcluded
        floatingContent={
          <Flex className="min-h-[300px] w-[500px]" vertical>
            <DekstopSearchbarHeader />
            {isEmpty && <SearchbarEmpty />}
            {!isEmpty && <SearchbarResult />}
          </Flex>
        }
      />
    </div>
  );
};

export default DekstopSearchbar;
