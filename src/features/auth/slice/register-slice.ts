import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthRegisterState = {
  form: {
    username: "",
    email: "",
    password: "",
  },
  response: null,
  status: "idle",
};

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    updateRegisterForm: (state, action: PayloadAction<Partial<AuthRegisterState["form"]>>) => {
      state.form = { ...state.form, ...action.payload };
    },
    setRegisterResponse: (state, action: PayloadAction<AuthRegisterState["response"]>) => {
      state.response = action.payload;
    },
    setStatusRegister: (state, action: PayloadAction<AuthRegisterState["status"]>) => {
      state.status = action.payload;
    },
  },
});

export const { updateRegisterForm, setRegisterResponse, setStatusRegister } = registerSlice.actions;
export const registerSelector = (state: RootState) => state.register;
