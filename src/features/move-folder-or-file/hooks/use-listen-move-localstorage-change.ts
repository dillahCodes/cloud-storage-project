import { useEffect } from "react";

const useListenMoveLocalStorageChange = () => {
  // Listen to localStorage changes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // if (event.storageArea === localStorage && event.key === LOCAL_STORAGE_MOVE_FOLDER_OR_FILE_KEY) {
      // }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
};

export default useListenMoveLocalStorageChange;
