import { useDispatch, useSelector } from "react-redux";
import {
  FileSortingBy,
  FileSortingByLocalStorageKey,
  FileSortingLocalStorageKey,
  FileSortingState,
  FileSortingType,
  fileSortingTypeSelector,
  setFileSelectedCategory,
  setFileSelectedSorting,
} from "../slice/file-sorting-type-slice";
import { useEffect, useMemo } from "react";
import useFilesState from "./use-files-state";
import { setFiles } from "../slice/file-slice";
import { RootFileGetData, SubFileGetData } from "../file";

const useFileSortOptions = () => {
  const dispatch = useDispatch();
  const fileSortingState = useSelector(fileSortingTypeSelector);
  const { files } = useFilesState();

  const fileSortingLocalStorageKey: FileSortingLocalStorageKey = "fileSortingType";
  const filerSortingByLocalStorageKey: FileSortingByLocalStorageKey = "fileSortingBy";

  /**
   * Helper to sort files
   */
  const sortFiles = useMemo(() => {
    return {
      byName: {
        ascending: () => [...files].sort((a, b) => a.file_name.localeCompare(b.file_name)),
        descending: () => [...files].sort((a, b) => b.file_name.localeCompare(a.file_name)),
      },
      bySize: {
        ascending: () => [...files].sort((a, b) => parseInt(a.file_size) - parseInt(b.file_size)),
        descending: () => [...files].sort((a, b) => parseInt(b.file_size) - parseInt(a.file_size)),
      },
      byUploadTime: {
        ascending: () => [...files].sort((a, b) => (a.created_at?.seconds ?? 0) - (b.created_at?.seconds ?? 0)),
        descending: () => [...files].sort((a, b) => (b.created_at?.seconds ?? 0) - (a.created_at?.seconds ?? 0)),
      },
    };
  }, [files]);

  /**
   * Sync files sorting state to Redux and local storage
   */
  interface SortHandler {
    ascending: () => (RootFileGetData | SubFileGetData)[];
    descending: () => (RootFileGetData | SubFileGetData)[];
  }
  const syncSorting = (category: FileSortingBy, sorting: FileSortingType) => {
    const sortHandlers: Record<FileSortingBy, SortHandler> = {
      Name: sortFiles.byName,
      Size: sortFiles.bySize,
      "Upload Time": sortFiles.byUploadTime,
    };

    const sortedFiles = sortHandlers[category]?.[sorting.toLowerCase() as "ascending" | "descending"]();
    sortFiles && dispatch(setFiles(sortedFiles as RootFileGetData[] | SubFileGetData[]));
  };

  const handleFileChangeSelectedCategory = (value: FileSortingState["selectedCategory"]) => {
    dispatch(setFileSelectedCategory(value));
    localStorage.setItem(fileSortingLocalStorageKey, value);
    syncSorting(value, fileSortingState.selectedSorting);
  };

  const handleFileChangeSorting = () => {
    const newSorting = fileSortingState.selectedSorting === "Ascending" ? "Descending" : "Ascending";
    dispatch(setFileSelectedSorting(newSorting));
    localStorage.setItem(filerSortingByLocalStorageKey, newSorting);
    syncSorting(fileSortingState.selectedCategory, newSorting);
  };

  /**
   * Load sorting files preferences from local storage
   */
  useEffect(() => {
    const storedCategory = localStorage.getItem(fileSortingLocalStorageKey) as FileSortingBy;
    const storedSorting = localStorage.getItem(filerSortingByLocalStorageKey) as FileSortingType;

    if (storedCategory) dispatch(setFileSelectedCategory(storedCategory));
    if (storedSorting) dispatch(setFileSelectedSorting(storedSorting));
  }, [dispatch]);

  /**
   * Automatically sort folders on state change
   */
  useEffect(() => {
    syncSorting(fileSortingState.selectedCategory, fileSortingState.selectedSorting);
  }, [fileSortingState]); // eslint-disable-line

  return {
    handleFileChangeSelectedCategory,
    handleFileChangeSorting,
  };
};

export default useFileSortOptions;
