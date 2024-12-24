import { message } from "antd";

const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    message.open({ type: "success", content: "Copied to clipboard", className: "font-archivo text-sm" });
  } catch (error) {
    console.error("Failed to copy text to clipboard:", error);
  }
};

export default copyToClipboard;
