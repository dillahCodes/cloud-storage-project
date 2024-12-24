import { RootFolderGetData, SubFolderGetData } from "./folder";

interface CurrentFoldersState {
  folders: RootFolderGetData[] | SubFolderGetData[];
  status: "idle" | "loading" | "succeded" | "failed";
}
