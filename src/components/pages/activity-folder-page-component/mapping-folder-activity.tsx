import {
  ActivityGrouping,
  CreateFolderActivityWithUserData,
  DeleteFolderActivityWithUserData,
  RenameFolderActivityWithUserData,
} from "@/features/folder/folder-activity";
import useGetFolderActivity from "@/features/folder/hooks/use-get-folder-activity";
import { folderActivitySelector } from "@/features/folder/slice/folder-activity-slice";
import useDrawer from "@/hooks/use-drawer";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import Button from "@components/ui/button";
import { Flex } from "antd";
import classNames from "classnames";
import { MdArrowBackIosNew } from "react-icons/md";
import { useSelector } from "react-redux";
import CreateFolderActivityCard from "./create-folder-activity-card";
import LoadingActivity from "./loading-activity";
import RenameFolderActivityCard from "./rename-folder-activity-card";
import { useNavigate } from "react-router-dom";
import DeleteFolderActivityCard from "./delete-folder-activity-card";

const MappingFolderActivity: React.FC = () => {
  useGetFolderActivity();

  const navigate = useNavigate();

  const { isDesktopDevice } = useGetClientScreenWidth();
  const { toggleDrawerDekstop } = useDrawer();

  const activityState = useSelector(folderActivitySelector);

  const isLoading = activityState.status === "loading";
  const isSuccess = activityState.status === "succeeded";

  const handleBack = () => {
    isDesktopDevice && toggleDrawerDekstop();
    !isDesktopDevice && navigate(-1);
  };

  return (
    <Flex className={classNames("h-full w-full p-3")} vertical gap="large">
      {isLoading && <LoadingActivity />}
      {isSuccess && (
        <Button
          onClick={handleBack}
          className="w-fit text-sm capitalize font-archivo text-black"
          type="primary"
          size="small"
          icon={<MdArrowBackIosNew />}
        >
          back
        </Button>
      )}
      {isSuccess && <MappingData data={activityState.activity} />}
    </Flex>
  );
};

export default MappingFolderActivity;

const MappingData: React.FC<{ data: ActivityGrouping[] }> = ({ data }) => {
  return data.map((activity) => (
    <Flex vertical className="w-full pb-3" key={activity.groupId}>
      {activity.groupType === "rename-folder-activity" && (
        <RenameFolderActivityCard activityData={activity.activities as RenameFolderActivityWithUserData[]} />
      )}
      {activity.groupType === "create-folder-activity" && (
        <CreateFolderActivityCard groupDate={activity.groupByDate} activityData={activity.activities as CreateFolderActivityWithUserData[]} />
      )}
      {activity.groupType === "delete-folder-activity" && (
        <DeleteFolderActivityCard groupDate={activity.groupByDate} activityData={activity.activities as DeleteFolderActivityWithUserData[]} />
      )}
    </Flex>
  ));
};
