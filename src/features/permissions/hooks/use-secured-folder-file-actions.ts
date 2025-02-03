import { useSelector } from "react-redux";
import { parentFolderPermissionSelector } from "../slice/parent-folder-permissions";
import { useCallback, useMemo } from "react";
import { message } from "antd";

const useSecuredFolderFileActions = () => {
  const { actionPermissions, permissionsDetails } = useSelector(parentFolderPermissionSelector);

  const isSecuredFolder = useMemo(() => {
    return permissionsDetails.isParentSecuredFolderActive && !actionPermissions.canCRUD;
  }, [permissionsDetails.isParentSecuredFolderActive, actionPermissions.canCRUD]);

  const handleCheckIsUserCanDoThisAction = useCallback(
    (action: string): boolean => {
      // ignore if not subfolder
      if (!permissionsDetails.isSubFolderLocation) return true;

      const errors = [
        {
          condition: isSecuredFolder,
          message: "File in this folder is secured",
        },
        {
          condition: !actionPermissions.canCRUD,
          message: `Only owner/editor can ${action} this file`,
        },
      ];

      // find first blocking error
      const blockingError = errors.find((error) => error.condition);
      if (blockingError) {
        message.open({
          type: "error",
          content: blockingError.message,
          className: "font-archivo text-sm capitalize",
          key: `file-${action}-error`,
        });
        return false;
      }

      // default if all conditions are false
      return true;
    },
    [isSecuredFolder, actionPermissions.canCRUD, permissionsDetails.isSubFolderLocation]
  );

  return { handleCheckIsUserCanDoThisAction };
};
export default useSecuredFolderFileActions;
