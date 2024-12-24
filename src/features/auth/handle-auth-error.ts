import firebaseAuthErrorMessages from "./auth-error-message";

const handleAuthError = (error: unknown): string => {
  if (error instanceof Error && "code" in error) {
    const firebaseError = error as { code: string };
    return firebaseAuthErrorMessages[firebaseError.code] || "Register Failed. Please Try Again.";
  }

  return "Register Failed. Please Try Again.";
};

export default handleAuthError;
