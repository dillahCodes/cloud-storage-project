import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resultSearchSelector, setDataResultSearch } from "../slice/result-search-slice";
import { searchBarSelector } from "../slice/search-bar-slice";
import { ResultSearchState } from "../search";

const useSortCategoryFileFileName = () => {
  const dispatch = useDispatch();

  /** Redux state */
  const { selectedSortCategoryName, sortBy } = useSelector(searchBarSelector);
  const { data } = useSelector(resultSearchSelector);

  /** Ref to store the current data to avoid unnecessary re-renders */
  const currentDataRef = useRef<ResultSearchState["data"] | null>(null);

  /**
   * Sorts files by name based on the selected order (asc/desc).
   * This function does not directly modify the Redux state.
   * Instead, it updates the data in the ref before dispatching the sorted result.
   */
  const sortFilesByName = useCallback(() => {
    const storedData = currentDataRef.current;
    if (!storedData) return;

    const sortedData = [...storedData];

    /** Ensure all items are files before sorting */
    if (!sortedData.every((item) => item.resultType === "file")) return;

    /** Sorting logic */
    sortedData.sort((a, b) => {
      const aLower = a.file_name.toLowerCase();
      const bLower = b.file_name.toLowerCase();
      return sortBy === "asc" ? aLower.localeCompare(bLower) : bLower.localeCompare(aLower);
    });

    /** Dispatch sorted data to Redux */
    dispatch(setDataResultSearch(sortedData));
  }, [sortBy, dispatch]);

  /** Effect to sort files when the selected category changes */
  useEffect(() => {
    if (selectedSortCategoryName === "file-name") sortFilesByName();
  }, [selectedSortCategoryName, sortFilesByName]);

  /** Effect to update ref when data changes and reset ref if data is empty */
  useEffect(() => {
    if (data && data.length > 0) currentDataRef.current = data;
    else currentDataRef.current = null;
  }, [data]);
};

export default useSortCategoryFileFileName;
