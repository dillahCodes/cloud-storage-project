import { UserDataDb } from "@/features/auth/auth";
import { db } from "@/firebase/firebase-services";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

type fetchStatus = "idle" | "loading" | "success" | "error";

const useGetCollaboratorsByNameOrEmail = () => {
  const [collaboratorsFetched, setCollaboratorsFetched] = useState<UserDataDb[]>([]);
  const [fetchStatus, setFetchStatus] = useState<fetchStatus>("idle");

  const handleCreateValidation = useCallback((inputSearchUser: string) => {
    const validations = [
      {
        condition: inputSearchUser.trim().length < 4,
        message: "Input value must be at least 4 characters",
      },
      {
        condition: inputSearchUser.trim().length === 0,
        message: "Input value must not be empty",
      },
    ];

    // filter failed validations
    const failedValidations = validations.filter((validation) => validation.condition);
    return failedValidations.length > 0 ? failedValidations.map((v) => v.message) : null;
  }, []);

  const handleGetUserByEmailOrUserName = useCallback(async (inputSearchUser: string) => {
    const userCollection = collection(db, "users");

    // Query for username
    const usernameQuery = query(
      userCollection,
      where("displayName", ">=", inputSearchUser),
      where("displayName", "<=", inputSearchUser + "\uf8ff"),
      orderBy("displayName", "asc"),
      limit(3)
    );

    // Query for email
    const emailQuery = query(
      userCollection,
      where("email", ">=", inputSearchUser),
      where("email", "<=", inputSearchUser + "\uf8ff"),
      orderBy("email", "asc"),
      limit(3)
    );

    // run query
    const [usernameSnapshot, emailSnapshot] = await Promise.all([getDocs(usernameQuery), getDocs(emailQuery)]);

    // Merge the results
    const users = [...usernameSnapshot.docs.map((doc) => doc.data()), ...emailSnapshot.docs.map((doc) => doc.data())];

    // remove duplicate if exist
    const uniqueUsers = Array.from(new Map(users.map((user) => [user.uid, user])).values());

    return uniqueUsers.length > 0 ? uniqueUsers : null;
  }, []);

  const handleSearchUsers = useCallback(
    async (inputSearchUser: string) => {
      const validate = handleCreateValidation(inputSearchUser);
      if (validate) {
        setCollaboratorsFetched([]);
        setFetchStatus("error");
        return;
      }

      try {
        const users = await handleGetUserByEmailOrUserName(inputSearchUser);
        setCollaboratorsFetched(users as UserDataDb[]);
        setFetchStatus("success");
      } catch (error) {
        console.error("Error fetching users: ", error instanceof Error ? error.message : "An unknown error occurred.");
      }
    },
    [handleCreateValidation, handleGetUserByEmailOrUserName]
  );

  //   eslint-disable-next-line
  const handleSearchUsersWithDebounce = useCallback(
    debounce((value: string) => handleSearchUsers(value), 500),
    []
  );

  useEffect(() => {
    return () => handleSearchUsersWithDebounce.cancel();
  }, [handleSearchUsersWithDebounce]);

  return { handleSearchUsersWithDebounce, collaboratorsFetched, fetchStatus };
};

export default useGetCollaboratorsByNameOrEmail;
