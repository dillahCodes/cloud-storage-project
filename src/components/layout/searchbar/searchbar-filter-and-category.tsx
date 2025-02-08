import { useSearchbarFilterAndCategory } from "@/features/search-folder-or-file/hooks/use-searchbar-filter-and-category";
import { Flex } from "antd";
import { LocationFilter } from "./searchbar-location-filter";
import { SearchCategory } from "./searchbar-search-category";
import { SortCategory } from "./searchbar-sort-category";
import SearchbarSortMode from "./searchbar-sort-mode";

export const SearchbarFilterAndCategory = () => {
  const {
    selectedLocationName,
    selectedSearchCategoryName,
    selectedSortCategoryName,
    searchCategoryMenuItems,
    sortCategoryMenuItems,
    handleSetSearchLocation,
    handleSetSearchCategory,
    handleSetSortCategory,
    toggleSortBy,
  } = useSearchbarFilterAndCategory();

  return (
    <Flex className="w-full p-3">
      {/* location and search for */}
      <Flex className="w-full" gap="small">
        <LocationFilter selectedLocationName={selectedLocationName} handleSetSearchLocation={handleSetSearchLocation} />

        <SearchCategory
          selectedSearchCategoryName={selectedSearchCategoryName}
          searchCategoryMenuItems={searchCategoryMenuItems}
          handleSetSearchCategory={handleSetSearchCategory}
        />
      </Flex>

      {/*  sort mode and category  */}
      <Flex gap="small">
        <SearchbarSortMode toggleSortBy={toggleSortBy} />
        <SortCategory
          selectedSortCategoryName={selectedSortCategoryName}
          sortCategoryMenuItems={sortCategoryMenuItems}
          handleSetSortCategory={handleSetSortCategory}
        />
      </Flex>
    </Flex>
  );
};
