import useUser from "@/features/auth/hooks/use-user";
import { db } from "@/firebase/firebase-services";
import { doc, DocumentData, DocumentReference, DocumentSnapshot, FirestoreError, onSnapshot, Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect } from "react";
import handleCreateUserStorageQuota from "../handle-create-user-storage-quota";
import { useDispatch } from "react-redux";
import { setStorageData, setStorageStatus } from "../slice/user-storage-slice";

const useUserOnStorageChange = () => {
  const dispatch = useDispatch();
  const { user } = useUser();

  /**
   * handle if user storage exists
   */
  const handleUserStorageExists = useCallback(
    (snap: DocumentSnapshot<DocumentData, DocumentData>) => {
      const userStorageData = snap.data() as StorageData;
      dispatch(setStorageData(userStorageData));
      dispatch(setStorageStatus("succeeded"));
    },
    [dispatch]
  );

  /**
   *  handle if user storage not exists
   */
  const handleUserStorageNotExists = useCallback(async () => {
    try {
      await handleCreateUserStorageQuota();
      dispatch(setStorageStatus("succeeded"));
    } catch (error) {
      dispatch(setStorageStatus("failed"));
      console.error("error while creating user storage: ", error instanceof Error ? error.message : "an unknown error occurred");
    }
  }, [dispatch]);

  /**
   * handle error
   */
  const handleGetUserStorageError = useCallback(
    (error: FirestoreError) => {
      console.error("error while getting user storage: ", error.message);
      dispatch(setStorageStatus("failed"));
    },
    [dispatch]
  );

  /**
   * handle user storage snapshot
   */
  const handleUserStorageSnapshot = useCallback(
    (snap: DocumentSnapshot<DocumentData, DocumentData>) => {
      snap.exists() ? handleUserStorageExists(snap) : handleUserStorageNotExists();
    },
    [handleUserStorageExists, handleUserStorageNotExists]
  );

  /**
   * build storage query
   */
  const buildStorageQuery = useCallback(() => {
    const storageDocRef = doc(db, "users-storage", user!.uid);
    return storageDocRef;
  }, [user]);

  /**
   * realtime watch
   */
  const subscribeToUserStorage = useCallback(
    (query: DocumentReference<DocumentData, DocumentData>) => {
      return onSnapshot(query, handleUserStorageSnapshot, handleGetUserStorageError);
    },
    [handleGetUserStorageError, handleUserStorageSnapshot]
  );

  /**
   * fetch user storage
   */
  const fetchUserStorage = useCallback(() => {
    dispatch(setStorageStatus("loading"));

    const query = buildStorageQuery();
    return subscribeToUserStorage(query);
  }, [buildStorageQuery, subscribeToUserStorage, dispatch]);

  /**
   * using effect to subscribe and unsubscribe user storage
   */
  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;
    if (user) unsubscribe = fetchUserStorage();
    else dispatch(setStorageStatus("idle"));

    return () => unsubscribe && unsubscribe();
  }, [fetchUserStorage, user, dispatch]);
};
export default useUserOnStorageChange;
