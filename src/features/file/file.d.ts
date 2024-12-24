interface FileInUploadProgress {
  progress: number;
  message: string;
}

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
  parent_folder_id: null;
  file_name: string;
  file_size: string;
  file_type: string;
  is_password: false;
  created_at: FieldValue;
  updated_at: null;
}

interface RootFileGetData {
  file_id: string;
  owner_user_id: FirebaseUserData["uid"];
  root_folder_user_id: string;
  parent_folder_id: null;
  file_name: string;
  file_size: string;
  file_type: string;
  is_password: false;
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
