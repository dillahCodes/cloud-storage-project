import CreateMessageIcon from "@/features/message/crate-message-icon";
import createMessageTitle from "@/features/message/create-message-title";
import { GetUserMessage } from "@/features/message/message";
import { Flex, Typography } from "antd";
import classNames from "classnames";

const { Text } = Typography;

interface MessageTextComponentProps {
  message: GetUserMessage;
}
const MessageTextComponent: React.FC<MessageTextComponentProps> = ({ message }) => {
  return (
    <Flex gap="small">
      <Text
        className={classNames("font-archivo text-2xl flex items-center gap-2 ", {
          "font-bold": !message.isRead,
          "font-light": message.isRead,
        })}
      >
        <CreateMessageIcon type={message.type} />
      </Text>
      <Flex vertical>
        <Text
          className={classNames("font-archivo text-sm flex items-center gap-2 ", {
            "font-bold": !message.isRead,
            "font-light": message.isRead,
          })}
        >
          {createMessageTitle(message.type)}
        </Text>
        <Text
          className={classNames("font-archivo max-w-[150px] line-clamp-1 text-sm", {
            "font-medium": !message.isRead,
            "font-light": message.isRead,
          })}
        >
          {message.message}
        </Text>
      </Flex>
    </Flex>
  );
};

export default MessageTextComponent;
