import { FieldValue } from "firebase/firestore";

export type CollaboratorRole = "viewer" | "editor" | "owner" | "assigner";
type GeneralAccess = "public" | "private";
export type GeneralAccessRole = "viewer" | "editor";

interface Collaborator {
  folderId: string;
  userId: string;
  role: CollaboratorRole;
  createAt: FieldValue;
  updateAt: null;
}

interface CollaboratorUserData {
  userId: string;
  role: CollaboratorRole;
  name: string;
  email: string;
  photoUrl: string | null;
}

interface CollaboratorSerialized extends Omit<Collaborator, "createAt" | "updateAt"> {
  createAt: null | CollaboratorsTimeStamp;
  updateAt: null | CollaboratorsTimeStamp;
}

interface CollaboratorsTimeStamp {
  seconds: number;
  nanoseconds: number;
}

interface GeneralAccessData {
  folderId: string;
  type: GeneralAccess;
  role: GeneralAccessRole;
  createAt: FieldValue;
  updateAt: null;
}

interface GeneralAccessDataSerialized extends Omit<GeneralAccessData, "createAt" | "updateAt"> {
  createAt: CollaboratorsTimeStamp;
  updateAt: null | CollaboratorsTimeStamp;
}
