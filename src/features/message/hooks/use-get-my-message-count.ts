import { auth, db } from "@/firebase/firebase-serices";
import { collection, DocumentData, getCountFromServer, orderBy, Query, query, where } from "firebase/firestore";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMyMessageCount } from "../slice/message-slice";

interface UseGetMyMessageCountParams {
  shouldFetch: boolean;
}

const useGetMyMessageCount = ({ shouldFetch }: UseGetMyMessageCountParams) => {
  const dispatch = useDispatch();

  /**
   * handle build query
   */
  const buildQuery = useCallback((): Query<DocumentData, DocumentData> => {
    const { currentUser } = auth;
    const messageCollection = collection(db, "message");

    const messageWithDataQuery = query(
      messageCollection,
      where("recipentId", "==", currentUser?.uid),
      where("isRead", "==", false),
      orderBy("createdAt", "desc")
    );

    return messageWithDataQuery;
  }, []);

  /**
   * handle get message count from server
   */
  const handleGetMessageCount = useCallback(async () => {
    try {
      // dispatch(setMyMessageFetchStatus("loading"));
      const messageCountQuery = buildQuery();
      const messageCountSnapshot = await getCountFromServer(messageCountQuery);

      const count = messageCountSnapshot.data().count;
      dispatch(setMyMessageCount(count));
      // dispatch(setMyMessageFetchStatus("succeeded"));
      return count;
    } catch (error) {
      // dispatch(setMyMessageFetchStatus("failed"));
      console.error("Error occurred while getting message count: ", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [buildQuery, dispatch]);

  /**
   * fetch only message count with initial fetch and interval
   */
  useEffect(() => {
    if (!shouldFetch) return;

    // Initial fetch
    handleGetMessageCount();

    // Interval fetch
    const intervalId = setInterval(() => {
      handleGetMessageCount();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [handleGetMessageCount, shouldFetch]);
};

export default useGetMyMessageCount;
