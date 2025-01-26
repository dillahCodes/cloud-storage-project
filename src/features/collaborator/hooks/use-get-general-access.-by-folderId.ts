import { db } from "@/firebase/firebase-services";
import { doc, DocumentData, DocumentReference, DocumentSnapshot, FirestoreError, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { CollaboratorsStatus, GeneralAccessData } from "../collaborator";

interface UseGetGeneralAccessDataByFolderId {
  folderId: string | null;
  shouldFetch: boolean;
}

interface UseGetGeneralAccessByFolderIdState {
  generalAccess: GeneralAccessData | null;
  generalAccessStatus: CollaboratorsStatus;
}

type SetStateAction = React.Dispatch<React.SetStateAction<UseGetGeneralAccessByFolderIdState>>;

interface HandleSubsToGeneralAccessParams {
  folderId: string;
  setState: SetStateAction;
}

interface HandleGeneralAccessSuccessParams {
  data: DocumentSnapshot<DocumentData>;
  setState: SetStateAction;
}

interface HandleGeneralAccessErrorParams {
  error: FirestoreError;
  setState: SetStateAction;
}

/**
 * Builds a DocumentReference to a Firestore document containing the general access data of a folder.
 *
 * @param {string} folderId The ID of the folder whose general access data is to be fetched.
 * @returns {DocumentReference<DocumentData>} The DocumentReference of the Firestore document.
 */
const buildGeneralAccessDocRef = (folderId: string): DocumentReference<DocumentData> => {
  return doc(db, "generalAccess", folderId);
};

/**
 * Handles error when fetching general access data from Firestore.
 * @param {{ error: FirestoreError, setState: SetStateAction }} props
 * @prop {FirestoreError} error The Firestore error that occurred.
 * @prop {SetStateAction} setState The state setter to update the state with the error status.
 */
const handleGeneralAccessError = ({ error, setState }: HandleGeneralAccessErrorParams) => {
  setState((prev) => ({ ...prev, generalAccessStatus: "error" }));
  console.error("Error fetching general access:", error.message);
};

/**
 * Handles successful fetch of general access data from Firestore.
 * @param {{ data: DocumentSnapshot<DocumentData>, setState: SetStateAction }} props
 * @prop {DocumentSnapshot<DocumentData>} data The DocumentSnapshot containing the general access data.
 * @prop {SetStateAction} setState The state setter to update the state with the fetched data.
 */
const handleGeneralAccessSuccess = ({ data, setState }: HandleGeneralAccessSuccessParams) => {
  const generalAccessSerialized = JSON.parse(JSON.stringify(data.data())) as GeneralAccessData;
  setState({
    generalAccess: generalAccessSerialized,
    generalAccessStatus: "success",
  });
};

/**
 * Subscribes to Firestore to fetch general access data of a folder.
 * @param {string} folderId The folder ID.
 * @returns {() => void} The unsubscribe function.
 */

const handleSubscribeToGeneralAccess = ({ folderId, setState }: HandleSubsToGeneralAccessParams) => {
  const generalAccessDocRef = buildGeneralAccessDocRef(folderId);
  const unsubscribe = onSnapshot(
    generalAccessDocRef,
    (snap) =>
      handleGeneralAccessSuccess({
        data: snap,
        setState,
      }),
    (error) =>
      handleGeneralAccessError({
        error,
        setState,
      })
  );
  return unsubscribe;
};

const useGetGeneralAccessDataByFolderId = ({ folderId, shouldFetch }: UseGetGeneralAccessDataByFolderId) => {
  const [generalAccessData, setGeneralAccessData] = useState<UseGetGeneralAccessByFolderIdState>({
    generalAccess: null,
    generalAccessStatus: "idle",
  });

  /**
   * Subscribe to parent folder general access data
   */
  useEffect(() => {
    if (!folderId || !shouldFetch) return;
    setGeneralAccessData((prev) => ({ ...prev, generalAccessStatus: "loading" }));

    /**
     * real time listener to general access
     */
    const unsubscribe = handleSubscribeToGeneralAccess({
      folderId,
      setState: setGeneralAccessData,
    });
    return () => unsubscribe();
  }, [folderId, shouldFetch]);

  return generalAccessData;
};

export default useGetGeneralAccessDataByFolderId;
