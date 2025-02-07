import { useDispatch, useSelector } from "react-redux";
import { searchBarSelector } from "../slice/search-bar-slice";
import { resultSearchSelector, setDataResultSearch } from "../slice/result-search-slice";
import { ResultSearchState } from "../search";
import { useCallback, useEffect, useRef } from "react";

const useSortCategoryFolderFolderName = () => {
  const dispatch = useDispatch();

  /** Redux state */
  const { selectedSortCategoryName, sortBy } = useSelector(searchBarSelector);
  const { data } = useSelector(resultSearchSelector);

  /** Ref to store the current data to avoid unnecessary re-renders */
  const currentDataRef = useRef<ResultSearchState["data"] | null>(null);

  const sortFolderByName = useCallback(() => {
    const storedData = currentDataRef.current;
    if (!storedData) return;

    const sortedData = [...storedData];

    /** Ensure all items are folders before sorting */
    if (!sortedData.every((item) => item.resultType === "folder")) return;

    /** Sorting logic */
    sortedData.sort((a, b) => {
      const aName = a.folder_name.toLowerCase();
      const bName = b.folder_name.toLowerCase();
      return sortBy === "asc" ? aName.localeCompare(bName) : bName.localeCompare(aName);
    });

    /** Update Redux state with sorted data */
    dispatch(setDataResultSearch(sortedData));
  }, [dispatch, sortBy]);

  /** Effect to sort folders by name when selectedSortCategoryName changes */
  useEffect(() => {
    if (selectedSortCategoryName === "folder-name") sortFolderByName();
  }, [selectedSortCategoryName, sortFolderByName]);

  /** Effect to update ref when data changes */
  useEffect(() => {
    if (data && data.length > 0) currentDataRef.current = data;
    else currentDataRef.current = null;
  }, [data]);
};

export default useSortCategoryFolderFolderName;
