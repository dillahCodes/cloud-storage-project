import { GoDatabase } from "react-icons/go";
import { LOCATION_NAME, SEARCH_CATEGORY_NAME, SORT_CATEGORY_NAME } from "./search-menu";
import {
  MdAccessTime,
  MdAlternateEmail,
  MdFolderOpen,
  MdOutlineNotifications,
  MdOutlineShare,
  MdOutlineSortByAlpha,
  MdOutlineStarOutline,
} from "react-icons/md";
import { FaRegFile } from "react-icons/fa";
import { WiTime10 } from "react-icons/wi";
import { TbNumber123 } from "react-icons/tb";

const RenderSearchLocationIcon: React.FC<{ name: LOCATION_NAME }> = ({ name }) => {
  switch (name) {
    case "my-storage":
      return <GoDatabase />;
    case "shared-with-me":
      return <MdOutlineShare />;
    case "recent":
      return <MdAccessTime />;
    case "starred":
      return <MdOutlineStarOutline />;
    case "notifications":
      return <MdOutlineNotifications />;
    default:
      return <GoDatabase />;
  }
};

const RenderSearchCategoryIcon: React.FC<{ name: SEARCH_CATEGORY_NAME }> = ({ name }) => {
  switch (name) {
    case "file":
      return <FaRegFile />;
    case "folder":
      return <MdFolderOpen />;
    default:
      return <MdFolderOpen />;
  }
};

const RenderSortCategoryIcon: React.FC<{ name: SORT_CATEGORY_NAME }> = ({ name }) => {
  switch (name) {
    case "file-name":
      return <MdOutlineSortByAlpha />;
    case "file-size":
      return <TbNumber123 />;
    case "upload-time":
      return <WiTime10 />;
    case "folder-name":
      return <MdOutlineSortByAlpha />;
    case "last-modified":
      return <WiTime10 />;
    case "notif-name":
      return <MdOutlineSortByAlpha />;
    case "notif-email":
      return <MdAlternateEmail />;
    default:
      return <MdFolderOpen />;
  }
};

export { RenderSearchLocationIcon, RenderSearchCategoryIcon, RenderSortCategoryIcon };
