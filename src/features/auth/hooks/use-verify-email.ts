import { useEffect, useState } from "react";
import { ChangeUserDataStatusProps } from "../auth";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/firebase/firebase-serices";

const useVerifyEmail = () => {
  const [verifyStatus, setVerifyStatus] = useState<ChangeUserDataStatusProps>({
    status: "idle",
    message: "",
    type: null,
  });
  const [countdown, setCountdown] = useState<number | null>(null);

  // if user come back with email verified
  // show success message
  // and then remove verify alert in 3 seconds
  useEffect(() => {
    const { currentUser } = auth;
    if (currentUser?.emailVerified && countdown !== null) {
      if (countdown > 0) {
        setVerifyStatus({
          status: "succeeded",
          message: "Email already verified",
          type: "success",
        });

        setCountdown(null);
        localStorage.removeItem("verifyButtonTimestamp");
        setTimeout(() => setVerifyStatus({ status: "idle", message: "", type: null }), 3000);
      }
    }
  }, [countdown]);

  // Initialize countdown based on stored timestamp
  useEffect(() => {
    const initCountdown = () => {
      const storedTime = localStorage.getItem("verifyButtonTimestamp");
      if (!storedTime) return;

      const timeElapsed = Date.now() - parseInt(storedTime, 10);
      const remainingTime = 60 - Math.floor(timeElapsed / 1000);
      setCountdown(remainingTime > 0 ? remainingTime : null);

      if (remainingTime <= 0) localStorage.removeItem("verifyButtonTimestamp");
    };
    initCountdown();
  }, []);

  // Countdown decrement count logic
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const timer: NodeJS.Timeout = setInterval(() => {
      setCountdown((prev) => {
        const updatedCount = prev! - 1;
        if (updatedCount <= 0) {
          clearInterval(timer);
          localStorage.removeItem("verifyButtonTimestamp");
          return null;
        }
        return updatedCount;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Updates verify status based on countdown state
  useEffect(() => {
    if (countdown === null) {
      setVerifyStatus({ status: "idle", message: "", type: null });
    } else if (verifyStatus.status === "idle") {
      setVerifyStatus({
        status: "loading",
        message: "Please wait before sending another verification email",
        type: "info",
      });
    }
  }, [countdown, verifyStatus]);

  // Sets timestamp in local storage and starts countdown
  const startCountdown = () => {
    const timestamp: string = Date.now().toString();
    localStorage.setItem("verifyButtonTimestamp", timestamp);
    setCountdown(60);
  };

  // Sends verification email with status handling
  const handleConfirmVerifyEmail = async (): Promise<void> => {
    const { currentUser } = auth;
    if (!currentUser) return;

    startCountdown();
    setVerifyStatus({
      status: "loading",
      message: "Sending verification email...",
      type: "info",
    });

    try {
      await sendEmailVerification(currentUser);
      setVerifyStatus({
        status: "succeeded",
        message: "Verification email sent successfully, please check your email",
        type: "success",
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
      setVerifyStatus({
        status: "failed",
        message: "An error occurred while sending the verification email",
        type: "error",
      });
    }
  };

  return {
    handleConfirmVerifyEmail,
    verifyStatus,
    countdown,
  };
};

export default useVerifyEmail;
