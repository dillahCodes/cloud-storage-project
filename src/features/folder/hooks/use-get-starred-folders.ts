import { auth, db } from "@/firebase/firebase-serices";
import { RootFolderGetData, StarredFolderData, StarredFolderDataSerialized, SubFolderGetData } from "../folder";
import { useCallback, useEffect } from "react";
import { collection, deleteDoc, doc, DocumentData, getDoc, getDocs, orderBy, query, Query, where } from "firebase/firestore";
import useCurrentFolderSetState from "./use-current-folder-setstate";

interface UseGetStarredFolders {
  shouldFetch: boolean;
}

const useGetStarredFolders = ({ shouldFetch }: UseGetStarredFolders) => {
  const { currentUser } = auth;
  const { setFolders, setStatus } = useCurrentFolderSetState();

  /**
   * Serialize folder data for storage or processing
   * @param {StarredFolderData} data - The folder data to serialize
   * @returns {StarredFolderDataSerialized} Serialized data
   */
  const serializeFolderDataRaw = useCallback(
    (data: StarredFolderData): StarredFolderDataSerialized => ({
      ...data,
      createdAt: JSON.parse(JSON.stringify(data.createdAt)),
      updatedAt: data.updatedAt ? JSON.parse(JSON.stringify(data.updatedAt)) : null,
    }),
    []
  );

  /**
   * Serialize folder data for storage or processing
   */
  const serializeFolderData = useCallback(
    (data: RootFolderGetData | SubFolderGetData) =>
      ({
        ...data,
        created_at: data.created_at ? JSON.parse(JSON.stringify(data.created_at)) : null,
        updated_at: data.updated_at ? JSON.parse(JSON.stringify(data.updated_at)) : null,
      } as RootFolderGetData | SubFolderGetData),
    []
  );
  /**
   * Build Firestore query for fetching starred folders
   * @returns {Query<DocumentData, DocumentData> | undefined} - The query or undefined if user is not logged in
   */
  const buildQuery = useCallback((): Query<DocumentData> | undefined => {
    if (!currentUser) return undefined;

    return query(collection(db, "starredFolders"), where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));
  }, [currentUser]);

  /**
   * Deletes a starred folder by its ID for the current user.
   *
   * @param {string} folderId - The ID of the folder to delete.
   * @returns {Promise<void>} A promise that resolves when the folder is deleted.
   */
  const handleDeleteFolderStarredById = useCallback(
    async (folderId: string) => {
      if (!currentUser) return;
      const folderRef = doc(db, "starredFolders", `${currentUser.uid}_${folderId}`);
      await deleteDoc(folderRef);
    },
    [currentUser]
  );

  /**
   * Fetch folders by their IDs
   * @param {string[]} folderIds - Array of folder IDs
   * @returns {Promise<(RootFolderGetData | SubFolderGetData)[]>} - The folder data
   */
  const fetchFoldersById = useCallback(
    async (folderIds: string[]) => {
      const folderDataPromises = folderIds.map(async (id) => {
        const folderRef = doc(db, "folders", id);
        const folderSnapshot = await getDoc(folderRef);

        if (!folderSnapshot.exists()) await handleDeleteFolderStarredById(id);

        return folderSnapshot.exists() ? serializeFolderData(folderSnapshot.data() as RootFolderGetData | SubFolderGetData) : null; // Return null if folder does not exist
      });

      // Await all promises and filter out null values
      const folderData = await Promise.all(folderDataPromises);
      return folderData.filter((data) => data !== null); // Exclude null values
    },
    [serializeFolderData, handleDeleteFolderStarredById]
  );

  /**
   * Fetch starred folders of a user
   * @returns {Promise<void>} - Promise that resolves when the operation is completed
   */
  const fetchStarredFolders = useCallback(async () => {
    if (!currentUser) return;

    try {
      setStatus("loading");

      const folderQuery = buildQuery();
      if (!folderQuery) throw new Error("User is not logged in.");

      const snapshot = await getDocs(folderQuery);
      const rawStarredFolders = snapshot.docs.map((doc) => serializeFolderDataRaw(doc.data() as StarredFolderData));
      const folderIds = rawStarredFolders.map((folder) => folder.folderId);
      const starredFolders = await fetchFoldersById(folderIds);

      setFolders(starredFolders as RootFolderGetData[] | SubFolderGetData[]);
      setStatus("succeded");
    } catch (error) {
      setStatus("failed");
      console.error("Error fetching starred folders:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [currentUser, buildQuery, setStatus, fetchFoldersById, serializeFolderDataRaw, setFolders]);

  // Fetch starred folders when shouldFetch is true
  useEffect(() => {
    if (shouldFetch) fetchStarredFolders();
  }, [shouldFetch, fetchStarredFolders]);
};

export default useGetStarredFolders;
