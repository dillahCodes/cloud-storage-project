import { db } from "@/firebase/firebase-services";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { UserDataDb } from "../auth";

interface UseGetUserByIdParams {
  id: string;
  shouldFetch: boolean;
}
const useGetUserById = ({ id, shouldFetch }: UseGetUserByIdParams) => {
  const [userData, setUserData] = useState<UserDataDb | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "succeeded" | "failed">("idle");

  const handleFetchUser = useCallback(async () => {
    try {
      setStatus("loading");
      const userRef = doc(db, "users", id);
      const userSnapshot = await getDoc(userRef);

      const userData = userSnapshot.data() as UserDataDb;
      setUserData(userData);

      setStatus("succeeded");
      return userData;
    } catch (error) {
      console.error("error while gettig user by id: ", error);
    } finally {
      setStatus("idle");
    }
  }, [id]);

  useEffect(() => {
    if (shouldFetch) handleFetchUser();
  }, [handleFetchUser, shouldFetch]);

  return { userData, status };
};

export default useGetUserById;
