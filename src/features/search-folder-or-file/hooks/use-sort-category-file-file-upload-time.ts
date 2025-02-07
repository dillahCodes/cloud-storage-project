import { useDispatch, useSelector } from "react-redux";
import { searchBarSelector } from "../slice/search-bar-slice";
import { resultSearchSelector, setDataResultSearch } from "../slice/result-search-slice";
import { ResultSearchState } from "../search";
import { useCallback, useEffect, useRef } from "react";

const useSortCategoryFileFileUploadTime = () => {
  const dispatch = useDispatch();

  /** Redux state */
  const { selectedSortCategoryName, sortBy } = useSelector(searchBarSelector);
  const { data } = useSelector(resultSearchSelector);

  /** Ref to store the current data to avoid unnecessary re-renders */
  const currentDataRef = useRef<ResultSearchState["data"] | null>(null);

  const sortFileByUploadTime = useCallback(() => {
    const storedData = currentDataRef.current;
    if (!storedData) return;

    const sortedData = [...storedData];

    /** Ensure all items are files before sorting */
    if (!sortedData.every((item) => item.resultType === "file")) return;

    /** Sorting logic */
    sortedData.sort((a, b) => {
      const aTime = b.created_at.seconds ?? 0;
      const bTime = a.created_at.seconds ?? 0;
      return sortBy === "asc" ? aTime - bTime : bTime - aTime;
    });

    /** Update Redux state with sorted data */
    dispatch(setDataResultSearch(sortedData));
  }, [dispatch, sortBy]);

  /** Effect to trigger sorting when selectedSortCategoryName changes */
  useEffect(() => {
    if (selectedSortCategoryName === "upload-time") sortFileByUploadTime();
  }, [selectedSortCategoryName, sortFileByUploadTime]);

  /** Effect to update ref when data changes */
  useEffect(() => {
    if (data && data.length > 0) currentDataRef.current = data;
    else currentDataRef.current = null;
  }, [data]);
};

export default useSortCategoryFileFileUploadTime;
