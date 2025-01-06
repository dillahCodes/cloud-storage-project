import notifIlustration from "@/assets/no-notification.svg";
import useResetAllBreadcrumbItems from "@/features/breadcrumb/hooks/use-reset-all-breadcrumb-items";
import useGetMyMessage from "@/features/message/hooks/use-get-my-message";
import { messageSelector } from "@/features/message/slice/message-slice";
import { selectedMessageSelector } from "@/features/message/slice/selected-message-slice";
import useMobileHeaderTitle from "@/hooks/use-mobile-header-title";
import MainLayout from "@components/layout/main-layout";
import { Flex, Layout, Spin, Typography } from "antd";
import { useSelector } from "react-redux";
import MessageMapping from "./message-mapping";
import MessageOptionsButton from "./message-options-button";

const { Text } = Typography;
const NotificationPageComponent: React.FC = () => {
  useMobileHeaderTitle("notification");

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
   * message state
   */
  const { messageCount, messages, fetchStatus } = useSelector(messageSelector);
  const unreadMessages = messages.filter((message) => !message.isRead);

  /**
   * selected message state
   */
  const { selectedMessagesId } = useSelector(selectedMessageSelector);
  const isNoSelectedMessage = selectedMessagesId.length === 0;

  /**
   * fetch message data
   */
  useGetMyMessage({ messageCount, unreadMessages: unreadMessages });

  if (fetchStatus === "loading")
    return (
      <Layout className="h-screen w-full flex justify-center items-center">
        <Spin size="large" />
      </Layout>
    );

  return (
    <MainLayout showAddButton={false} showPasteButton={false}>
      <Flex className="max-w-screen-lg mx-auto p-3" vertical gap="middle">
        {/*
         * notification options
         */}
        {!isNoSelectedMessage && <MessageOptionsButton />}
        {messages.length === 0 ? (
          /**
           * no notification component
           */
          <Flex className="p-3 h-full" justify="center" align="center" vertical gap="small">
            <div className="2xl:max-w-xs max-w-[200px]">
              <img src={notifIlustration} alt="notif ilustration" className="w-full object-cover" />
            </div>
            <Text className="text-lg font-archivo">No notifications yet, stay awesome! </Text>
          </Flex>
        ) : (
          /**
           * mapping notification component
           */
          <Flex vertical gap="small">
            <MessageMapping messages={messages} />
          </Flex>
        )}
      </Flex>
    </MainLayout>
  );
};

export default NotificationPageComponent;
