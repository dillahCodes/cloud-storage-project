import { FieldValue } from "firebase/firestore";
import { UserDataDb } from "../auth/auth";

type FolderActivityType = "create-folder-activity" | "rename-folder-activity" | "delete-folder-activity";
type FolderActivityDataType = CreateFolderActivity | RenameFolderActivity;

interface TimestampValue {
  seconds: number;
  nanoseconds: number;
}

interface BaseFolderActivity {
  type: FolderActivityType;
  activityId: string;
  folderId: string;
  folderName: string;
  parentFolderId: string | null; // if null it is root folder
  parentFolderName: string | null; // if null it is root folder
  rootFolderId: string;
  rootFolderOwnerUserId: string;
  activityDate: FieldValue | TimestampValue;
  activityByUserId: string;
}

type CreateFolderActivity = Omit<BaseFolderActivity, "type"> & { type: "create-folder-activity"; fileName?: string; fileType?: string };

type CreateFolderActivityWithUserData = {
  activity: CreateFolderActivity;
  user: UserDataDb | null;
};

interface RenameFolderActivity extends Omit<BaseFolderActivity, "type"> {
  type: "rename-folder-activity";
  renamedFolderId: string;
  renamedFolderName: string;
}

type RenameFolderActivityWithUserData = {
  activity: RenameFolderActivity;
  user: UserDataDb | null;
};

interface DeleteFolderActivity extends Omit<BaseFolderActivity, "type" | "parentFolderName"> {
  type: "delete-folder-activity";
  fileName?: string;
  fileType?: string;
}

type DeleteFolderActivityWithUserData = {
  activity: DeleteFolderActivity;
  user: UserDataDb | null;
};

interface ActivityAndUserData {
  activity: BaseFolderActivity;
  user: UserDataDb | null;
}

interface ActivityGrouping {
  groupId: string;
  groupByDate: string;
  groupTimeStamp: TimestampValue;
  groupType: FolderActivityType;
  activities: ActivityAndUserData[];
}

interface FodlerActivityState {
  activity: ActivityGrouping[];
  status: "idle" | "loading" | "error" | "succeeded";
  errorMessage: string | null;
}
