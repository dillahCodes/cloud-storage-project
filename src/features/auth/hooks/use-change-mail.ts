import { useState } from "react";
import handleAuthError from "../handle-auth-error";
import { EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification, updateEmail } from "firebase/auth";
import { auth } from "@/firebase/firebase-services";

interface ValidationEmail extends Pick<ChangeUserDataStatusProps, "type"> {
  check: boolean;
  message: string;
}

const validateEmailChange = (
  emailState: ChangeEmailState,
  setEmailChangeStatus: (props: ChangeUserDataStatusProps) => void
): boolean => {
  const { currentUser } = auth;
  const hasEmptyField = (emailState: ChangeEmailState): boolean => {
    return emailState.newEmail.trim() === "" || emailState.currentPassword.trim() === "";
  };

  const hasValidEmail = (emailState: ChangeEmailState): boolean => {
    if (emailState.newEmail.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !!emailState.newEmail.match(emailRegex);
    }
    return false;
  };

  const validations: ValidationEmail[] = [
    {
      type: "error",
      check: hasEmptyField(emailState),
      message: "Please fill out all fields",
    },
    {
      type: "warning",
      check: emailState.currentPassword.length < 8,
      message: "Current Password must be at least 8 characters long",
    },
    {
      type: "warning",
      check: !hasValidEmail(emailState),
      message: "Please enter a valid email address",
    },
    {
      check: emailState.newEmail === currentUser?.email,
      message: "New Email and Current Email must be different",
      type: "warning",
    },
  ];

  //   start validation
  for (const validation of validations) {
    if (validation.check) {
      setEmailChangeStatus({
        status: "failed",
        message: validation.message,
        type: validation.type,
      });
      return true;
    }
  }

  // If all validations pass
  setEmailChangeStatus({
    message: "",
    status: "idle",
    type: null,
  });
  return false;
};

interface ChangeEmailState {
  newEmail: string;
  currentPassword: string;
}
const useChangeEmail = () => {
  const [changeEmailState, setChangeEmailState] = useState<ChangeEmailState>({
    newEmail: "",
    currentPassword: "",
  });
  const [changeEmailStatus, setChangeEmailStatus] = useState<ChangeUserDataStatusProps>({
    message: "",
    status: "idle",
    type: null,
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeEmailState((prevValue) => ({ ...prevValue, [e.target.name]: e.target.value }));
  };

  const handleConfrimChangeEmail = async (): Promise<void> => {
    const { currentUser } = auth;
    if (validateEmailChange(changeEmailState, setChangeEmailStatus)) return;

    try {
      if (currentUser?.email) {
        setChangeEmailStatus({
          status: "loading",
          message: "Updating Email...",
          type: "info",
        });

        const userCredential = EmailAuthProvider.credential(currentUser?.email, changeEmailState.currentPassword);
        await reauthenticateWithCredential(currentUser, userCredential);
        await updateEmail(currentUser, changeEmailState.newEmail);
        await sendEmailVerification(currentUser);

        setChangeEmailStatus({
          status: "succeeded",
          message: "Email updated. Please check your email for verification.",
          type: "success",
        });
      }
    } catch (error) {
      console.error((error as Error).message);

      setChangeEmailStatus({
        status: "failed",
        message: handleAuthError(error) || "An error occurred while updating Email.",
        type: "error",
      });
    }
  };

  return {
    changeEmailState,
    changeEmailStatus,

    handleOnChange,
    handleConfrimChangeEmail,
  };
};

export default useChangeEmail;
