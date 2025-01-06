import { useDispatch, useSelector } from "react-redux";
import { deleteMyMessageById, messageSelector, setMyMessageCount } from "../slice/message-slice";
import { resetSelectedMessage, selectedMessageSelector } from "../slice/selected-message-slice";
import { message } from "antd";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase-services";
import { useCallback } from "react";

const useDeleteSelectedMessage = () => {
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
   * Helper - handle delete message in client side
   */
  const handleDeleteMessageInClientSide = useCallback(() => {
    selectedMessagesId.forEach((messageId) => dispatch(deleteMyMessageById(messageId)));
    dispatch(setMyMessageCount(messages.length - selectedMessagesId.length));
    dispatch(resetSelectedMessage());
  }, [dispatch, messages.length, selectedMessagesId]);

  /**
   * Helper - handle delete message in Backend side
   */
  const handleDeleteMessageInBackendSide = useCallback(async () => {
    const promises = selectedMessagesId.map(async (messageId) => {
      const messageDocRef = doc(db, "message", messageId);
      await deleteDoc(messageDocRef);
    });

    await Promise.all(promises);
  }, [selectedMessagesId]);

  /**
   * Helper - handle floating notification
   */
  const handleFloatingNotification = useCallback(
    (type: "loading" | "success" | "failed") => {
      switch (type) {
        case "loading":
          message.open({
            key: "deleting",
            type: "loading",
            content: `Deleting ${selectedMessagesId.length} ${selectedMessagesId.length > 1 ? "messages" : "message"}...`,
            className: "font-archivo text-sm capitalize",
            duration: 0,
          });
          break;

        case "success":
          message.open({
            key: "success",
            type: "success",
            content: `Deleted ${selectedMessagesId.length} ${selectedMessagesId.length > 1 ? "messages" : "message"} successfully`,
            className: "font-archivo text-sm capitalize",
          });
          break;

        case "failed":
          message.open({
            key: "failed",
            type: "error",
            content: `failed to delete ${selectedMessagesId.length} ${selectedMessagesId.length > 1 ? "messages" : "message"}, please try again`,
            className: "font-archivo text-sm capitalize",
          });
          break;

        default:
          break;
      }
    },
    [selectedMessagesId.length]
  );

  const handleDelete = async () => {
    try {
      handleFloatingNotification("loading");
      await handleDeleteMessageInBackendSide();

      /** NOTE:
       * after delete message in backend is done open floating notification
       * and delete message in client side
       * and close loading notification
       */
      handleDeleteMessageInClientSide();
      message.destroy("deleting");
      handleFloatingNotification("success");
    } catch (error) {
      handleFloatingNotification("failed");
      console.error("error deleting message: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  };

  return { handleDelete };
};

export default useDeleteSelectedMessage;
