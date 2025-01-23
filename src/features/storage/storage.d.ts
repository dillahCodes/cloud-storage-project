interface StorageData {
  storageId: string;
  userId: string;
  storageCapacity: number;
  storageUsed: number;
}

type StorageStatus = "idle" | "loading" | "succeeded" | "failed";
interface StorageDataState {
  data: StorageData | null;
  status: StorageStatus;
}
