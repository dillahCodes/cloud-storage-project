import { UserDataDb } from "@/features/auth/auth";
import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalAddSelectedCollaboratorsState } from "../collaborator";

const initialState: ModalAddSelectedCollaboratorsState = {
  collaboratorsData: null,
  message: "add collaborators to folder",
};

export const modalAddSelectedCollaboratorsSlice = createSlice({
  name: "modalAddSelectedCollaborators",
  initialState,
  reducers: {
    addCollaborators: (state, action: PayloadAction<UserDataDb>) => {
      const isUserExist = state.collaboratorsData?.find((user: UserDataDb) => user.uid === action.payload.uid);
      !isUserExist && (state.collaboratorsData = [...(state.collaboratorsData || []), action.payload]);
    },
    removeSelectedUser: (state, action: PayloadAction<string>) => {
      const newUsers = state.collaboratorsData?.filter((user: UserDataDb) => user.uid !== action.payload);
      state.collaboratorsData = newUsers || [];
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    resetCollaboratorsState: (state) => {
      state.collaboratorsData = null;
    },
  },
});

export const { addCollaborators, setMessage, removeSelectedUser, resetCollaboratorsState } = modalAddSelectedCollaboratorsSlice.actions;
export const modalAddSelectedCollaboratorsSelector = (state: RootState) => state.modalAddSelectedCollaborators;
export default modalAddSelectedCollaboratorsSlice.reducer;
