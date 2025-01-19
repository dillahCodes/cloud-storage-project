import { Permissions } from "@/features/folder/hooks/use-folder-get-permission";
import useDetectLocation from "@/hooks/use-detect-location";
import { message } from "antd";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface UseMobileMovePermissionFolder {
  permissions: Permissions;
  isGetPermissionSuccess: boolean;
  moveFromLocationPath: string | null;
}

const useMobileMovePermissionPage = ({ isGetPermissionSuccess, permissions, moveFromLocationPath }: UseMobileMovePermissionFolder) => {
  const { isRootMoveFolderOrFileLocation } = useDetectLocation();

  const navigate = useNavigate();

  const ignoreCondition = useMemo(() => {
    return !isGetPermissionSuccess || isRootMoveFolderOrFileLocation || permissions.canCRUD || !moveFromLocationPath;
  }, [isGetPermissionSuccess, isRootMoveFolderOrFileLocation, permissions.canCRUD, moveFromLocationPath]);

  const handleValidateFolder = useCallback(() => {
    /**
     * Conditions
     */
    const conditions = [
      {
        condition: !permissions.canCRUD,
        message: "Permission denied: folder is private.",
      },
    ];

    /**
     * get first invalid condition
     */
    const validConditions = conditions.find((condition) => condition.condition);

    if (validConditions) {
      message.open({ type: "error", content: validConditions?.message, className: "font-archivo text-sm" });
      navigate(moveFromLocationPath!);
    }
  }, [permissions.canCRUD, navigate, moveFromLocationPath]);

  useEffect(() => {
    if (ignoreCondition) return;
    handleValidateFolder();
  }, [ignoreCondition, handleValidateFolder]);
};
export default useMobileMovePermissionPage;
