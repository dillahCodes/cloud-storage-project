import { auth, db } from "@/firebase/firebase-services";
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FolderResponseStatus, RootFolderCreateData, SubFolderCreateData, SubFolderGetData } from "../folder";
import { Collaborator, CollaboratorRole, GeneralAccessData } from "../folder-collaborator";
import useAddActivityCreatedFolder from "./use-add-activity-created-folder";

export interface HandleConfirmAddFolder {
  parentFolderData: SubFolderGetData | null;
  afterAddFolder: () => void;
}

const useAddFolder = () => {
  const { handleAddActivityCreatedFolder } = useAddActivityCreatedFolder();

  const [folderName, setFolderName] = useState<string>("");
  const [addFolderStatus, setAddFolderStatus] = useState<FolderResponseStatus>({
    message: "",
    status: "idle",
    type: null,
  });

  const handleSetFolderName = (e: React.ChangeEvent<HTMLInputElement>) => setFolderName(e.target.value);

  const handleConfirmAddFolder = async ({ parentFolderData, afterAddFolder }: HandleConfirmAddFolder) => {
    const { currentUser } = auth;

    if (!folderName.trim() || !currentUser) return;

    afterAddFolder();
    setAddFolderStatus({ status: "loading", message: "Adding Folder...", type: "info" });

    const folderData = createFolderData(parentFolderData, folderName);
    if (!folderData) return;

    try {
      const parentCollaboratorsData = parentFolderData ? await handleGetParentCollaboratorsData(parentFolderData) : undefined;
      const collaboratorsData = createCollaboratorsData(folderData.folder_id, parentCollaboratorsData);
      const general = createGeneralAccessData(folderData.folder_id);

      await saveFolderToFirestore(folderData);
      await saveGeneraAccessDataToFirestore(general);
      await saveCollaboratorsToFirestore(collaboratorsData);

      await handleAddActivityCreatedFolder({
        type: "create-folder-activity",
        activityId: uuidv4(),

        folderId: folderData.folder_id,
        folderName: folderData.folder_name,

        rootFolderId: folderData.root_folder_id,
        rootFolderOwnerUserId: folderData.root_folder_user_id,

        parentFolderId: folderData.parent_folder_id ?? null,
        parentFolderName: parentFolderData?.folder_name ?? null,

        activityByUserId: currentUser.uid,
        activityDate: serverTimestamp(),
      });

      setAddFolderStatus({ status: "succeeded", message: "Folder added successfully", type: "success" });
      setFolderName("");
    } catch (error) {
      console.error("Error adding folder:", error instanceof Error ? error.message : "An unknown error occurred.");
      setAddFolderStatus({ status: "failed", message: "Failed to add folder", type: "error" });
    }
  };

  return {
    folderName,
    addFolderStatus,
    handleSetFolderName,
    handleConfirmAddFolder,
  };
};

export default useAddFolder;

// helper
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

const saveCollaboratorsToFirestore = async (collaboratorData: Collaborator[] | null) => {
  if (!collaboratorData) return;

  const promises = collaboratorData.map(async (collaborator: Collaborator) => {
    const collaboratorDoc = doc(db, "collaborators", `${collaborator.folderId}_${collaborator.userId}`);
    await setDoc(collaboratorDoc, collaborator);
  });

  await Promise.all(promises);
};

const saveFolderToFirestore = async (folderData: RootFolderCreateData | SubFolderCreateData) => {
  const folderDoc = doc(db, "folders", folderData.folder_id);
  await setDoc(folderDoc, folderData);
};

const buildCollaboratorsQuery = (parentFolderData: SubFolderGetData | null) => {
  const collaboratorsCollection = collection(db, "collaborators");
  const collaboratorsQuery = query(collaboratorsCollection, where("folderId", "==", parentFolderData?.folder_id));
  return collaboratorsQuery;
};

const handleGetParentCollaboratorsData = async (parentFolderData: SubFolderGetData | null) => {
  const collaboratorsQuery = buildCollaboratorsQuery(parentFolderData);
  const collaboratorsSnapshot = await getDocs(collaboratorsQuery);
  return collaboratorsSnapshot.docs.map((doc) => doc.data()) as Collaborator[];
};

const changeRoleToEditor = (collaborators?: Collaborator[], folderId?: string): Collaborator[] | undefined => {
  if (!collaborators || !folderId) return undefined;

  return collaborators.map((collaborator) => ({
    ...collaborator,
    role: "editor",
    folderId,
  }));
};

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
