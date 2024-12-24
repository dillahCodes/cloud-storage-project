import { withFloatingElement } from "@components/hoc/with-floating-element";
import { Button } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";

const DesktopFolderOptionsButton: React.FC = () => {
  return (
    <Button size="small" className="p-0.5 text-black bg-transparent shadow-none border-none">
      <BsThreeDotsVertical className="text-xl" />
    </Button>
  );
};

export default DesktopFolderOptionsButton;

export const DesktopFolderOptionsButtonWithFloatingElement = withFloatingElement(DesktopFolderOptionsButton);
