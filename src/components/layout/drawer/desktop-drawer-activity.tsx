import MappingFolderActivity from "@components/pages/activity-folder-page-component/mapping-folder-activity";
import { Flex } from "antd";

const DesktopDrawerActivity: React.FC = () => {
  return (
    <Flex className="h-full" justify="center" align="center" vertical gap="small">
      <MappingFolderActivity />
    </Flex>
  );
};

export default DesktopDrawerActivity;
