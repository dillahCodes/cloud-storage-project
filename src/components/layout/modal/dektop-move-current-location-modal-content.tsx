import { dekstopMoveSelector } from "@/features/move-folder-or-file/slice/dekstop-move-slice";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { useMemo } from "react";
import { BsDatabase } from "react-icons/bs";
import { IoMdFolderOpen } from "react-icons/io";
import { useSelector } from "react-redux";

const { Text } = Typography;
const DektopMoveCurrentLocationModalContent: React.FC = () => {
  const { locationParentFolderId, locationParentFolderName } = useSelector(dekstopMoveSelector);

  const renderCurrentLocation = useMemo(
    () => ({ folderId: locationParentFolderId || null, folderName: locationParentFolderName || "my storage" }),
    [locationParentFolderId, locationParentFolderName]
  );

  const renderIcon = () => {
    switch (renderCurrentLocation.folderName) {
      case "my storage":
        return <BsDatabase className="text-base" />;

      default:
        return <IoMdFolderOpen className="text-base" />;
    }
  };

  return (
    <Flex align="center" gap="middle">
      <Text className="text-sm font-archivo">Current location:</Text>
      <Button className="text-sm text-black font-archivo" type="primary" icon={renderIcon()}>
        {renderCurrentLocation.folderName}
      </Button>
    </Flex>
  );
};

export default DektopMoveCurrentLocationModalContent;
