import { auth, db } from "@/firebase/firebase-serices";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { CreateUserMessage } from "./message";

interface HandleSendCollaborationInvitationParams {
  userId: string;
  folderId: string;
  message: string;
}

const handleSendCollaborationInvitation = async (params: HandleSendCollaborationInvitationParams) => {
  const { userId, folderId, message } = params;
  const { currentUser } = auth;

  if (!currentUser) return false;

  const id = uuidv4();
  const payload: CreateUserMessage = {
    messageId: id,
    recipentId: userId,
    senderId: currentUser.uid,
    folderId,
    createdAt: serverTimestamp(),
    message,
    type: "add-collaborator",
    isRead: false,
    updatedAt: null,
  };

  const messageRef = doc(db, "message", id);
  await setDoc(messageRef, payload);
  return true;
};

export default handleSendCollaborationInvitation;
