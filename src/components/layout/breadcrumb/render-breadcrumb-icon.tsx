import { BsThreeDots } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import { GrStorage } from "react-icons/gr";
import { IoMdFolderOpen } from "react-icons/io";
import { MdAccessTime, MdOutlineNotifications, MdOutlineShare, MdOutlineStarOutline } from "react-icons/md";
import { RxHome, RxPerson } from "react-icons/rx";

const RenderBreadcrumbIcon: React.FC<{ icon: BreadcrumbIconType }> = ({ icon }) => {
  const iconMap = {
    user: <RxPerson />,
    home: <RxHome />,
    share: <MdOutlineShare />,
    recent: <MdAccessTime />,
    star: <MdOutlineStarOutline />,
    trash: <FiTrash2 />,
    folder: <IoMdFolderOpen />,
    notification: <MdOutlineNotifications />,
    truncate: <BsThreeDots />,
    storage: <GrStorage />,
  };
  return iconMap[icon] || null;
};

export default RenderBreadcrumbIcon;
