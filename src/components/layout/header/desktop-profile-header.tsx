import { Flex, Typography } from "antd";
import AvatarWithUserPhoto, { WithFloatingElementAvatarUserPhoto } from "../avatar/avatar-with-user-photo";
import { AuthState } from "@/features/auth/auth";
import { LuUserCog } from "react-icons/lu";
import Button from "@components/ui/button";
import { BiLogOut } from "react-icons/bi";
import logOut from "@/features/auth/logout";
import AvatarOnlyIcon, { WithFloatingElementAvatarOnlyIcon } from "../avatar/avatar-only-icon";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface DesktopProfileHeaderProps {
  user: AuthState["user"];
}
const DesktopProfileHeader: React.FC<DesktopProfileHeaderProps> = ({ user }) => {
  if (user?.photoURL) {
    return (
      <WithFloatingElementAvatarUserPhoto
        neoBrutalBorderVariants="medium"
        parentFloatingElementClassName="rounded-md border-2 border-black p-3"
        topPosition={53}
        rightPosition={5}
        floatingElement={<Profile user={user} />}
        src={user?.photoURL}
        parentZIndex={3}
      />
    );
  } else {
    return (
      <WithFloatingElementAvatarOnlyIcon
        neoBrutalBorderVariants="medium"
        parentFloatingElementClassName="rounded-md border-2 border-black p-3"
        topPosition={53}
        rightPosition={5}
        floatingElement={<Profile user={user} />}
        parentZIndex={3}
      />
    );
  }
};

export default DesktopProfileHeader;

interface ProfileProps {
  user: AuthState["user"];
}
const Profile: React.FC<ProfileProps> = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="h-[200px]">
      <Flex vertical justify="center" align="center" className="h-full" gap="middle">
        {user?.photoURL ? <AvatarWithUserPhoto size={70} src={user?.photoURL} /> : <AvatarOnlyIcon size={70} />}
        <Flex vertical align="center" justify="center">
          <Text className="capitalize text-lg font-archivo font-bold">Hi, {user?.displayName || "User"}</Text>
          <Text className=" text-xs  font-archivo">{user?.email}</Text>
        </Flex>
        <Flex gap="small">
          <Button type="primary" className="rounded-none" neoBrutalType="medium" onClick={() => navigate("/storage/profile", { replace: true })}>
            <Flex align="center" gap="middle" className=" rounded-md w-full">
              <Text className="text-lg">
                <LuUserCog />
              </Text>
              <Text className="capitalize text-sm font-archivo">profile</Text>
            </Flex>
          </Button>
          <Button className="rounded-sm" neoBrutalType="medium" onClick={logOut}>
            <Flex align="center" gap="middle" className=" rounded-md w-full">
              <Text className="text-lg">
                <BiLogOut />
              </Text>
              <Text className="capitalize text-sm font-archivo">logout</Text>
            </Flex>
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};
