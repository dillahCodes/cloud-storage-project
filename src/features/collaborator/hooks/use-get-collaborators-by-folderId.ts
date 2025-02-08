import { db } from "@/firebase/firebase-services";
import {
  collection,
  doc,
  DocumentData,
  FirestoreError,
  getDoc,
  onSnapshot,
  Query,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Collaborator, CollaboratorsStatus, CollaboratorUserData } from "../collaborator";

interface UseGetCollabolatorsByFolderId {
  folderId: string | null;
  shouldFetch: boolean;
}

interface UseGetCollaboratorsByFolderIdState {
  collaborators: CollaboratorUserData[];
  collaboratorsStatus: CollaboratorsStatus;
}

type SetStateAction = React.Dispatch<React.SetStateAction<UseGetCollaboratorsByFolderIdState>>;

interface HandleSubsToCollaborators {
  folderId: string;
  setState: SetStateAction;
}

interface HanldeCollaboratorSuccessParams {
  data: QuerySnapshot<DocumentData, DocumentData>;
  setState: SetStateAction;
}

interface HandleCollaboratorError {
  error: FirestoreError;
  setState: SetStateAction;
}

/**
 * Builds a Query object to fetch all the collaborators of a given folder.
 * The query is filtered by the `folderId` property of each collaborator document.
 *
 * @param {string} folderId - The ID of the folder whose collaborators are to be fetched.
 * @returns {Query<DocumentData, DocumentData>} A Query object that can be used with Firestore's getDocs() function to fetch the collaborators.
 */
const buildCollaboratorQuery = (folderId: string): Query<DocumentData, DocumentData> => {
  const collaboratorsCollection = collection(db, "collaborators");
  const collaboratorsQuery = query(collaboratorsCollection, where("folderId", "==", folderId));
  return collaboratorsQuery;
};

/**
 * Handles an error that occurs while fetching the collaborators of a folder.
 *
 * @param {{ error: FirestoreError, setState: SetStateAction }} props - The error that occurred and the setState function to update the state.
 * @returns {void}
 */
const handleCollaboratorError = ({ error, setState }: HandleCollaboratorError) => {
  console.error("Error fetching collaborators:", error.message);
  setState((prev) => ({ ...prev, collaboratorsStatus: "error" }));
};

/**
 * Handles a successful fetch of the collaborators of a folder.
 * @param {{ data: QuerySnapshot<DocumentData>, setState: SetStateAction }} props
 * @prop {QuerySnapshot<DocumentData>} data The QuerySnapshot containing the collaborators data.
 * @prop {SetStateAction} setState The state setter to update the state with the fetched data.
 * @returns {Promise<void>}
 * @throws {Error} If an error occurs while fetching the collaborators data.
 */
const handleCollaboratorSuccess = async ({ data, setState }: HanldeCollaboratorSuccessParams) => {
  try {
    /**
     * serialize collaborators data
     * and extract user ids
     */
    const serializedData = data.docs.map((doc) => JSON.parse(JSON.stringify(doc.data())) as Collaborator);
    const collaboratorIds = serializedData.map((collaborator) => collaborator.userId);

    /**
     * get users data from firebase
     */
    const promises = collaboratorIds.map(async (collaboratorId) => {
      const userDoc = doc(db, "users", collaboratorId);
      const snapshot = await getDoc(userDoc);
      return snapshot.exists() ? (JSON.parse(JSON.stringify(snapshot.data())) as UserDataDb) : null;
    });

    /**
     * promise all and filter user data
     */
    const userData = await Promise.all(promises);
    const filteredUserData = userData.filter((user): user is UserDataDb => user !== null);

    /**
     * create collaborator hash map {"userId": "role"}
     * and store role in object like { "99001": "admin", "99002": "user" }
     */
    const collaboratorHashMap = serializedData.reduce((map: Record<string, string>, collaborator: Collaborator) => {
      map[collaborator.userId] = collaborator.role;
      return map;
    }, {} as Record<string, string>);

    /**
     * match user data with collaborator data
     */
    const collaboratorUserData: CollaboratorUserData[] = filteredUserData.map((user) => {
      return {
        email: user.email || "",
        name: user.displayName || "",
        photoUrl: user.photoURL || null,
        role: collaboratorHashMap[user.uid],
        userId: user.uid,
      } as CollaboratorUserData;
    });

    setState({
      collaborators: collaboratorUserData,
      collaboratorsStatus: "success",
    });
  } catch (error) {
    console.error("Error fetching collaborators:", error instanceof Error ? error.message : "Unknown error");
  }
};

/**
 * Subscribes to the collaborators of a given folder and updates the state accordingly.
 * It fetches the collaborators data using Firestore's onSnapshot() function and
 * updates the state with the fetched data or an error message if an error occurs.
 * @param {{ folderId: string, setState: SetStateAction }} props
 * @prop {string} folderId The ID of the folder whose collaborators are to be fetched.
 * @prop {SetStateAction} setState The state setter to update the state with the fetched data.
 * @returns {(() => void) | undefined} The unsubscribe function to stop listening to the collaborators data.
 */
const handleSubscribeToCollaborators = ({ folderId, setState }: HandleSubsToCollaborators) => {
  const collaboratorsQuery = buildCollaboratorQuery(folderId);
  const unsubscribe = onSnapshot(
    collaboratorsQuery,
    (snap) =>
      handleCollaboratorSuccess({
        data: snap,
        setState,
      }),
    (err) =>
      handleCollaboratorError({
        error: err,
        setState,
      })
  );
  return unsubscribe;
};

const useGetCollabolatorsByFolderId = ({ folderId, shouldFetch }: UseGetCollabolatorsByFolderId) => {
  const [collabolatorsData, setCollabolatorsData] = useState<UseGetCollaboratorsByFolderIdState>({
    collaborators: [],
    collaboratorsStatus: "idle",
  });

  /**
   * Subscribe to parent folder collaborators data
   */
  useEffect(() => {
    if (!folderId || !shouldFetch) return;
    setCollabolatorsData((prev) => ({ ...prev, collaboratorsStatus: "loading" }));

    /**
     * real time listener to collaborators
     */
    const unsubscribe = handleSubscribeToCollaborators({
      folderId,
      setState: setCollabolatorsData,
    });
    return () => unsubscribe();
  }, [folderId, shouldFetch]);

  return collabolatorsData;
};

export default useGetCollabolatorsByFolderId;
