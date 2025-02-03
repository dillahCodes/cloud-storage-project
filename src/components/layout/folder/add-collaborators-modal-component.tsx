import useModalManageAccessContentSetState from "@/features/collaborator/hooks/use-modal-manage-access-content-setstate";
import { modalAddSelectedCollaboratorsSelector, resetCollaboratorsState } from "@/features/collaborator/slice/modal-add-selected-collaborators";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import Button from "@components/ui/button";
import { Checkbox, CheckboxProps, Flex, message, Typography } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddCollaboratorsInputWithCollaboratorsWillAdded from "./add-collaborators-input-with-collaborators-will-added";
import AddCollaboratorsUsersRoleList from "./add-collaborators-users-role-list";
import AddCollaboratorsUserRoleDropDownWithDynamicFloatingElement from "./add-collaboratos-user-role-dropdown";
import { GeneralAccessRole } from "@/features/collaborator/collaborator";
import { modalManageAccessContentSelector } from "@/features/collaborator/slice/modal-manage-access-content-slice";
import useAddCollaboratorsSelectedToDb from "@/features/collaborator/hooks/use-add-collaborators-selected-to-db";

interface WithMessageState {
  withMessage: boolean;
  message: string;
}

const { Text } = Typography;
const AddCollaboratorsModalComponent = () => {
  const dispatch = useDispatch();
  const { folderData } = useSelector(modalManageAccessContentSelector);

  const [selectedRole, setSelectedRole] = useState<GeneralAccessRole>("viewer");
  const [withMessage, setWithMessage] = useState<WithMessageState>({
    message: "",
    withMessage: false,
  });

  const { setModalOpen, setModalContentWillRender } = useModalManageAccessContentSetState({});
  const { collaboratorsData: collaboratosListWillAdd } = useSelector(modalAddSelectedCollaboratorsSelector);
  const { handleAddCollaboratorToDb } = useAddCollaboratorsSelectedToDb({
    role: selectedRole.toLowerCase() as GeneralAccessRole,
    collaborators: collaboratosListWillAdd || [],

    folderId: folderData?.folder_id || "",

    withMessage: {
      message: withMessage.message,
      notifyPeople: withMessage.withMessage,
    },

    afterAddCollaborator: () => {
      handleCancel();
      message.open({
        type: "success",
        content: "Collaborators added successfully.",
        className: "font-archivo text-sm",
        key: "collaborators-add-success",
      });
    },
  });

  /**
   * message state onchange handle
   */
  const onChange: CheckboxProps["onChange"] = (e) => {
    setWithMessage((prev) => ({
      ...prev,
      withMessage: e.target.checked,
    }));
  };
  const handleMessageInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWithMessage((prev) => ({
      ...prev,
      message: e.target.value,
    }));
  };

  /**
   * handle modal cancel
   */
  const handleCancel = () => {
    setModalOpen(false);
    dispatch(resetCollaboratorsState());
    setWithMessage({ message: "", withMessage: false });

    /**
     * wait after animation to change state
     */
    setTimeout(() => {
      setModalContentWillRender("manage-access");
    }, 500);
  };

  return (
    <Flex className="w-full" vertical gap="middle">
      <Text className="text-lg line-clamp-1 w-full">Share "{folderData?.folder_name}"</Text>
      {/* input add user list and role */}
      <Flex className="w-full" gap="small" justify="start">
        <AddCollaboratorsInputWithCollaboratorsWillAdded />
        <AddCollaboratorsUserRoleDropDownWithDynamicFloatingElement
          selectedRole={selectedRole}
          wraperClassName="w-1/4 h-[35px] z-10"
          floatingContent={<AddCollaboratorsUsersRoleList handleRoleCallback={setSelectedRole} selectedUsersRole={selectedRole} />}
        />
      </Flex>

      {/* message check */}
      <Checkbox className=" w-fit font-archivo" onChange={onChange}>
        Notify People
      </Checkbox>

      {/* message input */}
      {withMessage.withMessage && (
        <Flex vertical>
          <Text className="text-sm font-archivo font-bold">Message:</Text>
          <textarea
            value={withMessage.message}
            onChange={handleMessageInputChange}
            placeholder="Add Message"
            className="border-2 border-black h-40 focus:outline-none p-1 placeholder:font-archivo placeholder:text-sm"
            style={neoBrutalBorderVariants.small}
          />
        </Flex>
      )}

      {/* buttons */}
      <Flex gap="small" className="ml-auto">
        <Button className="font-archivo capitalize" onClick={handleCancel}>
          cancel
        </Button>
        <Button type="primary" className="font-archivo capitalize" onClick={handleAddCollaboratorToDb}>
          confirm
        </Button>
      </Flex>
    </Flex>
  );
};
export default AddCollaboratorsModalComponent;
