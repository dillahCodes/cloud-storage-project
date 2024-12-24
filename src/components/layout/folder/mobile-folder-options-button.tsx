import withDrawer from "@components/hoc/with-drawer";
import { Button } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";

const MobileFolderOptionsButton = () => {
  return (
    <Button size="small" id="folder-options" className="p-0.5 text-black bg-transparent shadow-none border-none">
      <BsThreeDotsVertical className="text-xl" />
    </Button>
  );
};

const MobileFolderOptionsButtonWithBottomDrawer = withDrawer(MobileFolderOptionsButton);
export default MobileFolderOptionsButtonWithBottomDrawer;
