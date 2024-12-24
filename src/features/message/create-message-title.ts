import { UserMessageType } from "./message";

const createMessageTitle = (message: UserMessageType): string => {
  switch (message) {
    case "add-collaborator":
      return "Collaboration Invitation";

    default:
      return "undefined message";
  }
};

export default createMessageTitle;
