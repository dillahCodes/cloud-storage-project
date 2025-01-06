import useUser from "@/features/auth/hooks/use-user";
import { CreateFolderActivity } from "@/features/folder/folder-activity";
import abbreviateText from "@/util/abbreviate-text";
import FileIconsVariant from "@components/layout/file/file-icons-variant";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface ChildFileComponentProps {
  activity: CreateFolderActivity;
}
const ChildFileComponent: React.FC<ChildFileComponentProps> = ({ activity }) => {
  const navigate = useNavigate();

  const { user } = useUser();

  const handleNavigateToFile = () => {
    const param: NestedBreadcrumbType = activity.rootFolderOwnerUserId === user?.uid ? "my-storage" : "shared-with-me";
    navigate(`/storage/folders/${activity.parentFolderId}?st=${param}`);
  };

  return (
    <Flex className="w-fit ml-1" gap="small">
      <div className="w-3 h-3 border border-black border-t-0 border-r-0" />

      <Button
        type="primary"
        className="w-fit py-3 text-black"
        size="small"
        onClick={handleNavigateToFile}
        icon={
          <div className="text-sm">
            <FileIconsVariant fileType={activity.fileType as string} />
          </div>
        }
      >
        <Text className=" font-archivo text-sm">{abbreviateText(activity.fileName as string, 10)}</Text>
      </Button>
    </Flex>
  );
};

export default ChildFileComponent;
