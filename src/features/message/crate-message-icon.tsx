import { IoMailUnreadOutline } from "react-icons/io5";
import { UserMessageType } from "./message";

const CreateMessageIcon: React.FC<{ type: UserMessageType }> = ({ type }) => {
  switch (type) {
    case "add-collaborator":
      return <IoMailUnreadOutline />;

    default:
      return <IoMailUnreadOutline />;
      break;
  }
};

export default CreateMessageIcon;
