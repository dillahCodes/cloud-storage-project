import { useCallback, useEffect } from "react";
import { onAuthStateChanged, Unsubscribe, User } from "firebase/auth";
import useUser from "./use-user";
import filteredUserData from "../filtered-user-data";
import getUserDataInDb from "../get-user-data-in-db";
import createUserDataDb from "../create-user-data-db";
import { auth } from "@/firebase/firebase-services";

interface HasUserDataChangedProps {
  userData: Partial<Pick<FirebaseUserData, "displayName" | "email" | "photoURL">> | null;
  resultUserData: Partial<Pick<UserDataDb, "displayName" | "email" | "photoURL">> | undefined;
}
/**
 * track if user data has changed
 */
const hasUserDataChanged = ({ userData, resultUserData }: HasUserDataChangedProps): boolean => {
  if (!userData || !resultUserData) return false;
  const fieldsToCompare: (keyof typeof userData)[] = ["displayName", "email", "photoURL"];
  return fieldsToCompare.some((field) => userData[field] !== resultUserData[field]);
};

const useAuthStateChanged = () => {
  const { setStatus, setUser } = useUser();

  /**
   * handle if user is found
   */
  const handleUserFound = useCallback(
    async (currentUser: User) => {
      setStatus("loading");
      const userData = filteredUserData(currentUser);
      const resultUserData = await getUserDataInDb(currentUser.uid);

      if (!resultUserData) {
        await createUserDataDb(currentUser);
        setUser(userData);
      }

      if (resultUserData) {
        const hasChanged = hasUserDataChanged({ userData, resultUserData });
        hasChanged && createUserDataDb(currentUser);
      }

      setUser(userData);
      setStatus("succeeded");
    },
    [setUser, setStatus]
  );

  /**
   * handle if user not found
   */
  const handleUserNotFound = useCallback(() => {
    setUser(null);
    setStatus("idle");
  }, [setUser, setStatus]);

  useEffect(() => {
    const handleAuthChange = async (currentUser: User | null) => {
      try {
        currentUser ? await handleUserFound(currentUser) : handleUserNotFound();
      } catch (error) {
        console.error("Error handling auth state change:", error);
        setStatus("idle");
      }
    };

    setStatus("loading");
    const unsubs: Unsubscribe = onAuthStateChanged(auth, handleAuthChange);

    return () => unsubs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useAuthStateChanged;
