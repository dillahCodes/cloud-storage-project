import { useDispatch, useSelector } from "react-redux";
import { messageSelector, setMyMessageCount, setMyMessages } from "../slice/message-slice";
import { db } from "@/firebase/firebase-serices";
import { doc, updateDoc } from "firebase/firestore";

const useMarkAsReadSingleMessages = () => {
  const dispatch = useDispatch();

  /**
   * message state
   */
  const { messages, messageCount } = useSelector(messageSelector);

  const handleMarkAsReadSingleMessageClientSide = (messageId: string) => {
    const isMessageHasRead = messages.some((message) => message.messageId === messageId && message.isRead);
    if (isMessageHasRead) return;

    const updatedMessages = messages.map((message) => (message.messageId === messageId ? { ...message, isRead: true } : message));
    dispatch(setMyMessages(updatedMessages));
    dispatch(setMyMessageCount(messageCount - 1));
  };

  const handleMarkAsReadSingleMessageBackendSide = async (messageId: string) => {
    try {
      const messageDocRef = doc(db, "message", messageId);

      const isHasReadMessage = messages.some((message) => message.messageId === messageId && message.isRead);
      if (isHasReadMessage) return;

      await updateDoc(messageDocRef, { isRead: true });
    } catch (error) {
      console.error("Error marking message as read:", error instanceof Error ? error.message : "an unknown error occurred");
    }
  };

  return {
    handleMarkAsReadSingleMessageClientSide,
    handleMarkAsReadSingleMessageBackendSide,
  };
};

export default useMarkAsReadSingleMessages;
