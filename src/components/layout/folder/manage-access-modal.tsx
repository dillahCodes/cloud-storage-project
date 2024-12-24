import useAddCollaboratorsSelectedToState from "@/features/folder/hooks/use-add-collaborators-selected-to-state";
import useGetCollaboratorsByNameOrEmail from "@/features/folder/hooks/use-get-collaborators-by-name-or-email";
import useModalManageAccessContentSetState from "@/features/folder/hooks/use-modal-manage-access-content-setstate";
import useModalManageAccessContentState from "@/features/folder/hooks/use-modal-manage-access-content-state";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import copyToClipboard from "@/util/copy-to-clipboard";
import { withDynamicFloatingElement } from "@components/hoc/with-dynamic-floating-element";
import Button from "@components/ui/button";
import { Flex, Input, Spin, Typography } from "antd";
import { useState } from "react";
import { IoLink } from "react-icons/io5";
import GeneralAccess from "./general-access";
import PeopleWithAcess from "./people-with-acess";
import UsersFloatingDataList from "./users-floating-list";

const { Text } = Typography;
const InputWithFloatingElement = withDynamicFloatingElement(Input);
const ManageAccessModalComponent: React.FC = () => {
  const [inputSearchUser, setInputSearchUser] = useState<string>("");

  const { folderData, collaboratorsUserData, generalData } = useModalManageAccessContentState();
  const { collaboratorsFetched, handleSearchUsersWithDebounce } = useGetCollaboratorsByNameOrEmail();
  const { handleAddCollaborator } = useAddCollaboratorsSelectedToState();

  const isCollaboratorValid = collaboratorsFetched && collaboratorsFetched.length > 0;

  const { setModalOpen } = useModalManageAccessContentSetState({});

  /*
   * handle copy to clipboard
   */
  const handleClipboard = async () => {
    const params: NestedBreadcrumbType = "shared-with-me";
    const folderId = folderData?.folder_id ?? "";

    const domain = window.location.origin;
    const url = `${domain}/storage/folders/${folderId}?st=${params}`;

    await copyToClipboard(url);
  };

  /*
   * handle input search user change
   */
  const handleInputSearchUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputSearchUser(value);
    handleSearchUsersWithDebounce(value);
  };

  if (!collaboratorsUserData || !folderData)
    return (
      <Flex className="w-full h-full" justify="center" align="center">
        <Spin />
      </Flex>
    );

  return (
    <Flex className="w-full" vertical gap="middle">
      <Text className="text-lg line-clamp-1 w-full">Share "{folderData?.folder_name}"</Text>
      <InputWithFloatingElement
        isFloatingOpen={isCollaboratorValid}
        neoBrutalVariant="small"
        onChange={handleInputSearchUserChange}
        value={inputSearchUser}
        floatingElClassName="z-10"
        floatingContent={
          isCollaboratorValid ? (
            <UsersFloatingDataList
              handleClick={handleAddCollaborator}
              withBorder={false}
              folderId={folderData?.folder_id}
              usersData={collaboratorsFetched}
            />
          ) : null
        }
        className="w-full border-2  border-black rounded-sm placeholder:text-sm placeholder:capitalize placeholder:font-archivo"
        name="email"
        type="email"
        placeholder="add people by email or username"
        size="large"
        style={neoBrutalBorderVariants.small}
      />

      {/* people with access */}
      <PeopleWithAcess collabolators={collaboratorsUserData} folderData={folderData} />

      {/* general access */}
      <GeneralAccess generalData={generalData} folderId={folderData?.folder_id} />

      <Flex className="w-full" gap="small" justify="space-between">
        <Button className="flex items-center font-archivo justify-center" icon={<IoLink className="text-lg" />} onClick={handleClipboard}>
          Copy Link
        </Button>
        <Button
          className="flex items-center font-archivo justify-center"
          type="primary"
          onClick={() => {
            setModalOpen(false);
          }}
        >
          Done
        </Button>
      </Flex>
    </Flex>
  );
};

export default ManageAccessModalComponent;
