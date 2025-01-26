import { useDispatch, useSelector } from "react-redux";
import { UserDataDb } from "@/features/auth/auth";
import {
  addCollaborators,
  modalAddSelectedCollaboratorsSelector,
  removeSelectedUser,
} from "../../collaborator/slice/modal-add-selected-collaborators";
import useModalManageAccessContentSetState from "../../collaborator/hooks/use-modal-manage-access-content-setstate";
import { useCallback } from "react";
import { message } from "antd";
import { modalManageAccessContentSelector } from "@/features/collaborator/slice/modal-manage-access-content-slice";

interface UseAddCollaboratorsSelectedToStateParams {
  inputRef?: React.RefObject<HTMLInputElement>;
}

const useAddCollaboratorsSelectedToState = ({ inputRef }: UseAddCollaboratorsSelectedToStateParams = {}) => {
  const dispatch = useDispatch();
  const { collaboratorsData: collaboratosListWillAdd } = useSelector(modalAddSelectedCollaboratorsSelector);
  const { collaboratorsUserData } = useSelector(modalManageAccessContentSelector);

  const { setModalContentWillRender } = useModalManageAccessContentSetState({});

  const isFirstAdd = !collaboratosListWillAdd?.length;
  const isCollaboratorExists = useCallback(
    (userId: string) => {
      const existingCollaborator = collaboratorsUserData?.find((collaborator) => collaborator.userId === userId);
      if (existingCollaborator) {
        return {
          condition: true,
          message: `${existingCollaborator.name} is already a collaborator in this folder.`,
        };
      }

      const pendingCollaborator = collaboratosListWillAdd?.find((collaborator) => collaborator.uid === userId);
      if (pendingCollaborator) {
        return {
          condition: true,
          message: `${pendingCollaborator.displayName} is already in the add list.`,
        };
      }

      return { condition: false, message: "" };
    },
    [collaboratorsUserData, collaboratosListWillAdd]
  );

  const handleAddCollaborator = (userData: UserDataDb) => {
    const isExists = isCollaboratorExists(userData.uid);
    if (isExists.condition) {
      message.open({
        type: "warning",
        content: isExists.message,
        className: "font-archivo",
      });
      return;
    }

    if (isFirstAdd) setModalContentWillRender("add-persons");
    dispatch(addCollaborators(userData));

    // still keep focus on input field
    if (inputRef?.current) inputRef?.current?.focus();
  };

  const handleRemoveUserById = (id: string) => dispatch(removeSelectedUser(id));

  return { handleAddCollaborator, handleRemoveUserById };
};

export default useAddCollaboratorsSelectedToState;
