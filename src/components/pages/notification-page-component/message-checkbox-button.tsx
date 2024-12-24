import { selectedMessageSelector } from "@/features/message/slice/selected-message-slice";
import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useSelector } from "react-redux";
import "./style/checkbox-style.css";

interface MessageCheckboxProps {
  messageId: string;
  handleChange: (e: CheckboxChangeEvent, messageId: string) => void;
}

const MessageCheckbox: React.FC<MessageCheckboxProps> = ({ handleChange, messageId }) => {
  /**
   * selected message state
   */
  const { selectedMessagesId } = useSelector(selectedMessageSelector);
  const isChekeded = selectedMessagesId.some((id) => id === messageId);

  const onCheckboxChange = (e: CheckboxChangeEvent) => handleChange(e, messageId);

  return <Checkbox className="message-checkbox" onChange={onCheckboxChange} onClick={(e) => e.stopPropagation()} checked={isChekeded} />;
};

export default MessageCheckbox;
