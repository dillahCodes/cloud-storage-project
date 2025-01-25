import { FirebaseUserData } from "@/features/auth/auth";
import useUser from "@/features/auth/hooks/use-user";
import { auth, db } from "@/firebase/firebase-services";
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { RootFolderCreateData, SecurredFolderData, SubFolderCreateData, SubFolderGetData } from "../folder";
import { Collaborator, CollaboratorRole, GeneralAccessData } from "../folder-collaborator";
import useAddActivityCreatedFolder from "./use-add-activity-created-folder";
import { message } from "antd";
import abbreviateText from "@/util/abbreviate-text";

export interface HandleConfirmAddFolder {
  parentFolderData: SubFolderGetData | null;
  afterAddFolder: () => void;
}

interface HandleValidateAddFolderParams {
  folderName: string;
  user: FirebaseUserData | null;
}

interface HandleCreateSecuredFolderData {
  folderId: string;
  userId: string;
}

const handleValitdateAddFolder = ({ folderName, user }: HandleValidateAddFolderParams) => {
  const isValidFolderName: boolean = folderName.trim() !== "";
  const isUserNotExist: boolean = user === null;

  // validation
  const validations = [
    { condition: !isValidFolderName, message: "Folder name is required." },
    { condition: isUserNotExist, message: "You need to login to create a folder." },
  ];

  // find first failed validation
  const failedValidation = validations.find((validation) => validation.condition);

  // set folder status
  if (failedValidation) {
    message.open({
      type: "error",
      content: failedValidation.message,
      className: "text-sm font-archivo",
    });
    return false;
  }

  return true;
};

/**
 * Save general access data to Firestore.
 * @param {GeneralAccessData} generalAccessData The general access data to save.
 * @returns {Promise<void>}
 */
const saveGeneraAccessDataToFirestore = async (generalAccessData: GeneralAccessData) => {
  const generalAccessDoc = doc(db, "generalAccess", generalAccessData.folderId);
  await setDoc(generalAccessDoc, generalAccessData);
};

const createGeneralAccessData = (folderId: string): GeneralAccessData => {
  const generalAccessData: GeneralAccessData = {
    folderId,
    type: "private",
    createAt: serverTimestamp(),
    role: "viewer",
    updateAt: null,
  };

  return generalAccessData;
};

/**
 * Saves an array of collaborators to Firestore database.
 *
 * @param {Collaborator[] | null} collaboratorData - The array of collaborator data to be saved.
 * @returns {Promise<void>} A promise that resolves after all collaborators are saved to Firestore.
 */
const saveCollaboratorsToFirestore = async (collaboratorData: Collaborator[] | null) => {
  if (!collaboratorData) return;

  const promises = collaboratorData.map(async (collaborator: Collaborator) => {
    const collaboratorDoc = doc(db, "collaborators", `${collaborator.folderId}_${collaborator.userId}`);
    await setDoc(collaboratorDoc, collaborator);
  });

  await Promise.all(promises);
};

/**
 * Saves a folder to Firestore database.
 *
 * @param {RootFolderCreateData | SubFolderCreateData} folderData - The folder data to be saved.
 * @returns {Promise<void>} A promise that resolves after the folder is saved to Firestore.
 */
const saveFolderToFirestore = async (folderData: RootFolderCreateData | SubFolderCreateData) => {
  const folderDoc = doc(db, "folders", folderData.folder_id);
  await setDoc(folderDoc, folderData);
};

/**
 * Constructs a query to fetch collaborators of a specified parent folder.
 *
 * @param {SubFolderGetData | null} parentFolderData - The data of the parent folder whose collaborators are to be retrieved.
 * @returns {Query} A query object that can be used with Firestore's getDocs() function to fetch the collaborators.
 */
const buildCollaboratorsQuery = (parentFolderData: SubFolderGetData | null) => {
  const collaboratorsCollection = collection(db, "collaborators");
  const collaboratorsQuery = query(collaboratorsCollection, where("folderId", "==", parentFolderData?.folder_id));
  return collaboratorsQuery;
};

/**
 * Fetches the collaborators of a specified parent folder by constructing and executing a query.
 *
 * @param {SubFolderGetData | null} parentFolderData - The data of the parent folder whose collaborators are to be retrieved.
 * @returns {Promise<Collaborator[]>} A promise that resolves to an array of collaborator data.
 */

const handleGetParentCollaboratorsData = async (parentFolderData: SubFolderGetData | null) => {
  const collaboratorsQuery = buildCollaboratorsQuery(parentFolderData);
  const collaboratorsSnapshot = await getDocs(collaboratorsQuery);
  return collaboratorsSnapshot.docs.map((doc) => doc.data()) as Collaborator[];
};

/**
 * Modifies the roles of collaborators to "editor" and includes them in the new folder's collaborators list.
 *
 * @param {Collaborator[]} [collaborators=[]] - The list of collaborators to be modified.
 * @param {string} [folderId=""] - The ID of the new folder.
 * @returns {Collaborator[] | undefined} An array of updated collaborators, or undefined if there is no folderId.
 */
const changeRoleToEditor = (collaborators?: Collaborator[], folderId?: string): Collaborator[] | undefined => {
  if (!collaborators || !folderId) return undefined;

  return collaborators.map((collaborator) => ({
    ...collaborator,
    role: "editor",
    folderId,
  }));
};

/**
 * Creates an array of collaborators for a new folder, including the current user as the owner.
 *
 * This function modifies the roles of parent collaborators to "editor" and includes them
 * in the new folder's collaborators list, while adding the current user as the "owner" of the folder.
 *
 * @param {string} folderId - The ID of the new folder.
 * @param {Collaborator[]} [parentCollaboratorsData=[]] - The list of collaborators from the parent folder.
 * @returns {Collaborator[] | null} An array of updated collaborators for the new folder, or null if there is no current user.
 */

const createCollaboratorsData = (folderId: string, parentCollaboratorsData: Collaborator[] = []) => {
  const { currentUser } = auth;
  if (!currentUser) return null;

  const updatedParentCollaborators = changeRoleToEditor(parentCollaboratorsData, folderId);

  const collaborators: Collaborator[] = [
    ...(updatedParentCollaborators || []),
    {
      role: "owner" as CollaboratorRole,
      folderId,
      userId: currentUser.uid,
      createAt: serverTimestamp(),
      updateAt: null,
    },
  ];

  return collaborators;
};

/**
 * Creates a new folder data object with the given name and parent folder data.
 *
 * @param {SubFolderGetData | null} parentFolderData - The parent folder data of the new folder.
 * @param {string} folderName - The name of the new folder.
 * @returns {SubFolderCreateData | RootFolderCreateData | null} A new folder data object, or null if the user is not authenticated.
 */
const createFolderData = (parentFolderData: SubFolderGetData | null, folderName: string): SubFolderCreateData | RootFolderCreateData | null => {
  const { currentUser } = auth;
  if (!currentUser) return null;

  const id = uuidv4();
  const commonData = {
    folder_id: id,
    owner_user_id: currentUser.uid,
    folder_name: folderName.trim(),
    created_at: serverTimestamp(),
    updated_at: null,
  };

  // if it is sub folder
  if (parentFolderData) {
    return {
      ...commonData,
      root_folder_id: parentFolderData.root_folder_id,
      parent_folder_id: parentFolderData.folder_id,
      root_folder_user_id: parentFolderData.root_folder_user_id,
    } as SubFolderCreateData;
  }

  // if it is root folder
  return {
    ...commonData,
    root_folder_id: id,
    parent_folder_id: null,
    root_folder_user_id: currentUser.uid,
  } as RootFolderCreateData;
};

const handleCreateSecuredFolderData = async (params: HandleCreateSecuredFolderData) => {
  const { folderId, userId } = params;
  const payload: SecurredFolderData = {
    folderId,
    userId,
    isSecuredFolderActive: false,
    createdAt: serverTimestamp(),
    updatedAt: null,
  };

  const securedFolderRef = doc(db, "secured-folder", `${userId}_${folderId}`);
  await setDoc(securedFolderRef, payload);
};

const useAddFolder = () => {
  /**
   * hooks
   */
  const { handleAddActivityCreatedFolder } = useAddActivityCreatedFolder();
  const { user } = useUser();
  /**
   * state
   */
  const [folderName, setFolderName] = useState<string>("");

  const handleSetFolderName = (e: React.ChangeEvent<HTMLInputElement>) => setFolderName(e.target.value);
  const handleConfirmAddFolder = async ({ parentFolderData, afterAddFolder }: HandleConfirmAddFolder) => {
    const validations = handleValitdateAddFolder({ folderName, user });
    if (!validations) return;

    afterAddFolder();

    const folderData = createFolderData(parentFolderData, folderName);
    if (!folderData) return;

    try {
      const loadingKey = `add-folder-${folderData.folder_id}`;
      message.open({
        type: "loading",
        content: `Adding ${abbreviateText(folderName, 15)} folder...`,
        className: "text-sm font-archivo",
        key: loadingKey,
        duration: 0,
      });

      // Fetch parent collaborators if parentFolderData exists
      const parentCollaboratorsData = parentFolderData ? await handleGetParentCollaboratorsData(parentFolderData) : undefined;

      const collaboratorsData = createCollaboratorsData(folderData.folder_id, parentCollaboratorsData);
      const general = createGeneralAccessData(folderData.folder_id);

      // Use Promise.all for parallel execution of async tasks
      await Promise.all([
        saveFolderToFirestore(folderData),
        saveGeneraAccessDataToFirestore(general),
        saveCollaboratorsToFirestore(collaboratorsData),
        handleCreateSecuredFolderData({ folderId: folderData.folder_id, userId: user!.uid }),
        handleAddActivityCreatedFolder({
          type: "create-folder-activity",
          activityId: uuidv4(),

          folderId: folderData.folder_id,
          folderName: folderData.folder_name,

          rootFolderId: folderData.root_folder_id,
          rootFolderOwnerUserId: folderData.root_folder_user_id,

          parentFolderId: folderData.parent_folder_id ?? null,
          parentFolderName: parentFolderData?.folder_name ?? null,

          activityByUserId: user!.uid,
          activityDate: serverTimestamp(),
        }),
      ]);

      // Reset folder name state and show success message
      setFolderName("");
      message.destroy(loadingKey);
      message.open({
        type: "success",
        content: `Folder ${abbreviateText(folderName, 15)} successfully added.`,
        className: "text-sm font-archivo",
        key: `folder-added-success-${folderData.folder_id}`,
      });
    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("Error adding folder:", errorMessage);
    }
  };

  return {
    folderName,
    handleSetFolderName,
    handleConfirmAddFolder,
  };
};

export default useAddFolder;
