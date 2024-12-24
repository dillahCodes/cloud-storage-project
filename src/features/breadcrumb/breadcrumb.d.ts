type BreadcrumbIconType = "home" | "user" | "share" | "recent" | "star" | "trash" | "folder" | "notification" | "truncate" | "storage";

type NestedBreadcrumbType = "my-storage" | "shared-with-me";

type BreadcrumbPageFirstBreadcrumbLabel =
  | "my storage"
  | "shared with me"
  | "recently viewed"
  | "my profile"
  | "notification"
  | "starred"
  | "trash";

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: BreadcrumbIconType;
  key: string;
}

interface FirstIndexBreadcrumbItem extends Omit<BreadcrumbItem, "key" | "label"> {
  label: BreadcrumbPageFirstBreadcrumbLabel;
  key: BreadcrumbPageFirstBreadcrumbLabel;
}

type BreadcrumbItemFetchStatus = "idle" | "loading" | "succeeded" | "failed";

interface BreadcrumbState {
  items: [FirstIndexBreadcrumbItem, ...BreadcrumbItem[]] | [];
  status: BreadcrumbItemFtechStatus;
}

interface AddBreadcrumbWithIndex {
  item: BreadcrumbItem;
  index: number;
}
