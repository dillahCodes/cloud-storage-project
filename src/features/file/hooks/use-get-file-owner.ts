import { UserDataDb } from "@/features/auth/auth";
import useUser from "@/features/auth/hooks/use-user";
import { db } from "@/firebase/firebase-services";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

interface UseGetFileOwnerParams {
  fileData: SubFileGetData | RootFileGetData;
  shouldFetch: boolean;
}
const useGetFileOwner = ({ fileData, shouldFetch }: UseGetFileOwnerParams) => {
  const { user } = useUser();
  const [fileOwner, setFileOwner] = useState<string | null>(null);

  const handleGetFileOwner = useCallback(async () => {
    try {
      const userDocRef = doc(db, "users", fileData.owner_user_id);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as UserDataDb;
        userData.uid === user?.uid ? setFileOwner("me") : setFileOwner(userData.displayName);
      } else {
        setFileOwner(null);
      }
    } catch (error) {
      console.error("error while getting file owner: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  }, [fileData.owner_user_id, user]);

  useEffect(() => {
    if (shouldFetch && user) handleGetFileOwner();
  }, [shouldFetch, handleGetFileOwner, user]);

  return { fileOwner };
};

export default useGetFileOwner;
