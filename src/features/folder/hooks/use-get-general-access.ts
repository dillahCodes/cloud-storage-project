import { useEffect, useState } from "react";
import { GeneralAccessData, GeneralAccessDataSerialized } from "../folder-collaborator";
import { doc, DocumentData, DocumentReference, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase-services";

interface UserGetGeneralAccessParams {
  folderId: string | undefined;
  shouldFetch: boolean;
}

export type GenerealAccessStatusFetch = "loading" | "succeeded" | "failed" | "idle";

const useGetGeneralAccess = ({ folderId, shouldFetch }: UserGetGeneralAccessParams) => {
  const [generalAccessDataState, setGeneralAccessDataState] = useState<GeneralAccessDataSerialized | null>(null);
  const [fetchStatus, setFetchStatus] = useState<GenerealAccessStatusFetch>("idle");

  useEffect(() => {
    if (!folderId || !shouldFetch) return;

    const generalAccessDataRef = handleBuildQuery(folderId);
    const unsubscribe = handleSubscribeToGeneralAccess(generalAccessDataRef, setGeneralAccessDataState, setFetchStatus);
    return () => unsubscribe();
  }, [folderId, shouldFetch]);

  return { generalAccessDataState, fetchStatus };
};

export default useGetGeneralAccess;

// helper function
const handleBuildQuery = (folderId: string): DocumentReference<DocumentData, DocumentData> => {
  const generalAccessDataRef = doc(db, "generalAccess", folderId);
  return generalAccessDataRef;
};

const handleSubscribeToGeneralAccess = (
  generalAccessDataRef: DocumentReference<DocumentData, DocumentData>,
  setGeneralAccessDataState: (data: GeneralAccessDataSerialized | null) => void,
  setFetchStatus: (status: "loading" | "succeeded" | "failed" | "idle") => void
) => {
  setFetchStatus("loading");

  const unsubscribe = onSnapshot(
    generalAccessDataRef,
    (docSnap) => {
      if (!docSnap.exists()) {
        setGeneralAccessDataState(null);
        setFetchStatus("failed");
        return;
      }

      const data = docSnap.data() as GeneralAccessData;
      const serializeData = handleSerializeGeneralAccessData(data);
      setGeneralAccessDataState(serializeData);

      setFetchStatus("succeeded");
    },
    (err) => {
      console.error("Error getting general access data:", err instanceof Error ? err.message : "An unknown error occurred.");
      setFetchStatus("failed");
    },
    () => setFetchStatus("idle")
  );

  return unsubscribe;
};

const handleSerializeGeneralAccessData = (generalAccessData: GeneralAccessData): GeneralAccessDataSerialized => {
  const generalAccessDataSerialized: GeneralAccessDataSerialized = {
    ...generalAccessData,
    createAt: JSON.parse(JSON.stringify(generalAccessData.createAt)),
    updateAt: generalAccessData.updateAt ? JSON.parse(JSON.stringify(generalAccessData.updateAt)) : null,
  };

  return generalAccessDataSerialized;
};
