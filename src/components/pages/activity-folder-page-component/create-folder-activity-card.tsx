import useUser from "@/features/auth/hooks/use-user";
import { ActivityGrouping, CreateFolderActivityWithUserData } from "@/features/folder/folder-activity";
import abbreviateText from "@/util/abbreviate-text";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import classNames from "classnames";
import { memo, useMemo, useState } from "react";
import { GoDatabase } from "react-icons/go";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdFolderOpen } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ActivityProfileCard from "./activity-profile-card";
import ChildFileComponent from "./child-file-component";
import ChildFolderComponent from "./child-folder-component";

interface CreateFolderActivityProps {
  activityData: CreateFolderActivityWithUserData[];
  groupDate: ActivityGrouping["groupByDate"];
}

const { Text } = Typography;
const CreateFolderActivityCard: React.FC<CreateFolderActivityProps> = ({ activityData, groupDate }) => {
  const navigate = useNavigate();

  const { user } = useUser();

  const [isShowMoreActive, setIsShowMoreActive] = useState<boolean>(false);

  const activityDataWithIsShowMore = useMemo(() => {
    if (isShowMoreActive) return activityData;
    return activityData.slice(0, 2);
  }, [activityData, isShowMoreActive]);

  const activityUserData = useMemo(() => activityData[0].user, [activityData]);

  const activityTitle = useMemo(() => {
    const isCurrentUser = activityUserData?.uid === user?.uid;
    const displayName = activityUserData?.displayName ?? "Unknown User";
    const count = activityData.length > 1 ? `${activityData.length} items` : "an item";

    return `${isCurrentUser ? "You" : displayName} created ${count} in`;
  }, [activityUserData, user, activityData]);

  const parentFolderData = useMemo(() => {
    const { parentFolderName, parentFolderId } = activityData[0].activity;
    return { parentFolderName, parentFolderId };
  }, [activityData]);

  const rootFolderData = useMemo(() => {
    const { rootFolderOwnerUserId, rootFolderId } = activityData[0].activity;
    return { rootFolderOwnerUserId, rootFolderId };
  }, [activityData]);

  const toggleSetShowMoreActive = () => setIsShowMoreActive((prev) => !prev);

  const handleNavigateParentFolder = () => {
    const isOwner = user?.uid === rootFolderData.rootFolderOwnerUserId;
    isOwner
      ? navigate(`/storage/folders/${parentFolderData.parentFolderId}?st=my-storage`)
      : navigate(`/storage/folders/${parentFolderData.parentFolderId}?st=shared-with-me`);
  };

  return (
    <Flex vertical gap="small" className="w-full">
      <Flex className="w-full" vertical gap="small">
        <ActivityProfileCard date={groupDate} userData={activityUserData} title={activityTitle} />
      </Flex>

      <Flex vertical className="ml-[60px] w-fit" gap="small">
        <Button
          type="primary"
          className="w-fit py-3 text-black"
          size="small"
          onClick={handleNavigateParentFolder}
          icon={parentFolderData.parentFolderId ? <MdFolderOpen className="text-xl" /> : <GoDatabase className="text-xl" />}
        >
          <Text className=" font-archivo text-sm">{abbreviateText(parentFolderData.parentFolderName ?? "My Storage", 10)}</Text>
        </Button>

        {activityDataWithIsShowMore.map((activity) =>
          activity.activity.fileName && activity.activity.fileType ? (
            <ChildFileComponent key={activity.activity.activityId} activity={activity.activity} />
          ) : (
            <ChildFolderComponent key={activity.activity.activityId} activityData={activity.activity} />
          )
        )}
      </Flex>

      {activityData.length > 2 && (
        <Flex onClick={toggleSetShowMoreActive} align="center" className="mt-3 cursor-pointer">
          <Text className="font-archivo text-sm">{isShowMoreActive ? "Show less" : "Show all"}</Text>
          <Text className={classNames("text-xl transition-all duration-300", { "rotate-180": isShowMoreActive })}>
            <IoMdArrowDropdown />
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default memo(CreateFolderActivityCard);
