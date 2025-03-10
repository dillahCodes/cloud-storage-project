import { modalAddSelectedCollaboratorsSelector } from "@/features/collaborator/slice/modal-add-selected-collaborators";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import { withDynamicFloatingElement } from "@components/hoc/with-dynamic-floating-element";
import { Flex } from "antd";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import AddCollaboratorsUserComponent from "./add-collaborators-user-component";
import useGetCollaboratorsByNameOrEmail from "@/features/collaborator/hooks/use-get-collaborators-by-name-or-email";
import UsersFloatingDataList from "./users-floating-list";
import { modalManageAccessContentSelector } from "@/features/collaborator/slice/modal-manage-access-content-slice";
import useAddCollaboratorsSelectedToState from "@/features/collaborator/hooks/use-add-collaborators-selected-to-state";

const FlexWithDynamicFloatingElement = withDynamicFloatingElement(Flex);

const AddCollaboratorsInputWithCollaboratorsWillAdded: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * states
   */
  const [inputValue, setInputValue] = useState<string>("");
  const { folderData } = useSelector(modalManageAccessContentSelector);
  const { collaboratorsData: collaboratosListWillAdd } = useSelector(modalAddSelectedCollaboratorsSelector);

  /**
   * hooks
   */
  const { handleSearchUsersWithDebounce, collaboratorsFetched, fetchStatus } = useGetCollaboratorsByNameOrEmail();
  const { handleAddCollaborator, handleRemoveUserById } = useAddCollaboratorsSelectedToState({
    inputRef,
  });

  /*
   * validations
   */
  const isCollaboratosValid = collaboratorsFetched && collaboratorsFetched.length > 0;
  const isWrap: boolean =
    (collaboratosListWillAdd && collaboratosListWillAdd?.length > 1) || inputValue.length >= 6 ? true : false;

  /*
   * handle input change
   */
  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
    handleSearchUsersWithDebounce(inputValue);
  };

  return (
    <FlexWithDynamicFloatingElement
      wraperClassName=" w-4/5"
      floatingElClassName="z-10"
      isOriginalComponentExcluded
      isFloatingOpen={fetchStatus === "success"}
      floatingContent={
        isCollaboratosValid ? (
          <UsersFloatingDataList
            withBorder={false}
            handleClick={handleAddCollaborator}
            folderId={folderData?.folder_id || ""}
            usersData={collaboratorsFetched}
          />
        ) : null
      }
      wrap={isWrap}
      className="w-full p-1 border-2 border-black min-h-[35px] max-h-[100px] overflow-y-auto"
      onClick={() => inputRef?.current?.focus()}
      style={neoBrutalBorderVariants.small}
      gap="small"
    >
      {collaboratosListWillAdd?.map((user) => (
        <AddCollaboratorsUserComponent user={user} key={user.uid} handleRemoveUserById={handleRemoveUserById} />
      ))}

      <input
        type="text"
        ref={inputRef}
        value={inputValue}
        onChange={handleInputOnChange}
        className="focus:outline-none bg-transparent"
        style={{ width: `${inputValue.length || 1}ch` }}
      />
    </FlexWithDynamicFloatingElement>
  );
};

export default AddCollaboratorsInputWithCollaboratorsWillAdded;
