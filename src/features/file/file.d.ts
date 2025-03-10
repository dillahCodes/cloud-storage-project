import { FieldValue } from "firebase/firestore/lite";

interface FileInUploadProgress {
  progress: number;
  message: string;
}

type Timestamp = FieldValue | { seconds: number; nanoseconds: number };
interface FileResponseStatus {
  status: "loading" | "succeeded" | "failed" | "idle";
  message: string;
  type: "success" | "info" | "warning" | "error" | null;
  progresUpload?: FileInUploadProgress;
}

interface FileState {
  status: "idle" | "loading" | "succeeded" | "failed";
  files: RootFileGetData[] | SubFileGetData[];
}

interface RootFileCreateData {
  file_id: string;
  owner_user_id: FirebaseUserData["uid"];
  root_folder_user_id: string;
  root_folder_id: string | null;
  parent_folder_id: null;
  file_name: string;
  file_size: string;
  file_type: string;

  created_at: FieldValue;
  updated_at: null;
}

interface RootFileGetData {
  file_id: string;
  owner_user_id: FirebaseUserData["uid"];
  root_folder_user_id: string;
  root_folder_id: string | null;
  parent_folder_id: null;
  file_name: string;
  file_size: string;
  file_type: string;

  updated_at: null | {
    seconds: number;
    nanoseconds: number;
  };
  created_at: {
    seconds: number;
    nanoseconds: number;
  };
}

interface SubFileCreateData extends Omit<RootFileCreateData, "parent_folder_id"> {
  parent_folder_id: string;
}

interface SubFileGetData extends Omit<RootFileGetData, "parent_folder_id"> {
  parent_folder_id: string;
}

interface FileUploadingList {
  fileId: string;
  fileName: string;
  progress: number;
  status: "uploading" | "succeeded" | "failed" | "canceled";
}
interface FileUploadingState {
  fileUploadingList: FileUploadingList[];
}

type FileActionSelected = "delete" | "details" | "move" | "dowload" | "visit" | null;
interface FileOptionsState {
  activeFileData: RootFileGetData | SubFileGetData | null;
  activeAction: FileActionSelected;
}

interface RecentFile {
  fileId: string;
  userId: string;
  createAt: Timestamp;
  updateAt: null | Timestamp;
}
