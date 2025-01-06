import { useEffect } from "react";
import { onAuthStateChanged, Unsubscribe, User } from "firebase/auth";
import useUser from "./use-user";
import filteredUserData from "../filtered-user-data";
import getUserDataInDb from "../get-user-data-in-db";
import createUserDataDb from "../create-user-data-db";
import { auth } from "@/firebase/firebase-services";
import { FirebaseUserData, UserDataDb } from "../auth";

interface HasUserDataChangedProps {
  userData: Partial<Pick<FirebaseUserData, "displayName" | "email" | "photoURL">> | null;
  resultUserData: Partial<Pick<UserDataDb, "displayName" | "email" | "photoURL">> | undefined;
}

const useAuthStateChanged = () => {
  const { setStatus, setUser } = useUser();

  const hasUserDataChanged = ({ userData, resultUserData }: HasUserDataChangedProps): boolean => {
    if (!userData || !resultUserData) return false;

    const fieldsToCompare: (keyof typeof userData)[] = ["displayName", "email", "photoURL"];
    return fieldsToCompare.some((field) => userData[field] !== resultUserData[field]);
  };

  const handleUserFound = async (currentUser: User) => {
    setStatus("loading");
    const userData = filteredUserData(currentUser);
    const resultUserData = await getUserDataInDb(currentUser.uid);

    if (resultUserData) {
      setUser(userData);
      const hasChanged = hasUserDataChanged({ userData, resultUserData });
      hasChanged && createUserDataDb(currentUser);
    } else {
      await createUserDataDb(currentUser);
      setUser(userData);
    }
    setStatus("succeeded");
  };

  const handleUserNotFound = () => {
    setUser(null);
    setStatus("idle");
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useAuthStateChanged;
