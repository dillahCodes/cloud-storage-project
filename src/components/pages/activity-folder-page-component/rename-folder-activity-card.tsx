import useUser from "@/features/auth/hooks/use-user";
import { RenameFolderActivityWithUserData, TimestampValue } from "@/features/folder/folder-activity";
import abbreviateText from "@/util/abbreviate-text";
import formatTimestamp from "@/util/format-timestamp";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { memo, useCallback } from "react";
import { MdFolderOpen } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ActivityProfileCard from "./activity-profile-card";

interface RenameItemFolderActivityProps {
  activityData: RenameFolderActivityWithUserData[];
}

const { Text } = Typography;
const RenameFolderActivityCard: React.FC<RenameItemFolderActivityProps> = ({ activityData }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const renderText = useCallback(
    (activity: RenameFolderActivityWithUserData) => {
      if (activity.user?.uid === user?.uid) return "You renamed an item";
      return `${activity.user?.displayName ?? "Unknown User renamed an item"} renamed an item `;
    },
    [user]
  );

  const handleNavigate = (activity: RenameFolderActivityWithUserData) => {
    const isOwner = user?.uid === activity.activity.rootFolderOwnerUserId;
    isOwner
      ? navigate(`/storage/folders/${activity.activity.folderId}?st=my-storage`)
      : navigate(`/storage/folders/${activity.activity.folderId}?st=shared-with-me`);
  };

  return (
    <Flex vertical gap="large" className="w-full">
      {activityData.map((activity) => (
        <Flex className="w-full" key={activity.activity.activityId} vertical gap="small">
          <ActivityProfileCard
            key={activity.activity.activityId}
            userData={activity.user}
            title={renderText(activity)}
            date={formatTimestamp((activity.activity.activityDate as TimestampValue).seconds)}
          />

          <Flex vertical className="ml-[60px] w-fit" gap="small">
            <Button
              type="primary"
              className="w-fit py-3 text-black"
              onClick={() => handleNavigate(activity)}
              size="small"
              icon={<MdFolderOpen className="text-xl" />}
            >
              <Text className=" font-archivo text-sm">{abbreviateText(activity.activity.renamedFolderName, 10)}</Text>
            </Button>

            <Text delete className=" font-archivo text-sm text-center">
              {abbreviateText(activity.activity.folderName, 10)}
            </Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};

export default memo(RenameFolderActivityCard);
