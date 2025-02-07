import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";
import { FolderResultSearch } from "./search";

const handleCreateFolderSearchResult = (data: QueryDocumentSnapshot<DocumentData, DocumentData> | DocumentSnapshot<DocumentData, DocumentData>) =>
  ({
    resultType: "folder",
    ...JSON.parse(JSON.stringify(data.data())),
  } as FolderResultSearch);

export default handleCreateFolderSearchResult;
