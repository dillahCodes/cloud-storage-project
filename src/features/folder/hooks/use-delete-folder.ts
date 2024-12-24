import { auth, db, storage } from "@/firebase/firebase-serices";
import { RootFolderGetData, SubFolderGetData } from "../folder";
import { collection, deleteDoc, doc, DocumentData, getDocs, query, QuerySnapshot, where } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import useDetectLocation from "@/hooks/use-detect-location";

const useDeleteFolder = (folderData: RootFolderGetData | SubFolderGetData) => {
  const { currentUser } = auth;
  const { isSharedWithMeLocation, isStarredLocation } = useDetectLocation();

  const handleDeleteRecursively = async (folderId: string) => {
    try {
      // Fetch subfolders in the current folder
      const subFoldersSnapshot: QuerySnapshot<DocumentData, DocumentData> = await handleGetSubFoldersById(folderId);

      // Recursively delete all subfolders
      if (!subFoldersSnapshot.empty) {
        for (const subFolderDoc of subFoldersSnapshot.docs) await handleDeleteRecursively(subFolderDoc.id);
      }

      // Fetch files in the current folder
      const subFileSnapshot: QuerySnapshot<DocumentData, DocumentData> = await handleGetFilesByParentFolderId(folderId);

      // Delete all files in the current folder
      if (!subFileSnapshot.empty) await handleDeleteAllFiles(subFileSnapshot);

      // Fetch all Folder Collaborators
      const collaboratorsSnapshot: QuerySnapshot<DocumentData, DocumentData> = await handleGetAllFolderCollaborators(folderId);

      // Delete all Folder Collaborators
      if (!collaboratorsSnapshot.empty) await handleDeleteAllCollaborators(collaboratorsSnapshot);

      // Delete Folder General Access Data
      await handleDeleteFolderGeneralAccessData(folderId);

      // Delete the folder itself from Firestore
      await handleDeleteFolderById(folderId);
    } catch (error) {
      console.error(
        `Error during recursive deletion of folder ID ${folderId}: `,
        error instanceof Error ? error.message : "Unknown error."
      );
      throw error;
    }
  };

  const deleteSharedWithMeFolder = async (folderId: string) => {
    if (!currentUser) return;

    const folderRef = doc(db, "sharedWithMeFolders", `${currentUser?.uid}_${folderId}`);
    await deleteDoc(folderRef);
    window.location.reload();
  };

  const deleteStarredFolder = async (folderId: string) => {
    if (!currentUser) return;

    const folderRef = doc(db, "starredFolders", `${currentUser?.uid}_${folderId}`);
    await deleteDoc(folderRef);
    window.location.reload();
  };

  // Main function to confirm deletion of a folder
  const handleConfirmDeleteFolder = async () => {
    try {
      if (isSharedWithMeLocation) return await deleteSharedWithMeFolder(folderData.folder_id);
      else if (isStarredLocation) return await deleteStarredFolder(folderData.folder_id);
      else return await handleDeleteRecursively(folderData.folder_id);
    } catch (error) {
      console.error("Error confirming folder deletion: ", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  };

  return { handleConfirmDeleteFolder };
};

export default useDeleteFolder;

// helper
const handleDeleteFolderGeneralAccessData = async (folderId: string) => {
  const generalAccessDataRef = doc(db, "generalAccess", folderId);
  await deleteDoc(generalAccessDataRef);
};

const handleDeleteFolderById = async (folderId: string) => {
  const folderRef = doc(db, "folders", folderId);
  await deleteDoc(folderRef);
};

const handleDeleteAllCollaborators = async (collaboratorsSnapshot: QuerySnapshot<DocumentData, DocumentData>): Promise<void> => {
  const collaboratorDeletionPromises = collaboratorsSnapshot.docs.map(async (collaboratorDoc) => {
    await deleteDoc(collaboratorDoc.ref);
  });
  await Promise.all(collaboratorDeletionPromises);
};

const handleGetAllFolderCollaborators = async (folderId: string): Promise<QuerySnapshot<DocumentData, DocumentData>> => {
  const collaboratorsCollection = collection(db, "collaborators");
  const collaboratorsQuery = query(collaboratorsCollection, where("folderId", "==", folderId));
  const collaboratorsSnapshot = await getDocs(collaboratorsQuery);
  return collaboratorsSnapshot;
};

const handleDeleteAllFiles = async (subFileSnapshot: QuerySnapshot<DocumentData, DocumentData>) => {
  const fileDeletionPromises = subFileSnapshot.docs.map(async (subFileDoc) => {
    const fileData = subFileDoc.data() as SubFileGetData;
    const fileRef = ref(storage, `user-files/${fileData.file_id}/${fileData.file_name}`);

    // Delete file from storage and its metadata from Firestore
    await deleteObject(fileRef);
    await deleteDoc(subFileDoc.ref);
  });

  await Promise.all(fileDeletionPromises);
};

const handleGetFilesByParentFolderId = async (folderId: string): Promise<QuerySnapshot<DocumentData, DocumentData>> => {
  const subFileQuery = query(collection(db, "files"), where("parent_folder_id", "==", folderId));
  const subFileSnapshot = await getDocs(subFileQuery);
  return subFileSnapshot;
};

const handleGetSubFoldersById = async (folderId: string): Promise<QuerySnapshot<DocumentData, DocumentData>> => {
  const subFolderQuery = query(collection(db, "folders"), where("parent_folder_id", "==", folderId));
  const subFoldersSnapshot = await getDocs(subFolderQuery);
  return subFoldersSnapshot;
};
