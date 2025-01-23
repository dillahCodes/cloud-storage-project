import { auth } from "@/firebase/firebase-services";
import { createUserWithEmailAndPassword, updateProfile, UserCredential } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthResponse, FormAuthRegister } from "../auth";
import createAuthResponse from "../create-auth-res";
import googleRegister from "../google-register";
import handleAuthError from "../handle-auth-error";
import useUser from "./use-user";
import handleCreateUserStorageQuota from "@/features/storage/handle-create-user-storage-quota";

interface UseFormAuthRegisterReturn {
  formAuthRegister: FormAuthRegister;
  isLoading: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleOnSubmit: (event: React.FormEvent) => Promise<AuthResponse>;
  resultRegister: AuthResponse | null;
  handleGoogleRegister: () => void;
}

const useFormRegister = (): UseFormAuthRegisterReturn => {
  const { redirectUserTo } = useUser();
  const [formAuthRegister, setFormAuthRegister] = useState<FormAuthRegister>({
    username: "",
    password: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [resultRegister, setResultRegister] = useState<AuthResponse | null>(null);
  const navigate = useNavigate();

  // Function to handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormAuthRegister({ ...formAuthRegister, [e.target.name]: e.target.value });
  };

  const handleGoogleRegister = async () => {
    const result = await googleRegister();

    if (result) {
      const successResponse = createAuthResponse({
        isSuccess: true,
        message: "Register Success",
        data: result.data,
        type: "register",
      });

      setResultRegister(successResponse);
      redirectUserTo ? navigate(redirectUserTo) : navigate("/storage/my-storage");
    }
  };

  // Function to handle form submission and user registration
  const handleOnSubmit = async (e: React.FormEvent): Promise<AuthResponse> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result: UserCredential = await createUserWithEmailAndPassword(auth, formAuthRegister.email, formAuthRegister.password);

      await handleCreateUserStorageQuota();
      await updateProfile(result.user, {
        displayName: formAuthRegister.username,
      });

      const successResponse = createAuthResponse({
        isSuccess: true,
        message: "Register Success",
        data: result.user,
        type: "register",
      });

      setResultRegister(successResponse);
      redirectUserTo ? navigate(redirectUserTo) : navigate("/storage/my-storage");

      setTimeout(() => window.location.reload(), 1500);
      return successResponse;
    } catch (error) {
      const errorMessage = handleAuthError(error);

      const failureResponse = createAuthResponse({
        isSuccess: false,
        message: errorMessage,
        type: "register",
        data: null,
      });

      setResultRegister(failureResponse);
      return failureResponse;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formAuthRegister,
    handleChange,
    handleOnSubmit,
    isLoading,
    resultRegister,

    // another register method
    handleGoogleRegister,
  };
};

export default useFormRegister;
