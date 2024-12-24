import CreateMessageIcon from "@/features/message/crate-message-icon";
import createMessageTitle from "@/features/message/create-message-title";
import { GetUserMessage } from "@/features/message/message";
import { Flex, Typography } from "antd";
import classNames from "classnames";

const { Text } = Typography;

interface DesktopMessageTextComponentProps {
  message: GetUserMessage;
}
const DesktopMessageTextComponent: React.FC<DesktopMessageTextComponentProps> = ({ message }) => {
  return (
    <Flex gap={2} align="center">
      <Text
        className={classNames("font-archivo text-sm min-w-fit flex items-center gap-2 ", {
          "font-bold": !message.isRead,
          "font-light": message.isRead,
        })}
      >
        <CreateMessageIcon type={message.type} />
        {createMessageTitle(message.type)}
      </Text>
      {"-"}
      <Text
        className={classNames("font-archivo line-clamp-1 text-sm", {
          "font-medium": !message.isRead,
          "font-light": message.isRead,
        })}
      >
        {message.message}
      </Text>
    </Flex>
  );
};

export default DesktopMessageTextComponent;