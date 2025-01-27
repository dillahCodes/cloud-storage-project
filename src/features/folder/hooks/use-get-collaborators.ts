import { Collaborator, CollaboratorUserData } from "@/features/collaborator/collaborator";
import { db } from "@/firebase/firebase-services";
import { collection, doc, DocumentData, DocumentSnapshot, getDoc, onSnapshot, query, QueryDocumentSnapshot, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

interface UseGetCollaboratorsParams {
  folderId?: string;
  shouldFetch: boolean;
  shoudFetchUserCollaboratorsData?: boolean;
}

export type CollaboratorsStatusFetch = "loading" | "succeeded" | "failed" | "idle";

export const useGetCollaborators = ({ folderId, shouldFetch, shoudFetchUserCollaboratorsData }: UseGetCollaboratorsParams) => {
  const [collaborators, setCollaborators] = useState<Collaborator[] | null>(null);
  const [fetchStatus, setFetchStatus] = useState<CollaboratorsStatusFetch>("idle");

  const [collaboratorsUserData, setCollaboratorsUserData] = useState<CollaboratorUserData[] | null>(null);
  const [fetchCollaboratorsUserDataStatus, setFetchCollaboratorsUserDataStatus] = useState<CollaboratorsStatusFetch>("idle");

  /**
   * Fetch user data for collaborators
   */
  const fetchCollaboratorsUserData = useCallback(async () => {
    try {
      setFetchCollaboratorsUserDataStatus("loading");
      const userIds = collaborators?.map((collaborator) => collaborator.userId) || [];
      if (!userIds.length) throw new Error("No collaborator user IDs found");

      const promises = userIds.map(async (userId) => {
        const userDoc = doc(db, "users", userId);
        const snapshot = await getDoc(userDoc);
        return serializeUserData(snapshot, collaborators);
      });

      const userData = (await Promise.all(promises)).filter((user): user is CollaboratorUserData => user !== null);
      setCollaboratorsUserData(userData);
      setFetchCollaboratorsUserDataStatus("succeeded");
    } catch (error) {
      console.error("Error fetching collaborators user data:", error);
      setFetchCollaboratorsUserDataStatus("failed");
    }
  }, [collaborators]);

  /**
   * Build query for fetching collaborators
   */
  const buildQuery = useCallback(() => {
    if (!folderId) throw new Error("Folder ID is undefined");
    return query(collection(db, "collaborators"), where("folderId", "==", folderId));
  }, [folderId]);

  /**
   * Subscribe to collaborators collection
   */
  const subscribeToCollaborators = useCallback((collaboratorsQuery: ReturnType<typeof buildQuery>) => {
    setFetchStatus("loading");
    return onSnapshot(
      collaboratorsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => serializeCollaboratorData(doc));
        setCollaborators(data);
        setFetchStatus("succeeded");
      },
      (error) => {
        console.error("Error fetching collaborators:", error);
        setCollaborators(null);
        setFetchStatus("failed");
      }
    );
  }, []);

  useEffect(() => {
    if (!shouldFetch || !folderId) return;

    try {
      const queryInstance = buildQuery();
      const unsubscribe = subscribeToCollaborators(queryInstance);
      return () => unsubscribe();
    } catch (error) {
      console.error("Error initializing collaborators subscription:", error);
      setFetchStatus("failed");
    }
  }, [shouldFetch, folderId, buildQuery, subscribeToCollaborators]);

  useEffect(() => {
    if (shoudFetchUserCollaboratorsData && collaborators) {
      fetchCollaboratorsUserData();
    }
  }, [shoudFetchUserCollaboratorsData, collaborators, fetchCollaboratorsUserData]);

  return { collaborators, fetchStatus, collaboratorsUserData, fetchCollaboratorsUserDataStatus };
};

export default useGetCollaborators;

/**
 * Helper functions
 */
const serializeCollaboratorData = (doc: QueryDocumentSnapshot): Collaborator => {
  const data = doc.data();
  return {
    ...data,
    createAt: JSON.parse(JSON.stringify(data.createAt)),
    updateAt: data.updateAt ? JSON.parse(JSON.stringify(data.updateAt)) : null,
  } as Collaborator;
};

const serializeUserData = (doc: DocumentSnapshot<DocumentData, DocumentData>, collaborators: Collaborator[] | null): CollaboratorUserData | null => {
  if (!doc.exists()) return null;

  const userData = doc.data();
  if (!userData || !collaborators) return null;

  const collaborator = collaborators.find((c) => c.userId === doc.id);
  if (!collaborator) return null;

  return {
    email: userData.email,
    name: userData.displayName,
    photoUrl: userData.photoURL || null,
    role: collaborator.role,
    userId: doc.id,
  };
};
