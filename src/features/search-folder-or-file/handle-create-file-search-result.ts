import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { FileSearchResult } from "./search";

const handleCreateFileSearchResult = (data: QueryDocumentSnapshot<DocumentData, DocumentData>) =>
  ({
    resultType: "file",
    ...JSON.parse(JSON.stringify(data.data())),
  } as FileSearchResult);

export default handleCreateFileSearchResult;
