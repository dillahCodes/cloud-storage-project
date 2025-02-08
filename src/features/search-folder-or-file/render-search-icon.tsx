import { FaRegFile } from "react-icons/fa";
import { GoDatabase } from "react-icons/go";
import { MdAccessTime, MdFolderOpen, MdOutlineShare, MdOutlineSortByAlpha, MdOutlineStarOutline } from "react-icons/md";
import { TbNumber123 } from "react-icons/tb";
import { WiTime10 } from "react-icons/wi";
import { LOCATION_NAME, SEARCH_CATEGORY_NAME, SORT_CATEGORY_NAME } from "./search-menu";

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
    default:
      return <MdFolderOpen />;
  }
};

export { RenderSearchCategoryIcon, RenderSearchLocationIcon, RenderSortCategoryIcon };
