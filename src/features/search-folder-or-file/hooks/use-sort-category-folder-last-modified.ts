import { useDispatch, useSelector } from "react-redux";
import { searchBarSelector } from "../slice/search-bar-slice";
import { resultSearchSelector, setDataResultSearch } from "../slice/result-search-slice";
import { ResultSearchState } from "../search";
import { useCallback, useEffect, useRef } from "react";

const useSortCategoryFolderLastModified = () => {
  const dispatch = useDispatch();

  /** Redux state */
  const { selectedSortCategoryName, sortBy } = useSelector(searchBarSelector);
  const { data } = useSelector(resultSearchSelector);

  /** Ref to store the current data to avoid unnecessary re-renders */
  const currentDataRef = useRef<ResultSearchState["data"] | null>(null);

  const sortFolderByLastModified = useCallback(() => {
    const storedData = currentDataRef.current;
    if (!storedData) return;

    const sortedData = [...storedData];

    /** Ensure all items are folders before sorting */
    if (!sortedData.every((item) => item.resultType === "folder")) return;

    /** Sorting logic */
    sortedData.sort((a, b) => {
      const aTime = b.updated_at ? b.updated_at.seconds ?? 0 : 0;
      const bTime = a.updated_at ? a.updated_at.seconds ?? 0 : 0;
      return sortBy === "asc" ? aTime - bTime : bTime - aTime;
    });

    /** Update Redux state with sorted data */
    dispatch(setDataResultSearch(sortedData));
  }, [dispatch, sortBy]);

  /** Effect to sort folders by name when selectedSortCategoryName changes */
  useEffect(() => {
    if (selectedSortCategoryName === "last-modified") sortFolderByLastModified();
  }, [selectedSortCategoryName, sortFolderByLastModified]);

  /** Effect to update ref when data changes */
  useEffect(() => {
    if (data && data.length > 0) currentDataRef.current = data;
    else currentDataRef.current = null;
  }, [data]);
};

export default useSortCategoryFolderLastModified;
