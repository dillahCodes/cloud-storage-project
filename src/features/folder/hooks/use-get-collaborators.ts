import { db } from "@/firebase/firebase-serices";
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  Query,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Collaborator, CollaboratorRole, CollaboratorUserData } from "../folder-collaborator";

interface UseGetCollabolatorsParams {
  folderId?: string;
  shouldFetch: boolean;
  shoudFetchUserCollaboratorsData?: boolean;
}

export type CollaboratorsStatusFetch = "loading" | "succeeded" | "failed" | "idle";

export const useGetCollaborators = ({
  folderId,
  shouldFetch,
  shoudFetchUserCollaboratorsData,
}: UseGetCollabolatorsParams) => {
  const [collaborators, setCollaborators] = useState<Collaborator[] | null>(null);
  const [fetchStatus, setFetchStatus] = useState<CollaboratorsStatusFetch>("idle");

  const [collaboratorsUserData, setCollaboratorsUserData] = useState<CollaboratorUserData[] | null>(null);
  const [fetchCollaboratorsUserDataStatus, setFetchCollaboratorsUserDataStatus] =
    useState<CollaboratorsStatusFetch>("idle");

  const handleFetchCollaboratorsUserData = useCallback(async (): Promise<
    (CollaboratorUserData | null)[] | null
  > => {
    const collaboratorsUserId = handleGetAllCollaboratorsUserId(collaborators);

    if (!collaboratorsUserId || collaboratorsUserId.length === 0) return null;

    const promises = collaboratorsUserId.map(async (userId: string) => {
      const userDoc = doc(db, "users", userId);
      const userData = await getDoc(userDoc);
      return handleSetUserData(userData, collaborators);
    });

    const userData = await Promise.all(promises);
    return userData;
  }, [collaborators]);

  useEffect(() => {
    const handleFetch = async () => {
      if (!shoudFetchUserCollaboratorsData || !collaborators) return;

      try {
        setFetchCollaboratorsUserDataStatus("loading");

        const userData = await handleFetchCollaboratorsUserData();
        if (userData) {
          const validUserData = userData.filter((user): user is CollaboratorUserData => user !== null);
          setCollaboratorsUserData(validUserData);
        } else {
          setCollaboratorsUserData(null);
        }

        setFetchCollaboratorsUserDataStatus("succeeded");
      } catch (error) {
        setFetchCollaboratorsUserDataStatus("failed");
        console.error(
          "Error while fetching collaborators user data: ",
          error instanceof Error ? error.message : error
        );
      }
    };

    handleFetch();
  }, [shoudFetchUserCollaboratorsData, collaborators, handleFetchCollaboratorsUserData]);

  const buildQuery = useCallback(() => {
    const collaboratorsCollection = collection(db, "collaborators");
    const collaboratorsQuery = query(collaboratorsCollection, where("folderId", "==", folderId));
    return collaboratorsQuery;
  }, [folderId]);

  const subscribeToCollaborators = useCallback((q: Query) => {
    setFetchStatus("loading");
    return onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => handleSerializeData(doc)) as Collaborator[];
        setCollaborators(data);
        setFetchStatus("succeeded");
      },
      (err) => {
        console.error("error while fetching collaborators: ", err.message);
        setFetchStatus("failed");
      }
    );
  }, []);

  useEffect(() => {
    if (!shouldFetch || !folderId) return;

    const q = buildQuery();
    const unsubscribe = subscribeToCollaborators(q);
    return () => unsubscribe();
  }, [shouldFetch, buildQuery, subscribeToCollaborators, folderId]);

  return { collaborators, fetchStatus, collaboratorsUserData, fetchCollaboratorsUserDataStatus };
};

export default useGetCollaborators;

// helper
const handleSerializeData = (data: QueryDocumentSnapshot<DocumentData>) => {
  return {
    ...data.data(),
    createAt: JSON.parse(JSON.stringify(data.data().createAt)),
    updateAt: data.data().updateAt ? JSON.parse(JSON.stringify(data.data().updateAt)) : null,
  };
};

const handleGetAllCollaboratorsUserId = (collaborators: Collaborator[] | null) => {
  if (!collaborators) return [];
  return collaborators.map((collaborator) => collaborator.userId);
};

const handleSetUserData = (
  data: DocumentSnapshot<DocumentData>,
  collaborators: Collaborator[] | null
): CollaboratorUserData | null => {
  if (!data.exists()) return null;

  const userData = data.data();
  if (!userData || !collaborators || collaborators.length === 0) return null;

  return {
    email: userData.email as string,
    name: userData.displayName as string,
    photoUrl: userData.photoURL ? (userData.photoURL as string) : null,
    role: collaborators?.find((collaborator) => collaborator.userId === data.id)?.role as CollaboratorRole,
    userId: data.id,
  };
};
