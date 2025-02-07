import useNotificationDetailsAutoAddBreadcrumb from "@/features/breadcrumb/hooks/use-notification-details-auto-get-breadcrumb";
import useResetAllBreadcrumbItems from "@/features/breadcrumb/hooks/use-reset-all-breadcrumb-items";
import useGetCurrentMessage from "@/features/message/hooks/use-get-current-message";
import { currentMessageSelector } from "@/features/message/slice/current-message-slice";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import useMobileHeaderTitle from "@/hooks/use-mobile-header-title";
import MainLayout from "@components/layout/main-layout";
import { Flex, Spin } from "antd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FodlerCardCollaborationInfo from "./folder-card-collaboration-info";
import SenderProfileCardDekstop from "./sender-profile-card-dekstop";
import SenderProfileCardMobile from "./sender-profile-card-mobile";

const NotificationDetailsPageComponent: React.FC = () => {
  useMobileHeaderTitle("notification");

  const { isMobileDevice } = useGetClientScreenWidth();

  const { notificationId } = useParams<{ notificationId: string }>();

  /**
   * auto add first breadcrumb
   */
  useResetAllBreadcrumbItems({
    shouldReset: true,
    addFirstBreadcrumbItem: {
      label: "notification",
      path: "/storage/notification",
      key: "notification",
      icon: "notification",
    },
  });

  /**
   * get current message and set to state
   */
  useGetCurrentMessage({
    id: notificationId,
    shouldFetch: Boolean(notificationId),
  });

  /**
   * auto add second item breadcrumb
   */
  useNotificationDetailsAutoAddBreadcrumb({
    id: notificationId,
  });

  /**
   * current message state
   */
  const { currentMessage, fetchStatus: currMessageFetchStatus } = useSelector(currentMessageSelector);

  return (
    <MainLayout showAddButton={false} showPasteButton={false}>
      <Flex className="max-w-screen-lg mx-auto p-3" vertical gap="middle">
        {currMessageFetchStatus === "loading" ? (
          <Spin />
        ) : (
          <>
            {!isMobileDevice && <SenderProfileCardDekstop />}
            {isMobileDevice && <SenderProfileCardMobile />}

            {currentMessage?.message}
            <FodlerCardCollaborationInfo />
          </>
        )}
      </Flex>
    </MainLayout>
  );
};

export default NotificationDetailsPageComponent;
