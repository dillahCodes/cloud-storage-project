import { SubFolderGetData } from "@/features/folder/folder";
import { db } from "@/firebase/firebase-services";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface UseSubFolderAutoGetBreadcrumsProps {
  currentFolderId: string | undefined;
  shouldFetch: boolean;
}

const useSubFolderAutoGetBreadcrums = ({ currentFolderId, shouldFetch }: UseSubFolderAutoGetBreadcrumsProps) => {
  const { "0": urlSearchParams } = useSearchParams();
  const [params] = useState(urlSearchParams.get("st"));

  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  const [fetchStatus, setFetchStatus] = useState<BreadcrumbItemFetchStatus>("idle");

  // Helper function to fetch a folder by its ID
  const handleGetFolderById = useCallback(async (folderId: string) => {
    const folderDocRef = doc(db, "folders", folderId);
    const folderSnapshot = await getDoc(folderDocRef);
    return folderSnapshot.exists() ? (folderSnapshot.data() as SubFolderGetData) : null;
  }, []);

  // Recursive function to fetch breadcrumb data
  const handleFetchFolderByIdRecursively = useCallback(
    async (folderId: string, accumulatedBreadcrumbs: BreadcrumbItem[] = []) => {
      const folder = await handleGetFolderById(folderId);

      if (folder) {
        const currentBreadcrumb: BreadcrumbItem = {
          icon: "folder",
          label: folder.folder_name,
          path: `/storage/folders/${folder.folder_id}?st=${params}`,
          key: folder.folder_id,
        };
        accumulatedBreadcrumbs.unshift(currentBreadcrumb);

        if (folder.parent_folder_id) {
          return handleFetchFolderByIdRecursively(folder.parent_folder_id, accumulatedBreadcrumbs);
        }
      }

      return accumulatedBreadcrumbs;
    },
    [handleGetFolderById, params]
  );

  const fetchBreadcrumbs = useCallback(async () => {
    try {
      setFetchStatus("loading");

      const breadcrumbs = await handleFetchFolderByIdRecursively(currentFolderId as string);
      setBreadcrumbItems(breadcrumbs);

      setFetchStatus("succeeded");
    } catch (error) {
      setFetchStatus("failed");

      console.error("Error fetching breadcrumbs:", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }, [currentFolderId, handleFetchFolderByIdRecursively]);

  useEffect(() => {
    if (!shouldFetch || !currentFolderId) return;
    fetchBreadcrumbs();
  }, [shouldFetch, fetchBreadcrumbs, currentFolderId]);

  return {
    breadcrumbItems,
    fetchStatus,
  };
};

export default useSubFolderAutoGetBreadcrums;
