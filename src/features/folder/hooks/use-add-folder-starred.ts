import { auth, db } from "@/firebase/firebase-serices";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useCallback } from "react";
import { StarredFolderData, StarredFolderDataSerialized } from "../folder";
import { message } from "antd";
import abbreviateText from "@/util/abbreviate-text";

interface NotificationConfig {
  key: string;
  type: "loading" | "warning" | "success" | "error";
  duration: number;
}

interface NotificationParams {
  type: NotificationConfig["type"];
  message: string;
}

/**
 * Hook for handling starred folder functionality
 */
const useAddFolderStarred = () => {
  const { currentUser } = auth;

  /**
   * Show a floating notification based on type and message
   * @param {AddStaredFolderFloatingNotification} params - Notification parameters
   */
  const showNotification = useCallback((params: NotificationParams) => {
    const { message: notificationMessage, type } = params;

    // Map notification type to its corresponding configuration
    const notificationTypes: Record<NotificationConfig["type"], NotificationConfig> = {
      loading: { key: "loading-starred-folder", type: "loading", duration: 0 },
      warning: { key: "warning-starred-folder", type: "warning", duration: 2 },
      success: { key: "succeeded-starred-folder", type: "success", duration: 3 },
      error: { key: "failed-starred-folder", type: "error", duration: 2 },
    };

    const config: NotificationConfig = notificationTypes[type];
    if (config) {
      message.open({
        ...config,
        content: notificationMessage,
        className: "font-archivo text-sm capitalize",
      });
    }
  }, []);

  /**
   * Serialize folder data for storage or processing
   * @param {StarredFolderData} data - The folder data to serialize
   * @returns {StarredFolderDataSerialized} Serialized data
   */
  const serializeFolderData = useCallback((data: StarredFolderData): StarredFolderDataSerialized => {
    return {
      ...data,
      createdAt: JSON.parse(JSON.stringify(data.createdAt)),
      updatedAt: data.updatedAt ? JSON.parse(JSON.stringify(data.updatedAt)) : null,
    };
  }, []);

  /**
   * Retrieve starred folder data by folder ID
   * @param {string} folderId - The ID of the folder to retrieve
   * @returns {Promise<StarredFolderDataSerialized | null>} The folder data or null if not found
   */
  const getStarredFolderData = useCallback(
    async (folderId: string): Promise<StarredFolderDataSerialized | null> => {
      const docId = `${currentUser?.uid}_${folderId}`;
      const starredFolderDocRef = doc(db, "starredFolders", docId);

      // Fetch folder data from Firestore
      const starredFolderSnapshot = await getDoc(starredFolderDocRef);

      return starredFolderSnapshot.exists() ? serializeFolderData(starredFolderSnapshot.data() as StarredFolderData) : null;
    },
    [currentUser, serializeFolderData]
  );

  /**
   * Add a folder to starred collection
   * @param {string} folderId - The ID of the folder to star
   * @param {string} folderName - The name of the folder
   */
  const addFolderToStarred = useCallback(
    async (folderId: string, folderName: string): Promise<void> => {
      try {
        // Notify the user that the process is starting
        showNotification({
          type: "loading",
          message: `Adding ${abbreviateText(folderName, 10)} to starred...`,
        });

        if (!currentUser) return;

        // Check if the folder is already starred
        const isStarred = await getStarredFolderData(folderId);
        if (isStarred) {
          // Warn the user if the folder is already starred
          message.destroy("loading-starred-folder");
          showNotification({
            type: "warning",
            message: `${abbreviateText(folderName, 10)} is already starred`,
          });
          return;
        }

        // Prepare the payload for Firestore
        const docId = `${currentUser.uid}_${folderId}`;
        const starredFolderDocRef = doc(db, "starredFolders", docId);
        const payload: StarredFolderData = {
          folderId,
          userId: currentUser.uid,
          updatedAt: null,
          createdAt: serverTimestamp(),
        };

        // Save the folder to the starred collection
        await setDoc(starredFolderDocRef, payload);

        // Notify success
        showNotification({
          type: "success",
          message: `${abbreviateText(folderName, 10)} added to starred`,
        });
        message.destroy("loading-starred-folder");
      } catch (error) {
        // Handle and notify any errors
        message.destroy("loading-starred-folder");
        showNotification({
          type: "error",
          message: `Failed to add ${abbreviateText(folderName, 10)} to starred, please try again`,
        });
        console.error("Error adding folder to starred:", error instanceof Error ? error.message : "An unknown error occurred");
      }
    },
    [currentUser, getStarredFolderData, showNotification]
  );

  return { addFolderToStarred };
};

export default useAddFolderStarred;
