import useUser from "@/features/auth/hooks/use-user";
import AvatarOnlyIcon from "../avatar/avatar-only-icon";
import AvatarWithUserPhoto from "../avatar/avatar-with-user-photo";

const MobileProfileHeader: React.FC = () => {
  const { user } = useUser();
  return user?.photoURL ? <AvatarWithUserPhoto src={user?.photoURL} /> : <AvatarOnlyIcon />;
};

export default MobileProfileHeader;
