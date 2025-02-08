import { GeneralAccessRole } from "@/features/collaborator/collaborator";
import handleSendCollaborationInvitation from "@/features/message/send-collaboration-invitation";
import { message } from "antd";
import { serverTimestamp } from "firebase/firestore";
import { useCallback } from "react";
import handleAddCollabortaror from "../handle-add-collaborator";

interface UseAddCollaboratorsSelectedToDbParams {
  role: GeneralAccessRole;
  collaborators: UserDataDb[];
  afterAddCollaborator?: () => void;
  folderId: string;
  withMessage?: {
    notifyPeople: boolean;
    message: string;
  };
}

const useAddCollaboratorsSelectedToDb = ({
  afterAddCollaborator,
  folderId,
  withMessage,
  collaborators,
  role,
}: UseAddCollaboratorsSelectedToDbParams) => {
  /**
   * Helper to validate adding collaborators to the database.
   */
  const handleValidateAddCollaboratorToDb = useCallback(() => {
    const validations = [
      { condition: !folderId, message: "Folder ID is required.", key: "collaborators-add-required-folderId" },
      {
        condition: withMessage?.notifyPeople && (!withMessage.message || withMessage.message.trim() === ""),
        message: "Message is required.",
        key: "collaborators-add-required-message",
      },
      {
        condition: withMessage?.notifyPeople && (withMessage.message.length < 10 || withMessage.message.length > 300),
        message: "Message must be between 10 and 300 characters.",
        key: "collaborators-add-required-message",
      },
      {
        condition: collaborators.length === 0,
        message: "Collaborators are required.",
        key: "collaborators-add-required-collaborators",
      },
    ];

    return validations.find((validation) => validation.condition) || null;
  }, [folderId, withMessage, collaborators]);

  /**
   * handle add collaborators with promise all
   * set collaborators to db and send invitation message if needed
   */
  const handleAddCollaboratorsWithPromiseAll = useCallback(async () => {
    const promises = collaborators.map(async (collaborator) => {
      await handleAddCollabortaror({
        createAt: serverTimestamp(),
        folderId,
        role,
        updateAt: null,
        userId: collaborator.uid,
      });

      if (withMessage?.notifyPeople) {
        await handleSendCollaborationInvitation({
          folderId,
          message: withMessage?.message || ``,
          userId: collaborator.uid,
        });
      }
    });
    await Promise.all(promises);
  }, [collaborators, folderId, withMessage, role]);

  /*
   * handle confirm add collaborators
   */
  const handleAddCollaboratorToDb = async () => {
    const validationsError = handleValidateAddCollaboratorToDb();
    if (validationsError) {
      message.open({
        type: "warning",
        content: validationsError.message,
        className: "font-archivo text-sm",
        key: validationsError.key,
      });
      return;
    }

    try {
      await handleAddCollaboratorsWithPromiseAll();
      afterAddCollaborator?.();
    } catch (error) {
      console.error(
        "error while adding collaborators to db: ",
        error instanceof Error ? error.message : "an unknown error occurred"
      );
    }
  };
  return { handleAddCollaboratorToDb };
};
export default useAddCollaboratorsSelectedToDb;
