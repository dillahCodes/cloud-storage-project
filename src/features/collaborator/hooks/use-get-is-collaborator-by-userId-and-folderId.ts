import { db } from "@/firebase/firebase-services";
import { doc, DocumentData, DocumentSnapshot, FirestoreError, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Collaborator, CollaboratorsStatus } from "../collaborator";

interface UseGetUsCollaboratorByUserIdAndFolderIdParams {
  userId: string | null;
  folderId: string | null;
  shouldFetch: boolean;
}

interface UseGetUsCollaboratorByUserIdAndFolderIdPState {
  isCollaborator: boolean;
  collaboratorData: Collaborator | null;
  collaboratorStatus: CollaboratorsStatus;
}

type SetStateAction = React.Dispatch<React.SetStateAction<UseGetUsCollaboratorByUserIdAndFolderIdPState>>;
type HandleBuildQueryParams = Pick<UseGetUsCollaboratorByUserIdAndFolderIdParams, "folderId" | "userId">;

interface HandleSubsToCollaboratorParams extends Pick<UseGetUsCollaboratorByUserIdAndFolderIdParams, "folderId" | "userId"> {
  setState: SetStateAction;
}

interface HandleCollaboratorError {
  error: FirestoreError;
  setState: SetStateAction;
}

interface HandleCollaboratorSuccess {
  data: DocumentSnapshot<DocumentData, DocumentData>;
  setState: SetStateAction;
}

/**
 * Builds a DocumentReference to fetch a collaborator document based on a given folderId and userId.
 * @param {{ folderId: string, userId: string }} params
 * @param {string} params.folderId The ID of the folder whose collaborator to be fetched.
 * @param {string} params.userId The ID of the user whose collaborator to be fetched.
 * @returns {DocumentReference} A DocumentReference to the collaborator document.
 */
const handleBuildQueryGetCollaborator = ({ folderId, userId }: HandleBuildQueryParams) => {
  const collaboratorDoc = doc(db, "collaborators", `${folderId}_${userId}`);
  return collaboratorDoc;
};

/**
 * Handles errors that occur when fetching collaborator data.
 *
 * @param {{ error: FirestoreError, setState: SetStateAction }} props
 * @prop {FirestoreError} error The Firestore error that occurred.
 * @prop {SetStateAction} setState The state setter to update the collaborator status to "error".
 * @returns {void}
 */

const handleCollaboratorError = ({ error, setState }: HandleCollaboratorError) => {
  console.error("Error fetching collaborators:", error.message);
  setState((prev) => ({ ...prev, collaboratorStatus: "error" }));
};

/**
 * Handles a successful fetch of a collaborator document.
 * @param {{ data: DocumentSnapshot<DocumentData, DocumentData>, setState: SetStateAction }} props
 * @prop {DocumentSnapshot<DocumentData, DocumentData>} data The DocumentSnapshot containing the collaborator data.
 * @prop {SetStateAction} setState The state setter to update the state with the fetched data.
 * @returns {void}
 */
const handleCollaboratorSuccess = ({ data, setState }: HandleCollaboratorSuccess) => {
  const isCollaborator = data.exists();
  const collabolatorDataSerialized = isCollaborator ? (JSON.parse(JSON.stringify(data.data())) as Collaborator) : null;

  setState((prev) => ({
    ...prev,
    collaboratorData: collabolatorDataSerialized,
    collaboratorStatus: "success",
    isCollaborator: isCollaborator,
  }));
};

/**
 * Subscribes to a collaborator document based on a given folderId and userId,
 * and updates the state with the fetched data or an error message if an error occurs.
 * @param {{ folderId: string, setState: SetStateAction, userId: string }} props
 * @prop {string} folderId The ID of the folder whose collaborator to be fetched.
 * @prop {SetStateAction} setState The state setter to update the state with the fetched data.
 * @prop {string} userId The ID of the user whose collaborator to be fetched.
 * @returns {(() => void) | undefined} The unsubscribe function to stop listening to the collaborator data.
 */
const handleSubsToCollaborator = ({ folderId, setState, userId }: HandleSubsToCollaboratorParams) => {
  const collaboratorQuery = handleBuildQueryGetCollaborator({ folderId, userId });
  const unsubscribe = onSnapshot(
    collaboratorQuery,
    (snap) => handleCollaboratorSuccess({ data: snap, setState }),
    (error) => handleCollaboratorError({ error, setState })
  );

  return unsubscribe;
};

const useGetIsCollaboratorByUserIdAndFolderId = ({ shouldFetch, userId, folderId }: UseGetUsCollaboratorByUserIdAndFolderIdParams) => {
  const [collaboratorData, setCollaboratorData] = useState<UseGetUsCollaboratorByUserIdAndFolderIdPState>({
    collaboratorData: null,
    isCollaborator: false,
    collaboratorStatus: "idle",
  });

  useEffect(() => {
    if (!shouldFetch || !userId || !folderId) return;
    setCollaboratorData((prev) => ({ ...prev, collaboratorStatus: "loading" }));

    const unsubscribe = handleSubsToCollaborator({ folderId, setState: setCollaboratorData, userId });
    return () => unsubscribe();
  }, [shouldFetch, userId, folderId]);

  return collaboratorData;
};

export default useGetIsCollaboratorByUserIdAndFolderId;
