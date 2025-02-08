import useIsValidParams from "@/features/folder/hooks/use-isvalid-params";
import { parentFolderSelector } from "@/features/folder/slice/parent-folder-slice";
import { auth, db } from "@/firebase/firebase-services";
import { collection, onSnapshot, orderBy, Query, query, where } from "firebase/firestore";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useFilesSetState from "./use-files-setstate";
import { RootFileGetData, SubFileGetData } from "../file";

interface UseGetFilesProps {
  isRoot: boolean;
  shouldFetchInMount: boolean;
}

const useGetFiles = ({ isRoot, shouldFetchInMount }: UseGetFilesProps) => {
  const { folderId: parent_folder_id } = useParams<{ folderId: string }>();

  const parentFolderState = useSelector(parentFolderSelector);

  const { isValidParentFolder } = parentFolderState;
  const { isValidSearchParams } = useIsValidParams();

  const { setFilesState, setFilesStatusState, resetFilesState } = useFilesSetState();

  /**
   * Constructs a Firestore query based on the current folder context.
   *
   * @returns {Query} - A Firestore query to fetch files from the root or subfolder.
   */
  const buildQuery = useCallback((): Query => {
    const { currentUser } = auth;
    const filesRef = collection(db, "files");

    if (!isRoot && parent_folder_id) {
      return query(filesRef, where("parent_folder_id", "==", parent_folder_id), orderBy("created_at", "desc"));
    }

    return query(
      filesRef,
      where("parent_folder_id", "==", null),
      where("owner_user_id", "==", currentUser?.uid),
      orderBy("created_at", "desc")
    );
  }, [isRoot, parent_folder_id]);

  /**
   * Filters file data to ensure consistency between root and subfolder files.
   *
   * @param {RootFileGetData | SubFileGetData} file - File data to filter.
   * @returns {RootFileGetData | SubFileGetData} - Filtered file data.
   */
  const handleFilteredDataFile = (file: RootFileGetData | SubFileGetData): RootFileGetData | SubFileGetData => {
    if (file.parent_folder_id) {
      return {
        ...file,
        updated_at: JSON.parse(JSON.stringify(file.updated_at)),
        created_at: JSON.parse(JSON.stringify(file.created_at)),
      } as SubFileGetData;
    }

    return {
      ...file,
      parent_folder_id: null,
      updated_at: JSON.parse(JSON.stringify(file.updated_at)),
      created_at: JSON.parse(JSON.stringify(file.created_at)),
    } as RootFileGetData;
  };

  /**
   * Subscribes to Firestore updates based on the query and dispatches results to the Redux store.
   *
   * @param {Query} q - The Firestore query to subscribe to.
   * @returns {() => void} - Function to unsubscribe from Firestore updates.
   */
  const subscribeToFile = useCallback(
    (q: Query) => {
      return onSnapshot(
        q,
        (snapshot) => {
          const fetchedFiles = snapshot.docs.map((doc) => handleFilteredDataFile(doc.data() as RootFileGetData | SubFileGetData));

          setFilesState(fetchedFiles as RootFileGetData[] | SubFileGetData[]);
          setFilesStatusState("succeeded");
        },
        (error) => {
          setFilesStatusState("failed");
          console.error("Error fetching files:", error.message);
        }
      );
    },
    [setFilesState, setFilesStatusState]
  );

  // Effect to handle fetching files from the root folder
  useEffect(() => {
    if (isRoot && shouldFetchInMount) {
      setFilesStatusState("loading");

      const q = buildQuery();
      const unsubscribe = subscribeToFile(q);
      return () => unsubscribe();
    }
  }, [buildQuery, isRoot, subscribeToFile, shouldFetchInMount, setFilesStatusState]);

  // Effect to check parameters and subscribe to subfolder file updates
  useEffect(() => {
    const checkAndSubscribeToFile = () => {
      if (!isRoot && parent_folder_id && shouldFetchInMount) {
        const isValidParamsAndParentFolder = isValidParentFolder && isValidSearchParams;
        const isNotValidParamsAndValidParentFolder = isValidParentFolder && !isValidSearchParams;

        if (isValidParamsAndParentFolder) {
          setFilesStatusState("succeeded");

          const q = buildQuery();
          const unsubscribe = subscribeToFile(q);
          return () => unsubscribe();
        } else if (isNotValidParamsAndValidParentFolder) {
          resetFilesState();
          setFilesStatusState("failed");
        }
      }
    };

    if (isValidParentFolder !== null) checkAndSubscribeToFile();
  }, [
    buildQuery,
    isRoot,
    isValidParentFolder,
    isValidSearchParams,
    parent_folder_id,
    resetFilesState,
    shouldFetchInMount,
    subscribeToFile,
    setFilesStatusState,
  ]);
};

export default useGetFiles;
