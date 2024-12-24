import { auth, db } from "@/firebase/firebase-serices";
import { collection, DocumentData, getDocs, orderBy, Query, query, where } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageSelector, setMyMessageFetchStatus, setMyMessages } from "../slice/message-slice";
import handleSerializeMessage from "../serialize-message-data";
import { CreateUserMessage, GetUserMessage } from "../message";

interface useGetMyMessageParams {
  messageCount: number;
  unreadMessages: GetUserMessage[];
}

const useGetMyMessage = ({ messageCount, unreadMessages }: useGetMyMessageParams) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const dispatch = useDispatch();

  /**
   * message state
   */
  const { messages } = useSelector(messageSelector);
  const messagesId = useMemo(() => (messages ? messages.map((message) => message.messageId) : []), [messages]);

  const sortedMessages = useMemo(() => {
    const isSorted = (messages: GetUserMessage[]) =>
      messages.every((message, index, arr) => {
        if (index === 0) return true;

        const previousMessage = arr[index - 1];
        const isPreviousHasRead = previousMessage.isRead;
        const isCurrentSameAsPreviousHasRead = message.isRead === isPreviousHasRead;

        return !isPreviousHasRead || isCurrentSameAsPreviousHasRead;
      });

    const alreadySorted = isSorted(messages);
    setIsSorted(alreadySorted);

    return alreadySorted ? messages : [...messages].sort((a, b) => (a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1));
  }, [messages]);

  const buildFirstQuery = useCallback((): Query<DocumentData, DocumentData> => {
    const { currentUser } = auth;
    const messageCollection = collection(db, "message");
    const messageWithDataQuery = query(messageCollection, where("recipentId", "==", currentUser?.uid), orderBy("createdAt", "desc"));
    return messageWithDataQuery;
  }, []);

  const buildWatchQuery = useCallback((): Query<DocumentData, DocumentData> => {
    const { currentUser } = auth;
    const messageCollection = collection(db, "message");
    const messageWithDataQuery = query(
      messageCollection,
      where("recipentId", "==", currentUser?.uid),
      where("messageId", "not-in", messagesId),
      orderBy("createdAt", "desc")
    );
    return messageWithDataQuery;
  }, [messagesId]);

  /**
   * fetch with message data
   */
  const fetchMessages = useCallback(async () => {
    try {
      dispatch(setMyMessageFetchStatus("loading"));

      const messageQuery = messages.length === 0 ? buildFirstQuery() : buildWatchQuery();
      const snapshot = await getDocs(messageQuery);
      const messagesResult = snapshot.docs.map((doc) => doc.data());

      const messagesSerialized = messagesResult.map((message) => handleSerializeMessage(message as CreateUserMessage));
      dispatch(setMyMessages([...messagesSerialized, ...messages]));

      dispatch(setMyMessageFetchStatus("succeeded"));
    } catch (error) {
      dispatch(setMyMessageFetchStatus("failed"));
      console.error("Error fetching messages: ", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [dispatch, messages.length]); // eslint-disable-line

  /**
   * Watch for changes in messageCount and unreadMessages
   */
  useEffect(() => {
    messageCount > unreadMessages.length || messages.length === 0 ? setShouldFetch(true) : setShouldFetch(false);
  }, [messageCount, unreadMessages, messages]);

  /**
   * Trigger fetch when shouldFetch is true
   */
  useEffect(() => {
    if (shouldFetch) fetchMessages();
  }, [shouldFetch, fetchMessages]);

  /**
   * Trigger sort when isSorted is false
   */
  useEffect(() => {
    !isSorted && dispatch(setMyMessages(sortedMessages));
  }, [dispatch, sortedMessages, isSorted]);
};

export default useGetMyMessage;
