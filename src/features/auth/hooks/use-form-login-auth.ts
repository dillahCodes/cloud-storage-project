import { auth } from "@/firebase/firebase-services";
import { Dispatch } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import handleAuthError from "../handle-auth-error";
import { loginSelector, setLoginResponse, setStatusLogin, updateLoginForm } from "../slice/login-slice";
import googleRegister from "../google-register";

interface HandleValidateBeforeLoginParams {
  email: string;
  password: string;
  dispatch: Dispatch;
}

const handleValidateBeforeLogin = ({ email, password, dispatch }: HandleValidateBeforeLoginParams) => {
  const conditions = [
    {
      condition: !email || email.trim() === "",
      message: "Email cannot be empty.",
    },
    {
      condition: !password || password.trim() === "",
      message: "Password cannot be empty.",
    },
    {
      condition: !email.includes("@"),
      message: "Please enter a valid email address.",
    },
    {
      condition: password.length < 8,
      message: "Password must be at least 8 characters long.",
    },
  ];

  const firstValidation = conditions.find((condition) => condition.condition);
  if (firstValidation) {
    dispatch(setLoginResponse({ message: firstValidation.message, type: "error" }));
    dispatch(setStatusLogin("failed"));
    return false;
  }

  return true;
};

const useFormLoginAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // form state
  const { form, response, status } = useSelector(loginSelector);
  const { email, password } = form;

  // Function to handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name;
    dispatch(updateLoginForm({ [fieldName]: e.target.value }));
  };

  // Function to handle go to register
  const handleGoToRegister = () => navigate("/register");

  // function to handle go to forgot password
  const handleGoToForgotPassword = () => navigate("/forgot-password");

  const handleGoogleRegister = async () => {
    const result = await googleRegister();
    if (result) {
      dispatch(setLoginResponse({ message: "login success, redirecting...", type: "success" }));
      setTimeout(() => {
        navigate("/storage/my-storage");
        dispatch(setLoginResponse(null));
      }, 2000);
    }
  };

  // Function to handle form submission and user registration
  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      dispatch(setStatusLogin("loading"));

      // validate email and password before login
      const validateBeforeLogin = handleValidateBeforeLogin({ email, password, dispatch });
      if (!validateBeforeLogin) return;

      // login user
      await signInWithEmailAndPassword(auth, email, password);

      // success and reset form
      dispatch(setLoginResponse({ message: "Login Success, redirecting...", type: "success" }));
      dispatch(updateLoginForm({ email: "", password: "" }));
      dispatch(setStatusLogin("succeeded"));

      // redirect user to home
      setTimeout(() => navigate("/storage/my-storage"), 1500);
    } catch (error) {
      dispatch(setStatusLogin("failed"));

      // set error message
      const errorMessage = handleAuthError(error);
      dispatch(setLoginResponse({ message: errorMessage, type: "error" }));
    } finally {
      // reset status and response after 2 seconds
      setTimeout(() => {
        dispatch(setLoginResponse(null));
        dispatch(setStatusLogin("idle"));
      }, 2000);
    }
  };

  return {
    formValue: form,
    isLoading: status === "loading",
    alert: response ? { message: response.message, type: response.type } : null,
    handleEmailChange: handleChange,
    handlePasswordChange: handleChange,
    googleLoginHandler: handleGoogleRegister,
    handleGoToRegister,
    handleGoToForgotPassword,
    handleOnSubmit,
  };
};

export default useFormLoginAuth;
