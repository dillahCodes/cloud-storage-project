import { CreateUserMessage } from "./message";

const handleSerializeMessage = (message: CreateUserMessage) => {
  const { createdAt, updatedAt, ...rest } = message;
  return { ...rest, createdAt: JSON.parse(JSON.stringify(createdAt)), updatedAt: updatedAt ? JSON.parse(JSON.stringify(updatedAt)) : null };
};

export default handleSerializeMessage;
