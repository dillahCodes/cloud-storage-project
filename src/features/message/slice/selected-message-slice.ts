import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectedMessageState } from "../message";
import { RootState } from "@/store/store";

const initialState: SelectedMessageState = {
  selectedMessagesId: [],
};

export const selectedMessageSlice = createSlice({
  name: "selectedMessage",
  initialState,
  reducers: {
    addSelectedMessage: (state, action: PayloadAction<string>) => {
      const isDataExist = state.selectedMessagesId.some((id) => id === action.payload);
      !isDataExist && state.selectedMessagesId.push(action.payload);
    },
    addSelectedMessages: (state, action: PayloadAction<string[]>) => {
      state.selectedMessagesId = action.payload;
    },
    deleteSelectedMessage: (state, action: PayloadAction<string>) => {
      state.selectedMessagesId = state.selectedMessagesId.filter((id) => id !== action.payload);
    },
    resetSelectedMessage: (state) => {
      state.selectedMessagesId = [];
    },
  },
});

export const { addSelectedMessage, addSelectedMessages, deleteSelectedMessage, resetSelectedMessage } = selectedMessageSlice.actions;
export const selectedMessageSelector = (state: RootState) => state.selectedMessage;
export default selectedMessageSlice.reducer;
