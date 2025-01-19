import { RootFolderGetData, SubFolderGetData } from "./folder";

export type ActionSelected = "rename" | "delete" | "details" | "activity" | "move" | "copy-link" | "starred" | null;

interface FolderOptionsState {
  actionSelected: ActionSelected;
  selectedFolderData: RootFolderGetData | SubFolderGetData | null;
}
