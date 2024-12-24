import { FieldValue } from "firebase/firestore";
import { UserDataDb } from "../auth/auth";

type UserMessageType = "add-collaborator";

interface UserMessageTimeStampSerialized {
  seconds: number;
  nanoseconds: number;
}

interface UserMessage {
  messageId: string;
  senderId: string;
  recipentId: string;

  type: UserMessageType;
  message: string;
  folderId: string | null;
  isRead: boolean;
}

interface CreateUserMessage extends UserMessage {
  createdAt: FieldValue;
  updatedAt: null | FieldValue;
}

interface GetUserMessage extends UserMessage {
  createdAt: UserMessageTimeStampSerialized;
  updatedAt: null | UserMessageTimeStampSerialized;
}

type MessageFetchStatus = "idle" | "loading" | "succeeded" | "failed";

interface MessageState {
  messageCount: number;
  messages: GetUserMessage[];
  fetchStatus: MessageFetchStatus;
}

interface SelectedMessageState {
  selectedMessagesId: GetUserMessage["messageId"][];
}

interface CurrentMessageState {
  currentMessage: GetUserMessage | null;
  fetchStatus: MessageFetchStatus;
  senderUserData: UserDataDb | null;
}
