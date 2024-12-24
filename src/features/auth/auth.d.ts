import { User } from "firebase/auth";

type AuthType = "login" | "register" | "forgot-password";

interface AuthResponse {
  isSuccess: boolean;
  message: string;
  data: User | null;
  type: AuthType;
}

interface FormAuthLogin {
  email: string;
  password: string;
}

interface FormAuthRegister {
  username: string;
  email: string;
  password: string;
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
