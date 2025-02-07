import { FileSearchResult, FolderResultSearch } from "./search";

export const LOCATION_CATEGORY = [
  {
    name: "my-storage",
    label: "My Storage",
  },
  {
    name: "shared-with-me",
    label: "Shared with me",
  },
  {
    name: "recent",
    label: "Recent",
  },
  {
    name: "starred",
    label: "Starred",
  },
] as const;
export type LOCATION_NAME = (typeof LOCATION_CATEGORY)[number]["name"];

export const SEARCH_CATEGORY = {
  "my-storage": {
    category: [
      { name: "folder", label: "Folder" },
      { name: "file", label: "File" },
    ],
  },
  "shared-with-me": {
    category: [
      { name: "folder", label: "Folder" },
      { name: "file", label: "File" },
    ],
  },
  recent: {
    category: [{ name: "file", label: "File" }],
  },
  starred: {
    category: [{ name: "folder", label: "Folder" }],
  },
} as const;
type SearchCategoryType = typeof SEARCH_CATEGORY;
type ExtractNames<T> = T extends { category: readonly { name: infer N }[] } ? N : never;
export type SEARCH_CATEGORY_NAME = ExtractNames<SearchCategoryType[keyof SearchCategoryType]>;

export const SORT_CATEGORY = {
  file: {
    category: [
      { name: "file-name", label: "Name" },
      { name: "file-size", label: "Size" },
      { name: "upload-time", label: "Upload Time" },
    ],
  },
  folder: {
    category: [
      { name: "folder-name", label: "Name" },
      { name: "last-modified", label: "Last Modified" },
    ],
  },
} as const;
type SortCategoryName = typeof SORT_CATEGORY;
export type SORT_CATEGORY_NAME = ExtractNames<SortCategoryName[keyof SortCategoryName]>;

/**
 * Type Guard Functions
 */
const isFileResult = (item: any): item is FileSearchResult => item?.resultType === "file" && typeof item.file_id === "string";
const isFolderResult = (item: any): item is FolderResultSearch =>
  item?.resultType === "folder" && typeof item.folder_id === "string";

export { isFileResult, isFolderResult };
