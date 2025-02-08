import { auth } from "@/firebase/firebase-services";
import { updateProfile } from "firebase/auth";
import { useState } from "react";
import useUser from "./use-user";

interface ValidationChangeName extends Pick<ChangeUserDataStatusProps, "type"> {
  check: boolean;
  message: string;
}
const validationUserNameChane = (
  nameState: string,
  statusState: (props: ChangeUserDataStatusProps) => void,
  userName: string
) => {
  // if (userName) {
  const validations: ValidationChangeName[] = [
    {
      check: nameState.trim() === "",
      message: "Name cannot be empty.",
      type: "error",
    },
    {
      check: nameState.length < 3,
      message: "Name must be at least 3 characters long.",
      type: "warning",
    },
    {
      check: nameState === userName,
      message: "Name not changed.",
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
// };

const useChangeName = () => {
  const { user } = useUser();
  const [name, setName] = useState<string>(user?.displayName || "");
  const [changeNameStatus, setChangeNameStatus] = useState<ChangeUserDataStatusProps>({
    message: "",
    status: "idle",
    type: null,
  });

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);

  const handleConfirmChangeName = async () => {
    const { currentUser } = auth;

    try {
      if (currentUser && user?.displayName) {
        if (validationUserNameChane(name, setChangeNameStatus, user?.displayName)) return;
        setChangeNameStatus({ status: "loading", message: "Updating name...", type: "info" });

        updateProfile(currentUser, { displayName: name });
        setChangeNameStatus({ status: "succeeded", message: "Name updated successfully.", type: "success" });
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error(error);

      setChangeNameStatus({
        type: "error",
        status: "failed",
        message: (error as Error).message || "An error occurred while updating name.",
      });
    }
  };

  return {
    name,
    handleChangeName,
    handleConfirmChangeName,
    changeNameStatus,
  };
};

export default useChangeName;
