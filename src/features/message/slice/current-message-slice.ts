import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentMessageState } from "../message";
import { RootState } from "@/store/store";

const initalState: CurrentMessageState = {
  currentMessage: null,
  fetchStatus: "idle",
  senderUserData: null,
};

export const currentMessageSlice = createSlice({
  name: "currentMessage",
  initialState: initalState,
  reducers: {
    setCurrentMessage: (state, action: PayloadAction<CurrentMessageState["currentMessage"]>) => {
      state.currentMessage = action.payload;
    },
    setCurrentMessageFetchStatus: (state, action: PayloadAction<CurrentMessageState["fetchStatus"]>) => {
      state.fetchStatus = action.payload;
    },
    setSenderUserData: (state, action: PayloadAction<CurrentMessageState["senderUserData"]>) => {
      state.senderUserData = action.payload;
    },
    resetCurrentMessageState: () => initalState,
  },
});

export const { resetCurrentMessageState, setCurrentMessage, setCurrentMessageFetchStatus, setSenderUserData } = currentMessageSlice.actions;
export const currentMessageSelector = (state: RootState) => state.currentMessage;
export default currentMessageSlice.reducer;
