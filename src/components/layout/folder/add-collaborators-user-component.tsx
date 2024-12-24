import { UserDataDb } from "@/features/auth/auth";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import AvatarWithUserPhoto from "../avatar/avatar-with-user-photo";
import AvatarOnlyIcon from "../avatar/avatar-only-icon";
import { IoMdClose } from "react-icons/io";

interface AddCollaboratorsUserComponenProps {
  user: UserDataDb;
  handleRemoveUserById: (id: string) => void;
}

const { Text } = Typography;
const AddCollaboratorsUserComponent: React.FC<AddCollaboratorsUserComponenProps> = ({ user, handleRemoveUserById }) => (
  <Flex
    align="center"
    gap="small"
    className="bg-[#ff87a6] p-1 rounded-full w-[80%]   border border-black"
    style={neoBrutalBorderVariants.small}
  >
    <div>{user.photoURL ? <AvatarWithUserPhoto src={user.photoURL} size={25} /> : <AvatarOnlyIcon size={25} />}</div>
    <Text className="font-archivo font-bold text-xs  line-clamp-1">{user.email}</Text>
    <Text className="text-sm p-0.5" onClick={() => handleRemoveUserById(user.uid)}>
      <IoMdClose />
    </Text>
  </Flex>
);

export default AddCollaboratorsUserComponent;
