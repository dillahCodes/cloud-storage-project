import { auth } from "@/firebase/firebase-services";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const googleRegister = async (): Promise<boolean> => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);

    return true;
  } catch (error) {
    console.error("Error during Google registration:", error);
    return false;
  }
};

export default googleRegister;
