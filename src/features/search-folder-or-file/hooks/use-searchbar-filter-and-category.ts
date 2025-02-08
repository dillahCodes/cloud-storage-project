import { useDispatch, useSelector } from "react-redux";
import {
  searchBarSelector,
  setSearchSortBy,
  setSelectedLocationName,
  setSelectedSearchCategoryName,
  setSelectedSortCategoryName,
} from "@/features/search-folder-or-file/slice/search-bar-slice";
import { SEARCH_CATEGORY, SORT_CATEGORY } from "@/features/search-folder-or-file/search-menu";
import { useMemo } from "react";
import { SearchState } from "../search";
import { resetResultSearch } from "../slice/result-search-slice";

export const useSearchbarFilterAndCategory = () => {
  const dispatch = useDispatch();
  const { selectedLocationName, selectedSearchCategoryName, selectedSortCategoryName, sortBy } = useSelector(searchBarSelector);

  const searchCategoryMenuItems = useMemo(() => SEARCH_CATEGORY[selectedLocationName]?.category ?? [], [selectedLocationName]);
  const sortCategoryMenuItems = useMemo(() => {
    return SORT_CATEGORY[selectedSearchCategoryName]?.category ?? [];
  }, [selectedSearchCategoryName]);

  /**
   * set search location first then search category
   */
  const handleSetSearchLocation = (locationName: SearchState["selectedLocationName"]) => {
    selectedLocationName !== locationName && dispatch(resetResultSearch());
    dispatch(setSelectedLocationName(locationName));

    const searchCategoryName = SEARCH_CATEGORY[locationName]?.category?.[0]?.name || "file";
    const sortCategoryName = SORT_CATEGORY[searchCategoryName]?.category?.[0]?.name || "file-name";
    dispatch(setSelectedSearchCategoryName(searchCategoryName));
    dispatch(setSelectedSortCategoryName(sortCategoryName));
  };

  /**
   * set search category first then sort category
   */
  const handleSetSearchCategory = (categoryName: SearchState["selectedSearchCategoryName"]) => {
    selectedSearchCategoryName !== categoryName && dispatch(resetResultSearch());
    dispatch(setSelectedSearchCategoryName(categoryName));
    dispatch(setSelectedSortCategoryName(SORT_CATEGORY[categoryName].category[0].name));
  };

  const handleSetSortCategory = (sortCategoryName: SearchState["selectedSortCategoryName"]) => {
    dispatch(setSelectedSortCategoryName(sortCategoryName));
  };

  const toggleSortBy = () => {
    dispatch(setSearchSortBy(sortBy === "asc" ? "desc" : "asc"));
  };

  return {
    selectedLocationName,
    selectedSearchCategoryName,
    selectedSortCategoryName,
    sortBy,
    searchCategoryMenuItems,
    sortCategoryMenuItems,
    handleSetSearchLocation,
    handleSetSearchCategory,
    handleSetSortCategory,
    toggleSortBy,
  };
};
