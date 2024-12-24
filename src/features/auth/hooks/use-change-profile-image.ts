import { auth, storage } from "@/firebase/firebase-serices";
import Compressor from "compressorjs";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, StorageReference, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { ChangeUserDataStatusProps } from "../auth";

const compressAndUploadImage = (file: File, storageRef: StorageReference): Promise<string> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      convertTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
      convertSize: 0,
      success: async (result: Blob | File) => {
        try {
          await uploadBytes(storageRef, result);
          const downloadUrl = await getDownloadURL(storageRef);
          resolve(downloadUrl);
        } catch (error) {
          console.error("Error during image upload:", error);
          reject(new Error("Failed to upload image to storage."));
        }
      },
      error: (error: Error) => {
        console.error("Error during image compression:", error);
        reject(new Error("Failed to compress image."));
      },
    });
  });
};

const updateUserProfileImage = async (downloadUrl: string) => {
  try {
    const { currentUser } = auth;
    if (currentUser) await updateProfile(currentUser, { photoURL: downloadUrl });
  } catch (error) {
    console.error("Error updating profile image:", error);
  }
};

interface InputImageStateProps {
  image: File | null;
  base64Image: string | null;
}

const useChangeProfileImage = () => {
  const [fileData, setFileData] = useState<InputImageStateProps>({
    image: null,
    base64Image: null,
  });
  const [uploadImageStatus, setUploadImageStatus] = useState<ChangeUserDataStatusProps>({
    message: "",
    status: "idle",
    type: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setFileData({ image: file, base64Image: URL.createObjectURL(file) });
  };

  const handleConfirmChangeImage = async () => {
    const { currentUser } = auth;

    if (!fileData.image) {
      setUploadImageStatus({ status: "failed", message: "No image selected.", type: "error" });
      return;
    }

    setUploadImageStatus({ status: "loading", message: "Compressing and uploading image...", type: "info" });

    try {
      if (currentUser) {
        const storageRef = ref(storage, `user-profile-images/${currentUser.uid}`);
        const downloadUrl = await compressAndUploadImage(fileData.image, storageRef);
        await updateUserProfileImage(downloadUrl);
        setUploadImageStatus({ status: "succeeded", message: "Profile image updated successfully.", type: "success" });
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error(error);

      setUploadImageStatus({
        type: "error",
        status: "failed",
        message: (error as Error).message || "An error occurred while uploading the image.",
      });
    }
  };

  return {
    fileData,
    uploadImageStatus,
    handleChange,
    handleConfirmChangeImage,
  };
};

export default useChangeProfileImage;
