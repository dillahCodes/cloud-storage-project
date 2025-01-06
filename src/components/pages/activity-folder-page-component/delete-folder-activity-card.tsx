import useUser from "@/features/auth/hooks/use-user";
import { ActivityGrouping, DeleteFolderActivityWithUserData } from "@/features/folder/folder-activity";
import abbreviateText from "@/util/abbreviate-text";
import FileIconsVariant from "@components/layout/file/file-icons-variant";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import classNames from "classnames";
import { useMemo, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import ActivityProfileCard from "./activity-profile-card";
import ChildFolderComponent from "./child-folder-component";

interface DeleteFolderActivityCardProps {
  activityData: DeleteFolderActivityWithUserData[];
  groupDate: ActivityGrouping["groupByDate"];
}

const { Text } = Typography;
const DeleteFolderActivityCard: React.FC<DeleteFolderActivityCardProps> = ({ activityData, groupDate }) => {
  const { user } = useUser();

  const [isShowMoreActive, setIsShowMoreActive] = useState<boolean>(false);

  const activityDataWithIsShowMore = useMemo(() => {
    if (isShowMoreActive) return activityData;
    return activityData.slice(0, 3);
  }, [activityData, isShowMoreActive]);

  const activityUserData = useMemo(() => activityData[0].user, [activityData]);

  const activityTitle = useMemo(() => {
    const isCurrentUser = activityUserData?.uid === user?.uid;
    const displayName = activityUserData?.displayName ?? "Unknown User";
    const count = activityData.length > 1 ? `${activityData.length} items` : "an item";

    return `${isCurrentUser ? "You" : displayName} deleted ${count}`;
  }, [activityUserData, user, activityData]);

  const toggleSetShowMoreActive = () => setIsShowMoreActive((prev) => !prev);

  return (
    <Flex vertical gap="small" className="w-full">
      <Flex className="w-full" vertical gap="small">
        <ActivityProfileCard date={groupDate} userData={activityUserData} title={activityTitle} />
      </Flex>

      <Flex vertical className="ml-[60px] w-fit" gap="small">
        {activityDataWithIsShowMore.map((activity) =>
          !activity.activity.fileName && !activity.activity.fileType ? (
            <ChildFolderComponent wihtArrow={false} key={activity.activity.activityId} activityData={activity.activity} />
          ) : (
            <FileCompponent key={activity.activity.activityId} activity={activity} />
          )
        )}
      </Flex>

      {activityData.length > 3 && (
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

export default DeleteFolderActivityCard;

const FileCompponent: React.FC<{ activity: DeleteFolderActivityWithUserData }> = ({ activity }) => {
  return (
    <Flex className="w-fit ml-1" gap="small" key={activity.activity.activityId}>
      <Button
        type="primary"
        className="w-fit py-3 text-black"
        size="small"
        icon={
          <div className="text-sm">
            <FileIconsVariant fileType={activity.activity.fileType as string} />
          </div>
        }
      >
        <Text className=" font-archivo text-sm">{abbreviateText(activity.activity.fileName as string, 10)}</Text>
      </Button>
    </Flex>
  );
};
