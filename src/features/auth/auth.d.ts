type BaseAuthStatus = "idle" | "loading" | "succeeded" | "failed";
type BaseAuthResponse = {
  type: "error" | "success" | "warning";
  message: string;
};

type BaseAuthForm = {
  username: string;
  email: string;
  password: string;
};

interface AuthRegisterState {
  form: Pick<BaseAuthForm, "username" | "email" | "password">;
  response: BaseAuthResponse | null;
  status: BaseAuthStatus;
}

interface AuthLoginState {
  form: Pick<BaseAuthForm, "email" | "password">;
  response: BaseAuthResponse | null;
  status: BaseAuthStatus;
}

interface FirebaseUserData {
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: {
    createdAt: string | undefined;
    lastLoginAt: string | undefined;
  };
  uid: string;
  phoneNumber: string | null;
  photoURL: string | null;
  providerData: ProviderData[];
}

interface ProviderData {
  providerId: string;
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
}

interface AuthState {
  user: FirebaseUserData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  redirectUserTo: string | null;
}

interface UserDataDb {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

interface ChangeUserDataStatusProps {
  status: "loading" | "succeeded" | "failed" | "idle";
  message: string;
  type: "success" | "info" | "warning" | "error" | null;
}
