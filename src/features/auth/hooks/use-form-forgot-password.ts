import { useState } from "react";
import { AuthResponse } from "../auth";
import createAuthResponse from "../create-auth-res";
import handleAuthError from "../handle-auth-error";
import { auth } from "@/firebase/firebase-services";
import { sendPasswordResetEmail } from "firebase/auth";

interface ForgotPassword extends AuthResponse {
  check: boolean;
}

const validateForgotPassword = (email: string, setForgotPasswordResult: (response: AuthResponse) => void): boolean => {
  const hasValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validations: ForgotPassword[] = [
    {
      check: email.trim() === "",
      message: "Please fill out all fields.",
      data: null,
      isSuccess: false,
      type: "forgot-password",
    },
    {
      check: !hasValidEmail(email),
      message: "Please enter a valid email address.",
      data: null,
      isSuccess: false,
      type: "forgot-password",
    },
  ];

  for (const validation of validations) {
    if (validation.check) {
      setForgotPasswordResult({
        isSuccess: validation.isSuccess,
        message: validation.message,
        data: validation.data,
        type: validation.type,
      });
      return false;
    }
  }

  return true; // if all validations pass
};

const useFormForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordResult, setForgotPasswordResult] = useState<AuthResponse | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateForgotPassword(email, setForgotPasswordResult)) {
        setIsLoading(false);
        return;
      }

      await sendPasswordResetEmail(auth, email);

      const successResponse = createAuthResponse({
        isSuccess: true,
        message: "Password reset email sent successfully.",
        data: null,
        type: "forgot-password",
      });

      setForgotPasswordResult(successResponse);
      return successResponse;
    } catch (error) {
      const errorMessage = handleAuthError(error);
      const failureResponse = createAuthResponse({
        isSuccess: false,
        message: errorMessage,
        type: "forgot-password",
        data: null,
      });

      setForgotPasswordResult(failureResponse);
      return failureResponse;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    isLoading,
    forgotPasswordResult,
    handleChange,
    handleOnSubmit,
  };
};

export default useFormForgotPassword;
