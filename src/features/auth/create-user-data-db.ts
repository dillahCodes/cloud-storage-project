import { User } from "firebase/auth";
import filteredUserData from "./filtered-user-data";
import { db } from "@/firebase/firebase-serices";
import { doc, setDoc } from "firebase/firestore";

const createUserDataDb = async (currentUser: User) => {
  const userData = filteredUserData(currentUser);

  try {
    if (userData) {
      const { uid, displayName, email, photoURL } = userData;
      const userRef = doc(db, "users", uid);

      await setDoc(userRef, {
        uid,
        displayName,
        email,
        photoURL,
      });
    }
  } catch (error) {
    console.error("error during set user data: ", error);
  }
};

export default createUserDataDb;
