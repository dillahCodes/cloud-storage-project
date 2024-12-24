import { UserCredential } from "firebase/auth";
import { AuthResponse, AuthType } from "./auth";

interface CreateAuthProps {
  isSuccess: boolean;
  message: string;
  data: UserCredential["user"] | null;
  type: AuthType;
}

const createAuthResponse = (props: CreateAuthProps): AuthResponse => ({
  isSuccess: props.isSuccess,
  message: props.message,
  type: props.type,
  data: props.data,
});

export default createAuthResponse;
