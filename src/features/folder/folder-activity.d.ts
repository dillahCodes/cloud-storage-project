import { FieldValue } from "firebase/firestore";

type FolderActivityType = "create-folder-activity" | "rename-folder-activity" | "delete-folder-activity";

interface TimestampValue {
  seconds: number;
  nanoseconds: number;
}

interface BaseFolderActivity {
  type: FolderActivityType;
  activityId: string;
  folderId: string;
  folderName: string;
  parentFolderId: string | null;
  parentFolderName: string | null;
  rootFolderId: string | null;
}

interface CreateFolderActivity extends BaseFolderActivity {
  createdByUserId: string;
  createdAt: FieldValue | TimestampValue;
}
