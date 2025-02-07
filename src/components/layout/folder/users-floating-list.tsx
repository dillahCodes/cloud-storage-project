import { UserDataDb } from "@/features/auth/auth";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import AvatarWithUserPhoto from "../avatar/avatar-with-user-photo";
import AvatarOnlyIcon from "../avatar/avatar-only-icon";
import classNames from "classnames";

interface UsersFloatingDataListProps {
  usersData: UserDataDb[];
  folderId: string;
  handleClick: (userData: UserDataDb) => void;
  withBorder?: boolean;
}

const { Text } = Typography;
const UsersFloatingDataList: React.FC<UsersFloatingDataListProps> = ({ usersData, handleClick, withBorder = true }) => {
  return (
    <Flex
      className={classNames("max-h-[200px]  rounded-sm p-1", {
        "border-2 border-black": withBorder,
      })}
      vertical
      style={withBorder ? neoBrutalBorderVariants.small : {}}
    >
      {usersData.map((user) => (
        <Flex key={user.uid} align="center" gap="middle" onClick={() => handleClick(user)}>
          <div>{user.photoURL ? <AvatarWithUserPhoto src={user.photoURL} size={30} /> : <AvatarOnlyIcon size={30} />}</div>

          <Flex vertical>
            <Text className="text-sm font-bold font-archivo">{user.displayName}</Text>
            <Text className="text-sm font-archivo line-clamp-1">{user.email}</Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};

export default UsersFloatingDataList;
