import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { notification, Typography } from "antd";
import { NotificationPlacement } from "antd/es/notification/interface";
import { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegWindowClose } from "react-icons/fa";
import { FolderResponseStatus } from "../folder";

const { Text } = Typography;
const useShowFloatingNotification = (
  addFolderStatus: FolderResponseStatus,
  placement: NotificationPlacement,
  withDescription: boolean
) => {
  const [floatingNotificationApi, floatingNotificationContext] = notification.useNotification();

  useEffect(() => {
    if (addFolderStatus.status !== "idle") {
      if (addFolderStatus.status === "loading") {
        floatingNotificationApi.info({
          message: <Text className="font-archivo font-bold text-base">Adding Folder</Text>,
          description: withDescription ? <Text className="font-archivo  text-sm">{addFolderStatus.message}</Text> : null,
          placement: placement,
          duration: addFolderStatus.status !== "loading" ? 0 : 0.5,
          closeIcon: null,
          icon: (
            <div style={{ color: themeColors.primary200 }} className="animate-spin">
              <AiOutlineLoading3Quarters />
            </div>
          ),
          style: { ...neoBrutalBorderVariants.medium, background: themeColors.primary300 },
          className: "rounded-sm border-2 border-black font-archivo p-2",
        });
      }
      if (addFolderStatus.status === "failed") {
        floatingNotificationApi.error({
          message: <Text className="font-archivo font-bold text-base">Failed to Add Folder</Text>,
          description: withDescription ? <Text className="font-archivo  text-sm">{addFolderStatus.message}</Text> : null,
          placement: placement,
          duration: 2,
          icon: <FaRegWindowClose style={{ color: themeColors.primary200 }} />,
          className: "rounded-sm border-2 border-black font-archivo p-2",
        });
      }
    }
  }, [addFolderStatus, floatingNotificationApi, placement, withDescription]);

  return { floatingNotificationApi, floatingNotificationContext };
};

export default useShowFloatingNotification;
