import { Flex, Spin, Typography } from "antd";
import notifIlustration from "@/assets/no-notification.svg";
import MessageMapping from "@components/pages/notification-page-component/message-mapping";
import { messageSelector } from "@/features/message/slice/message-slice";
import { useSelector } from "react-redux";
import useGetMyMessage from "@/features/message/hooks/use-get-my-message";
import { selectedMessageSelector } from "@/features/message/slice/selected-message-slice";
import MessageOptionsButton from "@components/pages/notification-page-component/message-options-button";

const { Text } = Typography;
const DesktopDrawerNotification: React.FC = () => {
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

  return (
    <Flex className="h-fit p-3" justify="center" align="center" vertical gap="middle">
      {fetchStatus === "loading" && <Spin size="large" />}
      {!isNoSelectedMessage && <MessageOptionsButton />}

      <Flex className="w-full" vertical gap="small">
        {messages.length === 0 && fetchStatus === "succeeded" ? <NoNotification /> : <MessageMapping messages={messages} />}
      </Flex>
    </Flex>
  );
};

export default DesktopDrawerNotification;

const NoNotification: React.FC = () => {
  return (
    <Flex className="p-3 h-full" justify="center" align="center" vertical gap="small">
      <div className="2xl:max-w-xs max-w-[200px]">
        <img src={notifIlustration} alt="notif ilustration" className="w-full object-cover" />
      </div>
      <Text className="text-lg font-archivo">No notifications yet, stay awesome! </Text>
    </Flex>
  );
};
