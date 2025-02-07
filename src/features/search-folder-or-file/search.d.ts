import { RootFolderGetData, SubFolderGetData } from "../folder/folder";
import { LOCATION_NAME, SEARCH_CATEGORY_NAME, SORT_CATEGORY_NAME } from "./search-menu";

interface SearchState {
  isSearchbarOpen: boolean;
  searchInputValue: string;
  selectedLocationName: LOCATION_NAME;
  selectedSearchCategoryName: SEARCH_CATEGORY_NAME;
  selectedSortCategoryName: SORT_CATEGORY_NAME;
  sortBy: "asc" | "desc";
}

type SearchResultDataType = "folder" | "file";

type BaseResultSearch<T, U> = T & {
  resultType: U;
};

type FolderResultSearch = BaseResultSearch<SubFolderGetData | RootFolderGetData, "folder">;
type FileSearchResult = BaseResultSearch<RootFileGetData | SubFileGetData, "file">;

interface ResultSearchState {
  data: (FolderResultSearch | FileSearchResult)[];
  dataLength: number;
  statusFetch: "idle" | "loading" | "success" | "error";
}

interface SelectedSearchResultState {
  selectedDataId: string | null;
  selectedDataName: string | null;
  selectedDataType: SearchResultDataType | null;
  fromLocation: LOCATION_NAME | null;
  startFinding: boolean;
}
