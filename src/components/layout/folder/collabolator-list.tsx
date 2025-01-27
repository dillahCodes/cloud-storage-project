import useUser from "@/features/auth/hooks/use-user";
import { CollaboratorMenuItem } from "@/features/folder/collaborator-menu";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { withFloatingElement } from "@components/hoc/with-floating-element";
import { Flex, Typography } from "antd";
import { TiArrowSortedDown } from "react-icons/ti";
import AvatarOnlyIcon from "../avatar/avatar-only-icon";
import AvatarWithUserPhoto from "../avatar/avatar-with-user-photo";
import CollabolatorRoleDropdown from "./collabolator-role-dropdown";
import { CollaboratorUserData } from "@/features/collaborator/collaborator";

const { Text } = Typography;
const FlexWithFloatingElement = withFloatingElement(Flex);

interface CollabolatorsListProps {
  data: CollaboratorUserData;
  roleList?: CollaboratorMenuItem[];
  folderData: RootFolderGetData | SubFolderGetData | null;
}

const CollabolatorList: React.FC<CollabolatorsListProps> = ({ data, roleList, folderData }) => {
  const { user } = useUser();

  const isMyselfData = user?.uid === data.userId;
  const isOwner = data.role === "owner";

  return (
    <Flex className="w-full" gap="middle" align="center" justify="space-between">
      {/* Avatar dan informasi pengguna */}
      <Flex align="center" gap="middle">
        {data.photoUrl ? <AvatarWithUserPhoto alt={data.name} size={35} src={data.photoUrl} /> : <AvatarOnlyIcon size={35} />}

        <Flex vertical gap={3}>
          <Text className="text-sm font-medium">{isMyselfData ? `${data.name} (you)` : data.name}</Text>
          <Text className="text-xs">{data.email}</Text>
        </Flex>
      </Flex>

      {/* Dropdown untuk role */}
      <FlexWithFloatingElement
        align="center"
        gap="small"
        rightPosition={5}
        parentFloatingElementClassName="rounded-sm z-10"
        floatingElement={
          !isOwner ? <CollabolatorRoleDropdown folderData={folderData} roleData={data} roleList={roleList} roleSelected={data.role} /> : null
        }
      >
        <Text disabled={isOwner} className="text-sm ml-auto min-w-fit font-medium font-archivo capitalize">
          {data.role}
        </Text>
        <Text disabled={isOwner} className="text-sm ml-auto font-medium font-archivo">
          <TiArrowSortedDown />
        </Text>
      </FlexWithFloatingElement>
    </Flex>
  );
};

export default CollabolatorList;
