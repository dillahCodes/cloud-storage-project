import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { NotificationResultSearch } from "./search";

const handleCreateNotificationSearchResult = (data: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
  return {
    resultType: "notification",
    ...JSON.parse(JSON.stringify(data.data())),
  } as NotificationResultSearch;
};

export default handleCreateNotificationSearchResult;
