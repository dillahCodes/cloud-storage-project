import { Flex, Typography } from "antd";
import CollabolatorList from "./collabolator-list";
import { memo } from "react";
import useUser from "@/features/auth/hooks/use-user";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { CollaboratorUserData } from "@/features/collaborator/collaborator";
import { collaboratorMenu } from "@/features/collaborator/collaborator-menu";

interface PeopleWithAcessProps {
  collabolators: CollaboratorUserData[] | null;
  folderData: RootFolderGetData | SubFolderGetData | null;
}

const { Text } = Typography;
const PeopleWithAcess: React.FC<PeopleWithAcessProps> = ({ collabolators, folderData }) => {
  const { user } = useUser();
  const getMyMenu = collabolators?.find((collaborator) => collaborator.userId === user?.uid);
  const menu = getMyMenu ? collaboratorMenu(getMyMenu.role) : [];

  return (
    <>
      <Text className="text-base capitalize font-medium">people with access</Text>
      <Flex className="w-full" vertical gap="middle">
        {collabolators &&
          collabolators.map((collabolator) => (
            <CollabolatorList folderData={folderData} roleList={menu} data={collabolator} key={collabolator.userId} />
          ))}
      </Flex>
    </>
  );
};

export default memo(PeopleWithAcess);
