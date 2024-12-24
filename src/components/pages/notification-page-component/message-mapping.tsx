import useSelectMessage from "@/features/message/hooks/use-select-message";
import { GetUserMessage } from "@/features/message/message";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Flex, message } from "antd";
import MessageCheckbox from "./message-checkbox-button";
import MessageTextComponent from "./mobile-message-text-component";
import { useNavigate } from "react-router-dom";
import useBreadcrumbSetState from "@/features/breadcrumb/hooks/use-breadcrumb-setstate";
import useBreadcrumbState from "@/features/breadcrumb/hooks/use-breadcrumb-state";
import useMarkAsReadSingleMessages from "@/features/message/hooks/use-mark-as-read-single-messages";

interface MessageMappingProps {
  messages: GetUserMessage[];
}
const MessageMapping: React.FC<MessageMappingProps> = ({ messages }) => {
  const navigate = useNavigate();
  const { items } = useBreadcrumbState();

  const { handleToggleSelectMessage } = useSelectMessage();
  const { addItemBreadcrumb, deleteByKey } = useBreadcrumbSetState();

  const { handleMarkAsReadSingleMessageClientSide, handleMarkAsReadSingleMessageBackendSide } = useMarkAsReadSingleMessages();

  const handleNavigateToDetail = (event: React.MouseEvent<HTMLDivElement>) => {
    const messageId = event.currentTarget.dataset.messageid;
    const messageValue = messageId ? messages.find((message) => message.messageId === messageId) : null;

    if (!messageId) {
      message.open({ type: "error", content: "notification id not found", className: "font-archivo text-sm capitalize" });
      return;
    }

    if (items[1]) deleteByKey(items[1].key);

    handleMarkAsReadSingleMessageClientSide(messageId);
    handleMarkAsReadSingleMessageBackendSide(messageId);

    navigate(`/storage/notification/${messageId}`);
    addItemBreadcrumb({
      key: messageId,
      label: messageValue?.message || "",
      path: `/storage/notification/${messageId}`,
    });
  };

  return messages.map((message) => (
    <Flex
      onClick={handleNavigateToDetail}
      data-messageid={message.messageId}
      align="center"
      key={message.messageId}
      className="w-full p-2 px-3 rounded-md border-2 border-black cursor-pointer"
      style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.primary200 }}
    >
      <MessageTextComponent message={message} />
      <MessageCheckbox handleChange={handleToggleSelectMessage} messageId={message.messageId} />
    </Flex>
  ));
};

export default MessageMapping;
