import { SecurredFolderData } from "@/features/collaborator/collaborator";
import { db } from "@/firebase/firebase-services";
import { message } from "antd";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useCallback } from "react";
import { RootFolderGetData, SubFolderGetData } from "../../folder/folder";

interface SecuredFolderToggleHandlerProps {
  isSecuredFolderActive: boolean;
  folderId: string;
  folderData: SubFolderGetData | RootFolderGetData | null;
}

interface HandleValidateBeforeToggle {
  folderData: SubFolderGetData | RootFolderGetData | null;
}

type HandleCreatePayload = Pick<SecurredFolderData, "isSecuredFolderActive" | "updatedAt">;

/**
 * Creates the payload to be used in the secured folder toggle request.
 * Toggles the `isSecuredFolderActive` field and sets the `updatedAt` field to the current timestamp.
 * @param {HandleCreatePayload} params The payload to be created.
 * @returns {HandleCreatePayload} The payload to be sent in the request.
 */
const handleCreatePayload = (params: HandleCreatePayload) => {
  const { isSecuredFolderActive, updatedAt } = params;

  const payload = {
    isSecuredFolderActive: !isSecuredFolderActive,
    updatedAt,
  };
  return payload;
};

/**
 * Validates the conditions before toggling the secured folder status.
 *
 * This function checks whether the necessary conditions are met before
 * allowing a folder's secured status to be toggled. The conditions include:
 * - The user must be logged in.
 * - The folder data must be available.
 * - The folder cannot be a root folder, as root folders cannot be secured.
 *
 * If any condition fails, a warning message is displayed and the function
 * returns false. Otherwise, it returns true, indicating that all validations
 * passed.
 *
 * @param {HandleValidateBeforeToggle} params - The parameters required for validation.
 * @returns {boolean} - Returns true if all validations pass, otherwise false.
 */

const handleValidateBeforeToggle = (params: HandleValidateBeforeToggle) => {
  const { folderData } = params;

  const isRootFolder = folderData!.parent_folder_id === null;

  const validations = [
    { condition: !folderData, message: "Something went wrong, please try again." },
    { condition: isRootFolder, message: "You can't secure root folder" },
  ];

  /**
   * failed validation
   */
  const failedValidation = validations.find((validation) => validation.condition);

  if (failedValidation) {
    message.open({
      type: "error",
      content: failedValidation.message,
      key: "secured-folder-toggle-warning",
    });
    return false;
  }

  return true;
};

const useSecuredFoldertoggleHandler = ({ isSecuredFolderActive, folderId, folderData }: SecuredFolderToggleHandlerProps) => {
  const handleToggleSecuredFolder = useCallback(async () => {
    try {
      const validateBeforeToggle = handleValidateBeforeToggle({ folderData });
      if (!validateBeforeToggle) return;

      const securedFolderRef = doc(db, "secured-folder", folderId);
      const payload = handleCreatePayload({ isSecuredFolderActive, updatedAt: serverTimestamp() });

      await updateDoc(securedFolderRef, payload);
      message.open({
        type: "success",
        content: `${isSecuredFolderActive ? "Unsecured" : "Secured"} folder successfully`,
        key: "secured-folder-toggle-success",
      });
    } catch (error) {
      console.error("Error toggling secured folder:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [folderId, isSecuredFolderActive, folderData]);

  return { handleToggleSecuredFolder };
};

export default useSecuredFoldertoggleHandler;
