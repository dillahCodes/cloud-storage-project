import { User } from "firebase/auth";
import { FirebaseUserData } from "./auth";

const filteredUserData = (currentUser: User | null): FirebaseUserData | null => {
  if (currentUser) {
    const filteredUserData: FirebaseUserData = {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName,
      emailVerified: currentUser.emailVerified,
      phoneNumber: currentUser.phoneNumber,
      photoURL: currentUser.photoURL,
      providerData: currentUser.providerData,
      isAnonymous: currentUser.isAnonymous,
      metadata: {
        createdAt: currentUser.metadata.creationTime,
        lastLoginAt: currentUser.metadata.lastSignInTime,
      },
    };
    return filteredUserData;
  } else {
    return null;
  }
};

export default filteredUserData;
