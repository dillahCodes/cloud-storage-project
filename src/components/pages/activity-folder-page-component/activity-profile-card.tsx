import AvatarOnlyIcon from "@components/layout/avatar/avatar-only-icon";
import AvatarWithUserPhoto from "@components/layout/avatar/avatar-with-user-photo";
import { Flex, Typography } from "antd";

interface ActivityProfileCardProps {
  userData: UserDataDb | null;
  title: string;
  date: string;
}

const { Text } = Typography;
const ActivityProfileCard: React.FC<ActivityProfileCardProps> = ({ userData, title, date }) => {
  return (
    <Flex className="w-full" gap="large">
      <div>
        {userData && userData.photoURL ? <AvatarWithUserPhoto src={userData.photoURL} size={35} /> : <AvatarOnlyIcon size={35} />}
      </div>

      <Flex vertical>
        <Text className="font-semibold font-archivo text-sm">{title}</Text>
        <Text className="font-archivo text-sm">{date}</Text>
      </Flex>
    </Flex>
  );
};

export default ActivityProfileCard;
