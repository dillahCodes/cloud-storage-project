import { auth } from "@/firebase/firebase-services";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { useState } from "react";
import createAuthResponse from "../create-auth-res";
import handleAuthError from "../handle-auth-error";
import { AuthResponse, FormAuthLogin } from "../auth";
import useUser from "./use-user";
import { useNavigate } from "react-router-dom";

interface UseFormAuthRegisterReturn {
  formAuthLogin: FormAuthLogin;
  isLoading: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleOnSubmit: (event: React.FormEvent) => Promise<AuthResponse>;
  resultLogin: AuthResponse | null;
}
const useFormLoginAuth = (): UseFormAuthRegisterReturn => {
  const { redirectUserTo } = useUser();
  const [formAuthLogin, setFormAuthLogin] = useState<FormAuthLogin>({
    password: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultLogin, setResultLogin] = useState<AuthResponse | null>(null);
  const navigate = useNavigate();

  // Function to handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormAuthLogin({ ...formAuthLogin, [e.target.name]: e.target.value });
  };

  // Function to handle form submission and user registration
  const handleOnSubmit = async (e: React.FormEvent): Promise<AuthResponse> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result: UserCredential = await signInWithEmailAndPassword(auth, formAuthLogin.email, formAuthLogin.password);
      const successResponse = createAuthResponse({
        isSuccess: true,
        message: "Register Success",
        data: result.user,
        type: "login",
      });

      setResultLogin(successResponse);
      redirectUserTo ? navigate(redirectUserTo) : navigate("/storage/my-storage");
      return successResponse;
    } catch (error) {
      setIsLoading(false);

      const errorMessage = handleAuthError(error);
      const failureResponse = createAuthResponse({
        isSuccess: false,
        message: errorMessage,
        type: "register",
        data: null,
      });

      setResultLogin(failureResponse);
      return failureResponse;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formAuthLogin,
    isLoading,
    handleChange,
    handleOnSubmit,
    resultLogin,
  };
};

export default useFormLoginAuth;
