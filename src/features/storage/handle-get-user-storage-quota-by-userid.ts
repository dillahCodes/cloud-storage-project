import { db } from "@/firebase/firebase-services";
import { doc, getDoc } from "firebase/firestore";

const handleGetUserStorageQuotaByUserId = async (userId: string) => {
  const storageRef = doc(db, "users-storage", userId);
  const storageSnap = await getDoc(storageRef);
  return storageSnap.exists() ? (storageSnap.data() as StorageData) : null;
};

export default handleGetUserStorageQuotaByUserId;
