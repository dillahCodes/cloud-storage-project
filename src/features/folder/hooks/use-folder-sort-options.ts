import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootFolderGetData, SubFolderGetData } from "../folder";
import { setCurrentFolders } from "../slice/current-folders-slice";
import {
  FolderSortingBy,
  FolderSortingByLocalStorageKey,
  FolderSortingLocalStorageKey,
  FolderSortingType,
  folderSortingTypeSelector,
  setFolderSelectedCategory,
  setFolderSelectedSorting,
} from "../slice/folder-sorting-type";
import useCurrentFolderState from "./use-current-folder-state";

const useFolderSortOptions = () => {
  const dispatch = useDispatch();
  const folderSortingState = useSelector(folderSortingTypeSelector);
  const { folders } = useCurrentFolderState();

  const folderSortingLocalStorageKey: FolderSortingLocalStorageKey = "folderSortingType";
  const folderSortingByLocalStorageKey: FolderSortingByLocalStorageKey = "folderSortingBy";

  /**
   * Helper to sort folders
   */
  const sortFolders = useMemo(() => {
    return {
      byName: {
        ascending: () => [...folders].sort((a, b) => a.folder_name.localeCompare(b.folder_name)),
        descending: () => [...folders].sort((a, b) => b.folder_name.localeCompare(a.folder_name)),
      },
      byLastModified: {
        ascending: () =>
          [...folders].sort((a, b) => (a.updated_at?.seconds ?? 0) - (b.updated_at?.seconds ?? 0)),
        descending: () =>
          [...folders].sort((a, b) => (b.updated_at?.seconds ?? 0) - (a.updated_at?.seconds ?? 0)),
      },
    };
  }, [folders]);

  /**
   * Sync folder sorting state to Redux and local storage
   */
  const syncSorting = (category: FolderSortingBy, sorting: FolderSortingType) => {
    const sortHandlers = {
      Name: sortFolders.byName,
      "Last Modified": sortFolders.byLastModified,
    };

    const sortedFolders = sortHandlers[category]?.[sorting.toLowerCase() as "ascending" | "descending"]();
    if (sortedFolders) dispatch(setCurrentFolders(sortedFolders as RootFolderGetData[] | SubFolderGetData[]));
  };

  const handleFolderChangeSelectedCategory = (category: FolderSortingBy) => {
    dispatch(setFolderSelectedCategory(category));
    localStorage.setItem(folderSortingLocalStorageKey, category);
    syncSorting(category, folderSortingState.selectedSorting);
  };

  const handleFolderChangeSorting = () => {
    const newSorting = folderSortingState.selectedSorting === "Ascending" ? "Descending" : "Ascending";
    dispatch(setFolderSelectedSorting(newSorting));
    localStorage.setItem(folderSortingByLocalStorageKey, newSorting);
    syncSorting(folderSortingState.selectedCategory, newSorting);
  };

  /**
   * Load sorting preferences from local storage
   */
  useEffect(() => {
    const storedCategory = localStorage.getItem(folderSortingLocalStorageKey) as FolderSortingBy;
    const storedSorting = localStorage.getItem(folderSortingByLocalStorageKey) as FolderSortingType;

    if (storedCategory) dispatch(setFolderSelectedCategory(storedCategory));
    if (storedSorting) dispatch(setFolderSelectedSorting(storedSorting));
  }, [dispatch]);

  /**
   * Automatically sort folders on state change
   */
  useEffect(() => {
    syncSorting(folderSortingState.selectedCategory, folderSortingState.selectedSorting);
  }, [folderSortingState]); // eslint-disable-line

  return {
    handleFolderChangeSelectedCategory,
    handleFolderChangeSorting,
  };
};

export default useFolderSortOptions;
