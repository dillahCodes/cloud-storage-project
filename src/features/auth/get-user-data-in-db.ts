import { db } from "@/firebase/firebase-services";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { UserDataDb } from "./auth";

const getUserDataInDb = async (userId: User["uid"] | string): Promise<UserDataDb | undefined> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) return undefined;

    const userData = userSnapshot.data() as UserDataDb;
    return userData;
  } catch (error) {
    console.error(`Error during getting user data for userId ${userId}:`, error instanceof Error ? error.message : error);
  }
};

export default getUserDataInDb;
