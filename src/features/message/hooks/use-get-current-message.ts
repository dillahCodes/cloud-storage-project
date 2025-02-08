import { db } from "@/firebase/firebase-services";
import { message } from "antd";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreateUserMessage } from "../message";
import handleSerializeMessage from "../serialize-message-data";
import { setCurrentMessage, setCurrentMessageFetchStatus, setSenderUserData } from "../slice/current-message-slice";

interface UseGetCurrentMessageParams {
  id: string | undefined;
  shouldFetch: boolean;
}

interface ValidationsGetCurrentMessage {
  condition: boolean;
  message: string;
  key: string;
}

const useGetCurrentMessage = ({ id, shouldFetch }: UseGetCurrentMessageParams) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * Helper to validate
   */
  const createValidation = useCallback(() => {
    const validations: ValidationsGetCurrentMessage[] = [
      { condition: !id, message: "Message ID is required.", key: "message-get-required-id" },
    ];

    return validations.find((validation) => validation.condition) || null;
  }, [id]);

  /**
   * helper to get current message
   */
  const handleGetMessageById = useCallback(async () => {
    const messageDocRef = doc(db, "message", id!);
    const result = await getDoc(messageDocRef);
    return result.exists() ? handleSerializeMessage(result.data() as CreateUserMessage) : null;
  }, [id]);

  /**
   * helper get sender user data
   */
  const handleGetSenderUserData = useCallback(async (userId: string) => {
    const userDataDocRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDataDocRef);

    if (!userSnapshot.exists()) return undefined;

    const userData = userSnapshot.data() as UserDataDb;
    return userData;
  }, []);

  const handleGetCurrentMessage = useCallback(async () => {
    const validationsError = createValidation();
    if (validationsError) {
      message.open({
        type: "warning",
        content: validationsError.message,
        className: "font-archivo text-sm",
        key: validationsError.key,
      });
      return;
    }

    try {
      dispatch(setCurrentMessageFetchStatus("loading"));

      const result = await handleGetMessageById();

      if (!result) {
        navigate("/not-found", { replace: true, state: { message: `message with id: "${id}" not found` } });
        return;
      }

      const snederUserData = await handleGetSenderUserData(result.senderId);

      dispatch(setSenderUserData(snederUserData || null));
      dispatch(setCurrentMessage(result));

      dispatch(setCurrentMessageFetchStatus("succeeded"));
    } catch (error) {
      dispatch(setCurrentMessageFetchStatus("failed"));
      message.open({ type: "error", content: "error while gettig message by id", className: "font-archivo text-sm" });

      console.error("error while gettig message by id: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  }, [createValidation, handleGetMessageById, id, navigate, dispatch, handleGetSenderUserData]);

  useEffect(() => {
    if (shouldFetch) handleGetCurrentMessage();
  }, [handleGetCurrentMessage, shouldFetch]);
};
export default useGetCurrentMessage;
