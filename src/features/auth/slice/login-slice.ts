import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthLoginState = {
  form: {
    email: "",
    password: "",
  },
  response: null,
  status: "idle",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    updateLoginForm: (state, action: PayloadAction<Partial<AuthLoginState["form"]>>) => {
      state.form = { ...state.form, ...action.payload };
    },
    setLoginResponse: (state, action: PayloadAction<AuthLoginState["response"]>) => {
      state.response = action.payload;
    },
    setStatusLogin: (state, action: PayloadAction<AuthLoginState["status"]>) => {
      state.status = action.payload;
    },
  },
});

export const { updateLoginForm, setLoginResponse, setStatusLogin } = loginSlice.actions;
export const loginSelector = (state: RootState) => state.login;
