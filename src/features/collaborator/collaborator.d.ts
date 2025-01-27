import { FieldValue } from "firebase/firestore";
import { UserDataDb } from "../auth/auth";
import { RootFolderGetData, SubFolderGetData } from "../folder/folder";

export type CollaboratorRole = "viewer" | "editor" | "owner" | "assigner";
type GeneralAccess = "public" | "private";
export type GeneralAccessRole = "viewer" | "editor";

interface CollaboratorsTimeStamp {
  seconds: number;
  nanoseconds: number;
}

interface Collaborator {
  folderId: string;
  userId: string;
  role: CollaboratorRole;
  createAt: FieldValue | CollaboratorsTimeStamp;
  updateAt: null;
}

interface CollaboratorUserData {
  userId: string;
  role: CollaboratorRole;
  name: string;
  email: string;
  photoUrl: string | null;
}

interface GeneralAccessData {
  folderId: string;
  type: GeneralAccess;
  role: GeneralAccessRole;
  createAt: FieldValue | CollaboratorsTimeStamp;
  updateAt: null;
}

type CollaboratorsStatus = "loading" | "success" | "error" | "idle";

interface ParentFolderCollaboratorsDataState {
  generalAccess: GeneralAccessData | null;
  collaborators: CollaboratorUserData[];
  generalAccessStatus: CollaboratorsStatus;
  collaboratorsStatus: CollaboratorsStatus;
}

interface SecurredFolderData {
  folderId: string;
  isSecuredFolderActive: boolean;
  createdAt: TimestampValue | FieldValue;
  updatedAt: TimestampValue | FieldValue | null;
}

type SecuredFolderStatus = "idle" | "loading" | "succeded" | "failed";

interface ModalAddSelectedCollaboratorsState {
  collaboratorsData: UserDataDb[] | null;
  message: string;
}

interface ModalManageAccessContentState {
  isModalManageAccessOpen: boolean;
  contentWillRender: ContentWillRender;
  folderData: RootFolderGetData | SubFolderGetData | null;
  generalData: GeneralAccessData | null;
  collaboratorsUserData: CollaboratorUserData[] | null;
  isSecuredFolderActive: boolean;
}

type ContentWillRender = "manage-access" | "add-persons";
