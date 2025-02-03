import { RootFolderGetData, SubFolderGetData } from "../folder/folder";
import { UserMessage } from "../message/message";
import { LOCATION_NAME, SEARCH_CATEGORY_NAME, SORT_CATEGORY_NAME } from "./search-menu";

interface SearchState {
  isSearchbarOpen: boolean;
  searchInputValue: string;
  selectedLocationName: LOCATION_NAME;
  selectedSearchCategoryName: SEARCH_CATEGORY_NAME;
  selectedSortCategoryName: SORT_CATEGORY_NAME;
  sortBy: "asc" | "desc";
}

type SearchResultDataType = "folder" | "file" | "notification";

type FolderResultSearch = (SubFolderGetData | RootFolderGetData) & {
  resultType: "folder";
};

type FileSearchResult = (RootFileGetData | SubFileGetData) & {
  resultType: "file";
};

type NotificationResultSearch = UserMessage & {
  resultType: "notification";
};

interface ResultSearchState {
  data: (FolderResultSearch | FileSearchResult | NotificationResultSearch)[];
  dataLength: number;
  statusFetch: "idle" | "loading" | "success" | "error";
}
