import { auth } from "@/firebase/firebase-serices";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { AuthResponse } from "./auth";

const googleRegister = async (): Promise<AuthResponse> => {
  try {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);

    return {
      data: res.user,
      isSuccess: true,
      message: "Success",
      type: "register",
    };
  } catch (error) {
    console.error("Error during Google registration:", error);

    return {
      data: null,
      isSuccess: false,
      message: error instanceof Error ? error.message : "An error occurred",
      type: "register",
    };
  }
};

export default googleRegister;
