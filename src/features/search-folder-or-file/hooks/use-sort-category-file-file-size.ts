import { useDispatch, useSelector } from "react-redux";
import { searchBarSelector } from "../slice/search-bar-slice";
import { resultSearchSelector, setDataResultSearch } from "../slice/result-search-slice";
import { ResultSearchState } from "../search";
import { useCallback, useEffect, useRef } from "react";

const useSortCategoryFileFileSize = () => {
  const dispatch = useDispatch();

  /** Redux state */
  const { selectedSortCategoryName, sortBy } = useSelector(searchBarSelector);
  const { data } = useSelector(resultSearchSelector);

  /** Ref to store the current data to avoid unnecessary re-renders */
  const currentDataRef = useRef<ResultSearchState["data"] | null>(null);

  const sortFileBySize = useCallback(() => {
    const storedData = currentDataRef.current;
    if (!storedData) return;

    const sortedData = [...storedData];

    /** Ensure all items are files before sorting */
    if (!sortedData.every((item) => item.resultType === "file")) return;

    /** Sorting logic */
    sortedData.sort((a, b) => {
      const aSize = parseInt(a.file_size);
      const bSize = parseInt(b.file_size);
      return sortBy === "asc" ? aSize - bSize : bSize - aSize;
    });

    /** Update Redux state with sorted data */
    dispatch(setDataResultSearch(sortedData));
  }, [dispatch, sortBy]);

  /** Effect to sort files by size */
  useEffect(() => {
    if (selectedSortCategoryName === "file-size") sortFileBySize();
  }, [sortFileBySize, selectedSortCategoryName]);

  /** Effect to update ref when data changes */
  useEffect(() => {
    if (data && data.length > 0) currentDataRef.current = data;
    else currentDataRef.current = null;
  }, [data]);
};

export default useSortCategoryFileFileSize;
