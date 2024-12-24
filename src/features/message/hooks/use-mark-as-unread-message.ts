import { useDispatch, useSelector } from "react-redux";
import { messageSelector, setMyMessageCount, setMyMessages } from "../slice/message-slice";
import { resetSelectedMessage, selectedMessageSelector } from "../slice/selected-message-slice";
import { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { db } from "@/firebase/firebase-serices";
import { doc, updateDoc } from "firebase/firestore";

const useMarkAsUnreadMessage = () => {
  const dispatch = useDispatch();

  const [canMarkAsUnread, setCanMarkAsUnread] = useState<boolean>(false);

  /**
   * message state
   */
  const { messages, messageCount } = useSelector(messageSelector);

  /**
   * selected message state
   */
  const { selectedMessagesId } = useSelector(selectedMessageSelector);

  /**
   * search message with is read is true
   */
  const selectedMessages = useMemo(() => {
    return messages.filter((message) => selectedMessagesId.includes(message.messageId) && message.isRead);
  }, [messages, selectedMessagesId]);

  /**
   * set disabled in state if selected message not have unread message.
   */
  useEffect(() => {
    const handleSetCanMarkAsUnread = () => {
      const isSelectedMessageHaveReadMessage = messages.some((message) => selectedMessagesId.includes(message.messageId) && message.isRead);
      setCanMarkAsUnread(!isSelectedMessageHaveReadMessage);
    };

    handleSetCanMarkAsUnread();
  }, [messages, selectedMessagesId]);

  /**
   * search message with is read is false
   */
  const unselectedMessages = useMemo(() => {
    return messages.filter((message) => !selectedMessagesId.includes(message.messageId) || !message.isRead);
  }, [messages, selectedMessagesId]);

  const handleFloatingNotification = useCallback(
    (type: "loading" | "success" | "failed") => {
      switch (type) {
        case "loading":
          message.open({
            key: "loading-mark-as-unread",
            type: "loading",
            content: `Marking as Unread ${selectedMessagesId.length} ${selectedMessagesId.length > 1 ? "messages" : "message"}...`,
            className: "font-archivo text-sm capitalize",
            duration: 0,
          });
          break;

        case "success":
          message.open({
            key: "success-mark-as-unread",
            type: "success",
            content: `Marked as Unread ${selectedMessagesId.length} ${selectedMessagesId.length > 1 ? "messages" : "message"} successfully`,
            className: "font-archivo text-sm capitalize",
          });
          break;

        case "failed":
          message.open({
            key: "failed-mark-as-unread",
            type: "error",
            content: `failed to mark as unread ${selectedMessagesId.length} ${
              selectedMessagesId.length > 1 ? "messages" : "message"
            }, please try again`,
            className: "font-archivo text-sm capitalize",
          });
          break;

        default:
          break;
      }
    },
    [selectedMessagesId.length]
  );

  /**
   * Helper - handle mark as unread message in client side
   */
  const handleMarkAsUnreadMessageInClientSide = useCallback(() => {
    const markedAsUnreadMessages = selectedMessages.map((message) => ({ ...message, isRead: false }));
    const newMessagesState = [...unselectedMessages, ...markedAsUnreadMessages];

    dispatch(setMyMessages(newMessagesState));
    dispatch(setMyMessageCount(messageCount + selectedMessages.length));
    dispatch(resetSelectedMessage());
  }, [selectedMessages, unselectedMessages, messageCount, dispatch]);

  /**
   * Helper - handle mark as Unread message in backend side
   */
  const handleMarkAsUnreadMessageInBackendSide = useCallback(async () => {
    const promises = selectedMessagesId.map(async (messageId) => {
      const isHasUnreadMessage = messages.some((message) => message.messageId === messageId && !message.isRead);
      if (isHasUnreadMessage) return;

      const messageDocRef = doc(db, "message", messageId);
      await updateDoc(messageDocRef, { isRead: false });
    });

    Promise.all(promises);
  }, [messages, selectedMessagesId]);

  const handleMarkAsUnread = useCallback(async () => {
    try {
      handleFloatingNotification("loading");
      await handleMarkAsUnreadMessageInBackendSide();

      /** NOTE:
       * after mark message as unread in backend is done open floating notification
       * and mark as unread message in client side
       * and close loading notification
       */
      handleMarkAsUnreadMessageInClientSide();
      message.destroy("loading-mark-as-unread");
      handleFloatingNotification("success");
    } catch (error) {
      console.error("Error during mark message as unread:", error instanceof Error ? error.message : "an unknown error occurred");
    }
  }, [handleMarkAsUnreadMessageInClientSide, handleMarkAsUnreadMessageInBackendSide, handleFloatingNotification]);

  return { handleMarkAsUnread, canMarkAsUnread };
};

export default useMarkAsUnreadMessage;
