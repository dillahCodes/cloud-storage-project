import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useDispatch, useSelector } from "react-redux";
import {
  addSelectedMessage,
  addSelectedMessages,
  deleteSelectedMessage,
  resetSelectedMessage,
  selectedMessageSelector,
} from "../slice/selected-message-slice";
import { messageSelector } from "../slice/message-slice";

const useSelectMessage = () => {
  const dispatch = useDispatch();

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
  const isNotCheckedAll: boolean = selectedMessagesId.length > 0 && selectedMessagesId.length < messages.length;
  const isChekedAll: boolean = selectedMessagesId.length === messages.length;

  const handleToggleSelectMessage = (e: CheckboxChangeEvent, messageId: string) => {
    const isChecked = e.target.checked;
    isChecked ? dispatch(addSelectedMessage(messageId)) : dispatch(deleteSelectedMessage(messageId));
  };

  const handleToggleSelectAllAndUnselectAll = () => {
    const extractMessageId: string[] = messages.map((message) => message.messageId);

    isNotCheckedAll && dispatch(addSelectedMessages(extractMessageId));
    isChekedAll && dispatch(resetSelectedMessage());
  };

  return { handleToggleSelectMessage, handleToggleSelectAllAndUnselectAll };
};

export default useSelectMessage;
