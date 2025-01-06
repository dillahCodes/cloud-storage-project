import { db } from "@/firebase/firebase-services";
import { message } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageSelector, setMyMessageCount, setMyMessages } from "../slice/message-slice";
import { resetSelectedMessage, selectedMessageSelector } from "../slice/selected-message-slice";

const useMarkAsReadSelectedMessage = () => {
  const dispatch = useDispatch();

  const [canMarkAsRead, setCanMarkAsRead] = useState<boolean>(true);

  /**
   * message state
   */
  const { messages, messageCount } = useSelector(messageSelector);

  /**
   * selected message state
   */
  const { selectedMessagesId } = useSelector(selectedMessageSelector);

  const selectedMessages = useMemo(
    () => messages.filter((message) => selectedMessagesId.includes(message.messageId) && !message.isRead),
    [messages, selectedMessagesId]
  );
  const unselectedMessages = useMemo(
    () => messages.filter((message) => !selectedMessagesId.includes(message.messageId) || message.isRead),
    [messages, selectedMessagesId]
  );

  /**
   * set disabled state if selected message not have unread message
   */
  useEffect(() => {
    const handleSetCanMarkAsRead = () => {
      const isSelectedMessageHaveUnreadMessage = messages.some((message) => selectedMessagesId.includes(message.messageId) && !message.isRead);
      setCanMarkAsRead(!isSelectedMessageHaveUnreadMessage);
    };

    handleSetCanMarkAsRead();
  }, [messages, selectedMessagesId]);

  /**
   * Helper - handle floating notification
   */
  const handleFloatingNotification = useCallback(
    (type: "loading" | "success" | "failed") => {
      switch (type) {
        case "loading":
          message.open({
            key: "loading-mark-as-read",
            type: "loading",
            content: `Marking as Read ${selectedMessagesId.length} ${selectedMessagesId.length > 1 ? "messages" : "message"}...`,
            className: "font-archivo text-sm capitalize",
            duration: 0,
          });
          break;

        case "success":
          message.open({
            key: "success-mark-as-read",
            type: "success",
            content: `Marked as Read ${selectedMessagesId.length} ${selectedMessagesId.length > 1 ? "messages" : "message"} successfully`,
            className: "font-archivo text-sm capitalize",
          });
          break;

        case "failed":
          message.open({
            key: "failed-mark-as-read",
            type: "error",
            content: `failed to mark as read ${selectedMessagesId.length} ${
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
   * Helper - handle mark as read message in client side
   */
  const handleMarkAsReadMessageInClientSide = useCallback(() => {
    const markedAsReadMessages = selectedMessages.map((message) => ({ ...message, isRead: true }));
    const newMessagesState = [...unselectedMessages, ...markedAsReadMessages];

    dispatch(setMyMessages(newMessagesState));
    dispatch(setMyMessageCount(messageCount - selectedMessages.length));
    dispatch(resetSelectedMessage());
  }, [dispatch, messageCount, selectedMessages, unselectedMessages]);

  /**
   * Helper - handle mark as read message in backend side
   */
  const handleMarkedAsReadMessageInBackendSide = useCallback(async () => {
    const promises = selectedMessagesId.map(async (messageId) => {
      const isHasReadMessage = messages.some((message) => message.messageId === messageId && message.isRead);
      const messageDocRef = doc(db, "message", messageId);

      if (isHasReadMessage) return;
      await updateDoc(messageDocRef, { isRead: true });
    });
    await Promise.all(promises);
  }, [selectedMessagesId, messages]);

  const handleMarkAsRad = useCallback(async () => {
    try {
      handleFloatingNotification("loading");
      await handleMarkedAsReadMessageInBackendSide();

      /** NOTE:
       * after mark message as read in backend is done open floating notification
       * and mark as read message in client side
       * and close loading notification
       */

      handleMarkAsReadMessageInClientSide();
      message.destroy("loading-mark-as-read");
      handleFloatingNotification("success");
    } catch (error) {
      handleFloatingNotification("failed");
      console.error("error marking message as read: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  }, [handleFloatingNotification, handleMarkAsReadMessageInClientSide, handleMarkedAsReadMessageInBackendSide]);

  return { handleMarkAsRad, canMarkAsRead };
};

export default useMarkAsReadSelectedMessage;
