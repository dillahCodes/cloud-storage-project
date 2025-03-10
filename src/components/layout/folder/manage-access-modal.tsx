import useGetCollaboratorsByNameOrEmail from "@/features/collaborator/hooks/use-get-collaborators-by-name-or-email";
import useModalManageAccessContentSetState from "@/features/collaborator/hooks/use-modal-manage-access-content-setstate";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import copyToClipboard from "@/util/copy-to-clipboard";
import { withDynamicFloatingElement } from "@components/hoc/with-dynamic-floating-element";
import Button from "@components/ui/button";
import { Flex, Input, Spin, Typography } from "antd";
import { useMemo, useState } from "react";
import { IoLink } from "react-icons/io5";
import GeneralAccess from "./general-access";
import PeopleWithAcess from "./people-with-acess";
import UsersFloatingDataList from "./users-floating-list";
import SecureFolder from "./secure-folder";
import useOnSecuredFolderChange from "@/features/collaborator/hooks/use-secured-folder-on-data-change";
import useSecuredFoldertoggleHandler from "@/features/collaborator/hooks/use-secured-folder-toggle-handler";
import { modalManageAccessContentSelector } from "@/features/collaborator/slice/modal-manage-access-content-slice";
import { useSelector } from "react-redux";
import { detailFolderPermissionsSelector } from "@/features/permissions/slice/details-folder-permissions";
import useAddCollaboratorsSelectedToState from "@/features/collaborator/hooks/use-add-collaborators-selected-to-state";

const { Text } = Typography;
const InputWithFloatingElement = withDynamicFloatingElement(Input);
const ManageAccessModalComponent: React.FC = () => {
  const [inputSearchUser, setInputSearchUser] = useState<string>("");

  /**
   * state and add data to state
   */
  const { setModalOpen } = useModalManageAccessContentSetState({});
  const { handleAddCollaborator } = useAddCollaboratorsSelectedToState();
  const { folderData, collaboratorsUserData, generalData } = useSelector(modalManageAccessContentSelector);
  const detailsPermissions = useSelector(detailFolderPermissionsSelector);

  /**
   * logic get folder id
   */
  const folderId = useMemo(() => folderData?.folder_id ?? "", [folderData]);

  /**
   * logic should show secured folder component:
   * dont show if is root folder or cant CRUD
   */
  const dontShowSecuredFolder = useMemo(() => {
    return !detailsPermissions.actionPermissions.canCRUD || !folderData?.parent_folder_id;
  }, [detailsPermissions.actionPermissions.canCRUD, folderData?.parent_folder_id]);

  /**
   * get data from server
   */
  const { collaboratorsFetched, handleSearchUsersWithDebounce } = useGetCollaboratorsByNameOrEmail();
  const isCollaboratorValid = useMemo(() => collaboratorsFetched && collaboratorsFetched.length > 0, [collaboratorsFetched]);

  const { isSecuredFolderActive, statusFetch } = useOnSecuredFolderChange({ folderId });
  const isSecuredFolderDataLoading = useMemo(() => statusFetch === "loading", [statusFetch]);
  const { handleToggleSecuredFolder } = useSecuredFoldertoggleHandler({ isSecuredFolderActive, folderId, folderData });

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

  const UserListFloatingComponent = () => {
    return isCollaboratorValid ? (
      <UsersFloatingDataList
        handleClick={handleAddCollaborator}
        withBorder={false}
        folderId={folderData?.folder_id}
        usersData={collaboratorsFetched}
      />
    ) : null;
  };

  return (
    <Flex className="w-full" vertical gap="middle">
      <Text className="text-lg line-clamp-1 w-full">Share "{folderData?.folder_name}"</Text>
      <InputWithFloatingElement
        isFloatingOpen={isCollaboratorValid}
        onChange={handleInputSearchUserChange}
        value={inputSearchUser}
        floatingElClassName="z-10 w-full"
        floatingContent={<UserListFloatingComponent />}
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

      {/* secure folder */}
      {!dontShowSecuredFolder && (
        <SecureFolder
          isChecked={isSecuredFolderActive}
          isLoading={isSecuredFolderDataLoading}
          handleToggle={handleToggleSecuredFolder}
        />
      )}

      <Flex className="w-full" gap="small" justify="space-between">
        <Button
          className="flex items-center font-archivo justify-center rounded-sm text-black"
          icon={<IoLink className="text-lg" />}
          onClick={handleClipboard}
        >
          Copy Link
        </Button>
        <Button
          className="flex items-center font-archivo justify-center rounded-sm text-black"
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
