import { CreateUserMessage } from "@/features/message/message";
import handleSerializeMessage from "@/features/message/serialize-message-data";
import { db } from "@/firebase/firebase-services";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useMemo } from "react";
import useBreadcrumbSetState from "./use-breadcrumb-setstate";
import useBreadcrumbState from "./use-breadcrumb-state";

interface UseNotificationDetailsAutoGetBreadcrumbProps {
  id: string | undefined;
}

const useNotificationDetailsAutoAddBreadcrumb = ({ id }: UseNotificationDetailsAutoGetBreadcrumbProps) => {
  const { status, items } = useBreadcrumbState();
  const { setStatus, addWIthIndex } = useBreadcrumbSetState();

  const isSecondItemEmpty = useMemo(() => (items.length < 2 ? true : false), [items]);
  const isIdle = status === "idle";

  /**
   * helper to get current message
   */
  const handleGetMessageById = useCallback(async () => {
    const messageDocRef = doc(db, "message", id!);
    const result = await getDoc(messageDocRef);
    return result.exists() ? handleSerializeMessage(result.data() as CreateUserMessage) : null;
  }, [id]);

  const handleFetchMessageById = useCallback(async () => {
    try {
      setStatus("loading");
      const message = await handleGetMessageById();
      if (message) {
        addWIthIndex({
          index: 1,
          item: {
            key: message.messageId,
            label: message.message,
            path: `/storage/notification/${message.messageId}`,
          },
        });
      }

      setStatus("succeeded");
    } catch (error) {
      setStatus("failed");
      console.error("Error during getting message by id:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [handleGetMessageById, setStatus, addWIthIndex]);

  useEffect(() => {
    if (id && isIdle && isSecondItemEmpty) handleFetchMessageById();
  }, [id, isIdle, handleFetchMessageById, isSecondItemEmpty]);
};
export default useNotificationDetailsAutoAddBreadcrumb;
