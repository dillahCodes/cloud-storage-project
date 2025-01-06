import useUser from "@/features/auth/hooks/use-user";
import { CreateFolderActivity, DeleteFolderActivity } from "@/features/folder/folder-activity";
import abbreviateText from "@/util/abbreviate-text";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { useMemo } from "react";
import { MdFolderOpen } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface ChildFolderComponentProps {
  activityData: CreateFolderActivity | DeleteFolderActivity;
  wihtArrow?: boolean;
}

const { Text } = Typography;
const ChildFolderComponent: React.FC<ChildFolderComponentProps> = ({ activityData, wihtArrow = true }) => {
  const navigate = useNavigate();

  const { user } = useUser();

  const rootFolderData = useMemo(() => {
    const { rootFolderOwnerUserId, rootFolderId } = activityData;
    return { rootFolderOwnerUserId, rootFolderId };
  }, [activityData]);

  const folderData = useMemo(() => {
    const { folderId, folderName } = activityData;
    return { folderId, folderName };
  }, [activityData]);

  const handleNavigate = () => {
    const isOwner = user?.uid === rootFolderData.rootFolderOwnerUserId;
    isOwner
      ? navigate(`/storage/folders/${folderData.folderId}?st=my-storage`)
      : navigate(`/storage/folders/${folderData.folderId}?st=shared-with-me`);
  };

  return (
    <Flex className="w-fit ml-1" gap="small">
      {wihtArrow && <div className="w-3 h-3 border border-black border-t-0 border-r-0" />}
      <Button type="primary" className="w-fit py-3 text-black" onClick={handleNavigate} size="small" icon={<MdFolderOpen className="text-xl" />}>
        <Text className=" font-archivo text-sm">{abbreviateText(activityData.folderName, 10)}</Text>
      </Button>
    </Flex>
  );
};

export default ChildFolderComponent;
