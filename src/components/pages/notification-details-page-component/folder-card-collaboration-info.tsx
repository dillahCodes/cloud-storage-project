import useBreadcrumbSetState from "@/features/breadcrumb/hooks/use-breadcrumb-setstate";
import useBreadcrumbState from "@/features/breadcrumb/hooks/use-breadcrumb-state";
import { currentMessageSelector } from "@/features/message/slice/current-message-slice";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { BsPersonWorkspace } from "react-icons/bs";
import { RiFolderFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const FodlerCardCollaborationInfo = () => {
  const navigate = useNavigate();
  const { currentMessage, senderUserData } = useSelector(currentMessageSelector);
  const { items } = useBreadcrumbState();
  const { deleteByKey } = useBreadcrumbSetState();

  const handleNavigate = () => {
    if (items[1]) deleteByKey(items[1].key);
    // if root folder is mine go to my storage else go to shared with me
    navigate(`/storage/folders/${currentMessage?.folderId}?st=shared-with-me`);
  };

  return (
    <Flex
      className="max-w-sm p-3 w-full mx-auto border-2 border-black"
      vertical
      gap="small"
      style={{ ...neoBrutalBorderVariants.small }}
    >
      <Text className="font-bold text-sm font-archivo mx-auto">Collaboration Invitation</Text>
      <Text className=" text-7xl font-archivo mx-auto">
        <BsPersonWorkspace />
      </Text>
      <Flex vertical>
        <Text className="text-sm font-archivo mx-auto line-clamp-2 text-center ">{senderUserData?.email}</Text>
        <Text className="text-sm font-archivo mx-auto line-clamp-2 text-center ">
          has invited you to collaborate on a folder.
        </Text>
      </Flex>
      <Button
        type="primary"
        className="font-archivo text-black text-sm rounded-sm"
        onClick={handleNavigate}
        icon={<RiFolderFill />}
      >
        Go to folder
      </Button>
    </Flex>
  );
};

export default FodlerCardCollaborationInfo;
