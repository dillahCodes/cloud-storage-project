import { useEffect, useState } from "react";
import { doc, DocumentData, DocumentReference, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase-services";
import { GeneralAccessData } from "@/features/collaborator/collaborator";

interface UserGetGeneralAccessParams {
  folderId: string | undefined;
  shouldFetch: boolean;
}

export type GeneralAccessStatusFetch = "loading" | "succeeded" | "failed" | "idle";

const useGetGeneralAccess = ({ folderId, shouldFetch }: UserGetGeneralAccessParams) => {
  const [generalAccessDataState, setGeneralAccessDataState] = useState<GeneralAccessData | null>(null);
  const [fetchStatus, setFetchStatus] = useState<GeneralAccessStatusFetch>("idle");

  useEffect(() => {
    if (!folderId || !shouldFetch) return;

    setFetchStatus("loading");

    const generalAccessDataRef = buildQuery(folderId);
    const unsubscribe = subscribeToGeneralAccess(generalAccessDataRef, setGeneralAccessDataState, setFetchStatus);

    return () => {
      unsubscribe();
      setFetchStatus("idle"); // Reset state to idle after unsubscribe
    };
  }, [folderId, shouldFetch]);

  return { generalAccessDataState, fetchStatus };
};

export default useGetGeneralAccess;

// Helper functions
const buildQuery = (folderId: string): DocumentReference<DocumentData, DocumentData> => {
  return doc(db, "generalAccess", folderId);
};

const subscribeToGeneralAccess = (
  generalAccessDataRef: DocumentReference<DocumentData, DocumentData>,
  setGeneralAccessDataState: (data: GeneralAccessData | null) => void,
  setFetchStatus: (status: GeneralAccessStatusFetch) => void
) => {
  const unsubscribe = onSnapshot(
    generalAccessDataRef,
    (docSnap) => {
      if (!docSnap.exists()) {
        setGeneralAccessDataState(null);
        setFetchStatus("failed");
        return;
      }

      const data = docSnap.data() as GeneralAccessData;
      const serializedData = serializeGeneralAccessData(data);
      setGeneralAccessDataState(serializedData);
      setFetchStatus("succeeded");
    },
    (error) => {
      console.error("Error fetching general access data:", error instanceof Error ? error.message : "Unknown error");
      setGeneralAccessDataState(null);
      setFetchStatus("failed");
    }
  );

  return unsubscribe;
};

const serializeGeneralAccessData = (generalAccessData: GeneralAccessData): GeneralAccessData => {
  return {
    ...generalAccessData,
    createAt: JSON.parse(JSON.stringify(generalAccessData.createAt)),
    updateAt: generalAccessData.updateAt ? JSON.parse(JSON.stringify(generalAccessData.updateAt)) : null,
  };
};
