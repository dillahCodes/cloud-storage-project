import { auth } from "@/firebase/firebase-services";
import { signOut } from "firebase/auth";

const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export default logOut;
