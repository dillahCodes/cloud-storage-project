import { FieldValue } from "firebase/firestore";
import { FirebaseUserData } from "../auth/auth";

interface FolderResponseStatus {
  status: "loading" | "succeeded" | "failed" | "idle";
  message: string;
  type: "success" | "info" | "warning" | "error" | null;
}

interface FolderState {
  status: "idle" | "loading" | "succeeded" | "failed";
  folders: RootFolderGetData[] | SubFolderGetData[];
}

export interface ParentFolderData {
  isValidParentFolder: boolean;
  parentFolderData: SubFolderGetData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

interface RootFolderCreateData {
  folder_id: string;
  owner_user_id: FirebaseUserData["uid"];
  root_folder_user_id: string;
  root_folder_id: string;
  folder_name: string;
  parent_folder_id: null;
  created_at: FieldValue;
  updated_at: null;
}

interface RootFolderGetData {
  created_at: {
    seconds: number;
    nanoseconds: number;
  };
  folder_id: string;
  root_folder_user_id: string;
  root_folder_id: string;
  folder_name: string;
  owner_user_id: string;
  parent_folder_id: null;
  updated_by: FirebaseUserData["uid"] | null;
  updated_at: null | {
    seconds: number;
    nanoseconds: number;
  };
}

interface SubFolderCreateData {
  folder_id: string;
  owner_user_id: FirebaseUserData["uid"];
  folder_name: string;
  parent_folder_id: string;
  root_folder_user_id: string;
  root_folder_id: string;
  created_at: FieldValue;
  updated_at: null;
}

interface SubFolderGetData {
  created_at: {
    seconds: number;
    nanoseconds: number;
  };
  folder_id: string;
  folder_name: string;
  owner_user_id: string;
  root_folder_user_id: string;
  root_folder_id: string;
  parent_folder_id: string;
  updated_by: FirebaseUserData["uid"] | null;
  updated_at: null | {
    seconds: number;
    nanoseconds: number;
  };
}

interface SharedWithMeData {
  folderId: string;
  rootFolderId: string;
  userId: string;
  createdAt: FieldValue;
  updatedAt: null;
}

interface SharedWithMeTimeStamp {
  seconds: number;
  nanoseconds: number;
}

type SharedWithMeFetchStatus = "idle" | "loading" | "succeded" | "failed";

interface SharedWithMeDataSerialized extends Omit<SharedWithMeData, "createdAt" | "updatedAt"> {
  createdAt: SharedWithMeTimeStamp;
  updatedAt: null | SharedWithMeTimeStamp;
}

interface StarredFolderData {
  folderId: string;
  userId: string;
  createdAt: FieldValue;
  updatedAt: null;
}

interface StarredFolderTimeStamp {
  seconds: number;
  nanoseconds: number;
}

interface StarredFolderDataSerialized extends Omit<StarredFolderData, "createdAt" | "updatedAt"> {
  createdAt: StarredFolderTimeStamp;
  updatedAt: null | StarredFolderTimeStamp;
}
