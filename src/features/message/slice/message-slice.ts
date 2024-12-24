import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageState } from "../message";
import { RootState } from "@/store/store";

const initialState: MessageState = {
  messageCount: 0,
  messages: [],
  fetchStatus: "idle",
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMyMessages: (state, action: PayloadAction<MessageState["messages"]>) => {
      state.messages = action.payload;
    },
    setMyMessageCount: (state, action: PayloadAction<MessageState["messageCount"]>) => {
      state.messageCount = action.payload;
    },
    setMyMessageFetchStatus: (state, action: PayloadAction<MessageState["fetchStatus"]>) => {
      state.fetchStatus = action.payload;
    },
    deleteMyMessageById: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter((message) => message.messageId !== action.payload);
    },
    resetMyMessage: () => initialState,
  },
});

export const { setMyMessages, setMyMessageCount, resetMyMessage, setMyMessageFetchStatus, deleteMyMessageById } = messageSlice.actions;
export const messageSelector = (state: RootState) => state.message;
export default messageSlice.reducer;
