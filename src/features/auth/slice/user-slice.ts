import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial state with a proper type
const initialState: AuthState = {
  user: null,
  status: "idle",
  redirectUserTo: null,
};

// Create the auth slice with strong typing
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<AuthState["status"]>) => {
      state.status = action.payload;
    },
    setUser: (state, action: PayloadAction<FirebaseUserData | null>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.status = "idle";
    },
  },
});

export const { setUser, clearUser, setStatus } = authSlice.actions;
export const userSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
