import handleCreateUserStorageQuota from "@/features/storage/handle-create-user-storage-quota";
import { auth } from "@/firebase/firebase-services";
import { Dispatch } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, updateProfile, UserCredential } from "firebase/auth";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import googleRegister from "../google-register";
import handleAuthError from "../handle-auth-error";
import { registerSelector, setRegisterResponse, setStatusRegister, updateRegisterForm } from "../slice/register-slice";

interface HandleValidateBeforeRegisterParams {
  username: string;
  email: string;
  password: string;
  dispatch: Dispatch;
}

const handleValidateBeforeRegister = ({ email, password, username, dispatch }: HandleValidateBeforeRegisterParams) => {
  const conditions = [
    {
      condition: !username || username.trim() === "",
      message: "Username cannot be empty.",
    },
    {
      condition: username.length < 5,
      message: "Username must be at least 5 characters long.",
    },
    {
      condition: !email || email.trim() === "",
      message: "Email cannot be empty.",
    },
    {
      condition: !password || password.trim() === "",
      message: "Password cannot be empty.",
    },
    {
      condition: password.length < 8,
      message: "Password must be at least 8 characters long.",
    },
    {
      condition: !email.includes("@"),
      message: "Please enter a valid email address.",
    },
  ];

  const firstValidation = conditions.find((condition) => condition.condition);
  if (firstValidation) {
    dispatch(setRegisterResponse({ message: firstValidation.message, type: "error" }));
    dispatch(setStatusRegister("failed"));
    return false;
  }

  return true;
};

const useFormRegister = () => {
  const dispatch = useDispatch();
  const { form, status, response } = useSelector(registerSelector);
  const { email, password, username } = form;
  // const { redirectUserTo } = useUser();

  const navigate = useNavigate();

  // handle go to login page
  const handleGoToLoginPage = useCallback(() => navigate("/login"), [navigate]);

  // Function to handle form input changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nameField = e.target.name;
      dispatch(updateRegisterForm({ [nameField]: e.target.value }));
    },
    [dispatch]
  );

  // Function to handle google register
  const handleGoogleRegister = useCallback(async () => {
    const result = await googleRegister();
    if (result) {
      dispatch(setRegisterResponse({ message: "register success, redirecting...", type: "success" }));
      setTimeout(() => {
        navigate("/storage/my-storage");
        dispatch(setRegisterResponse(null));
      }, 2000);
    }
  }, [dispatch, navigate]);

  // Function to handle form submission and user registration
  const handleOnSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(setStatusRegister("loading"));

      try {
        // Validate before register
        const validateBeforeRegister = handleValidateBeforeRegister({ email, password, username, dispatch });
        if (!validateBeforeRegister) return;

        // Register user
        const result: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
        await handleCreateUserStorageQuota();
        await updateProfile(result.user, { displayName: username });

        // Success and reset form
        dispatch(setRegisterResponse({ message: "Register Success, redirecting...", type: "success" }));
        dispatch(setStatusRegister("succeeded"));
        dispatch(updateRegisterForm({ username: "", email: "", password: "" }));

        // redirect user to home
        setTimeout(() => {
          navigate("/storage/my-storage");
          window.location.reload();
        }, 1500);
      } catch (error) {
        const errorMessage = handleAuthError(error);
        dispatch(setRegisterResponse({ message: errorMessage, type: "error" }));
      } finally {
        // reset status and response after 2 seconds
        setTimeout(() => {
          dispatch(setRegisterResponse(null));
          dispatch(setStatusRegister("idle"));
        }, 2000);
      }
    },
    [dispatch, email, password, username, navigate]
  );

  return {
    formValue: form,
    isLoading: status === "loading",
    alert: response ? { message: response.message, type: response.type } : null,
    handleEmailChange: handleChange,
    handlePasswordChange: handleChange,
    handleUserNameChange: handleChange,
    handleGoogleRegister,
    handleGoToLoginPage,
    handleOnSubmit,
  };
};

export default useFormRegister;
