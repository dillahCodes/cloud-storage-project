import { auth, db } from "@/firebase/firebase-services";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const handleCreateUserStorageQuota = async () => {
  const { currentUser } = auth;
  if (!currentUser) return;

  const payload: StorageData = {
    userId: currentUser.uid,
    storageId: uuidv4(),
    storageCapacity: parseInt(import.meta.env.VITE_USE_STORAGE_CAPACITY),
    storageUsed: 0,
  };

  const storageRef = doc(db, "users-storage", payload.userId);
  await setDoc(storageRef, payload);
};
export default handleCreateUserStorageQuota;
