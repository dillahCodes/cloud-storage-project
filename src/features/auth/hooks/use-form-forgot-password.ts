import { auth } from "@/firebase/firebase-services";
import { sendPasswordResetEmail } from "firebase/auth";
import { useReducer } from "react";
import handleAuthError from "../handle-auth-error";
import { useNavigate } from "react-router-dom";

interface ForgotPassword {
  condition: boolean;
  message: string;
}

interface HandleValidateForgotPasswordParams {
  email: string;
  dispatch: React.Dispatch<ForgotPasswordAction>;
}

const handleValidateForgotPassword = ({ dispatch, email }: HandleValidateForgotPasswordParams): boolean => {
  const hasValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validations: ForgotPassword[] = [
    {
      condition: email.trim() === "",
      message: "Email cannot be empty.",
    },
    {
      condition: !hasValidEmail(email),
      message: "Please enter a valid email address.",
    },
  ];

  const firstValidation = validations.find((validation) => validation.condition);
  if (firstValidation) {
    dispatch({ type: "SET_RESPONSE", payload: { message: firstValidation.message, type: "error" } });
    return false;
  }

  return true;
};

const initialState: ForgotPasswordState = {
  form: { email: "" },
  response: null,
  status: "idle",
};

const reducer = (state: ForgotPasswordState, action: ForgotPasswordAction): ForgotPasswordState => {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, form: { ...state.form, email: action.payload } };
    case "SET_RESPONSE":
      return { ...state, response: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "RESET":
      return initialState;
    default:
      console.warn(`Unknown action type: ${(action as ForgotPasswordAction).type}`);
      return state;
  }
};

const useFormForgotPassword = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  // handle go to login
  const handleGoToLogin = () => navigate("/login");

  // handle input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_EMAIL", payload: event.target.value });
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      dispatch({ type: "SET_STATUS", payload: "loading" });

      // validate input before sending password reset email
      const validateInput = handleValidateForgotPassword({ dispatch, email: state.form.email });
      if (!validateInput) return;

      // send password reset email
      await sendPasswordResetEmail(auth, state.form.email);

      // success and reset form
      dispatch({ type: "SET_RESPONSE", payload: { message: "Password reset email sent successfully.", type: "success" } });
    } catch (error) {
      const errorMessage = handleAuthError(error);
      dispatch({ type: "SET_RESPONSE", payload: { message: errorMessage, type: "error" } });
    } finally {
      setTimeout(() => dispatch({ type: "RESET" }), 3000);
    }
  };

  return {
    alert: state.response ? { message: state.response.message, type: state.response.type } : null,
    email: state.form.email,
    isLoading: state.status === "loading",
    handleChange,
    handleOnSubmit,
    handleGoToLogin,
  };
};

export default useFormForgotPassword;
