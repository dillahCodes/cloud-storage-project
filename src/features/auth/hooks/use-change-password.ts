import { auth } from "@/firebase/firebase-services";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useState } from "react";
import { ChangeUserDataStatusProps } from "../auth";
import handleAuthError from "../handle-auth-error";

const hasEmptyField = (passwordState: ChangePasswordState): boolean => {
  return passwordState.currentPassword.trim() === "" || passwordState.newPassword.trim() === "" || passwordState.confirmPassword.trim() === "";
};

interface ValidationPassword extends Pick<ChangeUserDataStatusProps, "type"> {
  check: boolean;
  message: string;
}

const validatePasswordChange = (passwordState: ChangePasswordState, statusState: (props: ChangeUserDataStatusProps) => void): boolean => {
  const validations: ValidationPassword[] = [
    {
      check: hasEmptyField(passwordState),
      message: "Please fill out all fields",
      type: "error",
    },
    {
      check: passwordState.currentPassword === passwordState.newPassword,
      message: "Current Password and New Password must be different",
      type: "warning",
    },
    {
      check: passwordState.currentPassword.length > 0 && passwordState.currentPassword.length < 8,
      message: "Current Password must be at least 8 characters long",
      type: "warning",
    },
    {
      check: passwordState.newPassword.length > 0 && passwordState.newPassword.length < 8,
      message: "New Password must be at least 8 characters long",
      type: "warning",
    },
    {
      check: passwordState.newPassword !== passwordState.confirmPassword,
      message: "New Password and Confirm Password must be the same",
      type: "warning",
    },
  ];

  //   start validation
  for (const validation of validations) {
    if (validation.check) {
      statusState({
        status: "failed",
        message: validation.message,
        type: validation.type,
      });
      return true;
    }
  }

  // If all validations pass
  statusState({
    message: "",
    status: "idle",
    type: null,
  });
  return false;
};

interface ChangePasswordState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
const useChangePassword = () => {
  const [password, setPassword] = useState<ChangePasswordState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changePasswordStatus, setChangePasswordStatus] = useState<ChangeUserDataStatusProps>({
    message: "",
    status: "idle",
    type: null,
  });

  const handleChangeState = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword((prevValue) => ({ ...prevValue, [e.target.name]: e.target.value }));
  };

  const handleConfirmChangePassword = async () => {
    const { currentUser } = auth;
    if (validatePasswordChange(password, setChangePasswordStatus)) return;

    try {
      if (currentUser?.email) {
        setChangePasswordStatus({
          status: "loading",
          message: "Updating Password...",
          type: "info",
        });

        const credential = EmailAuthProvider.credential(currentUser.email, password.currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, password.newPassword);

        setChangePasswordStatus({
          status: "succeeded",
          message: "Password changed successfully",
          type: "success",
        });
      }
    } catch (error) {
      console.error((error as Error).message);

      setChangePasswordStatus({
        status: "failed",
        message: handleAuthError(error) || "An error occurred while updating Password.",
        type: "error",
      });
    }
  };

  return {
    password,
    changePasswordStatus,
    handleChangeState,

    handleConfirmChangePassword,
  };
};

export default useChangePassword;
