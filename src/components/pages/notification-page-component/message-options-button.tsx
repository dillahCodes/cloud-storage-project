import useDeleteSelectedMessage from "@/features/message/hooks/use-delete-selected-message";
import useMarkAsReadSelectedMessage from "@/features/message/hooks/use-mark-as-read-selected-message";
import useMarkAsUnreadMessage from "@/features/message/hooks/use-mark-as-unread-message";
import useSelectMessage from "@/features/message/hooks/use-select-message";
import { messageSelector } from "@/features/message/slice/message-slice";
import { selectedMessageSelector } from "@/features/message/slice/selected-message-slice";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import Button from "@components/ui/button";
import { Checkbox, Flex } from "antd";
import { GoRead } from "react-icons/go";
import { IoMailUnreadOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";

const MessageOptionsButton: React.FC = () => {
  /**
   * message state
   */
  const { messages } = useSelector(messageSelector);

  /**
   * selected message state
   */
  const { selectedMessagesId } = useSelector(selectedMessageSelector);

  /**
   * checked logic
   */
  const isNotCheckedAll = selectedMessagesId.length > 0 && selectedMessagesId.length < messages.length;
  const isChekedAll = selectedMessagesId.length === messages.length;

  /**
   * hooks toggle change
   */
  const { handleToggleSelectAllAndUnselectAll } = useSelectMessage();

  /**
   * hooks action handler
   */
  const { handleDelete } = useDeleteSelectedMessage();
  const { handleMarkAsRad, canMarkAsRead } = useMarkAsReadSelectedMessage();
  const { handleMarkAsUnread, canMarkAsUnread } = useMarkAsUnreadMessage();

  return (
    <Flex className="w-full font-archivo" align="center">
      <Flex gap="small">
        <Button
          type="primary"
          className="text-black font-archivo rounded-md text-base"
          neoBrutalType="medium"
          icon={<MdDeleteOutline />}
          onClick={handleDelete}
        />
        <Button
          type="primary"
          className="text-black font-archivo rounded-md text-base"
          neoBrutalType="medium"
          icon={<GoRead />}
          disabled={canMarkAsRead}
          onClick={handleMarkAsRad}
        />
        <Button
          type="primary"
          className="text-black font-archivo rounded-md text-base"
          neoBrutalType="medium"
          onClick={handleMarkAsUnread}
          disabled={canMarkAsUnread}
          icon={<IoMailUnreadOutline />}
        />
      </Flex>

      <Flex className="p-1 px-1.5 ml-auto rounded-md border-2 border-black" style={{ ...neoBrutalBorderVariants.medium }}>
        <Checkbox
          className="message-checkbox"
          onChange={handleToggleSelectAllAndUnselectAll}
          indeterminate={isNotCheckedAll}
          checked={isChekedAll}
        />
      </Flex>
    </Flex>
  );
};

export default MessageOptionsButton;
