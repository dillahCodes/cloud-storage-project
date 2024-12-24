import useUser from "@/features/auth/hooks/use-user";
import { auth, db } from "@/firebase/firebase-serices";
import { collection, DocumentData, onSnapshot, orderBy, Query, query, QueryDocumentSnapshot, where } from "firebase/firestore";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RootFolderGetData, SubFolderGetData } from "../folder";
import useCurrentFolderSetState from "./use-current-folder-setstate";
import useIsValidParams from "./use-isvalid-params";
import useParentFolder from "./use-parent-folder";

interface HandleSubFolderValidationParams {
  isFromMyStorage: boolean;
  isFromSharedWithMe: boolean;
  isRoot: boolean;
}

interface HandleSubFolderValidationReturn {
  condition: boolean;
  message: string;
  nextAction: "home" | "not-found";
}

interface UseGetFolderProps {
  isRoot: boolean;
  shouldFetchInMount: boolean;
}

const useGetFolder = ({ isRoot, shouldFetchInMount }: UseGetFolderProps) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const { folderId: parent_folder_id } = useParams<{ folderId: string }>();
  const [searchParams] = useSearchParams();
  const { isValidSearchParams } = useIsValidParams();

  const { setStatus, setFolders } = useCurrentFolderSetState();

  const { parentFolderState } = useParentFolder({
    fetchParentFolderDataOnMount: false,
    resetParentFolderDataOnMount: false,
    folderId: parent_folder_id,
  });
  const { isValidParentFolder, parentFolderData } = parentFolderState;

  /**
   * serialize  - serialize timestamps data for redux toolkit
   **/
  const handleSerializeFoldersData = useCallback((data: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
    const folderDataSerialized = {
      ...data.data(),
      created_at: JSON.parse(JSON.stringify(data.data().created_at)),
      updated_at: data.data().updated_at ? JSON.parse(JSON.stringify(data.data().updated_at)) : null,
    } as RootFolderGetData | SubFolderGetData;

    return folderDataSerialized;
  }, []);

  /**
   * buildQuery  - Builds the query based on the parent_folder_id and isRoot
   **/
  const buildQuery = useCallback(() => {
    const { currentUser } = auth;
    const foldersRef = collection(db, "folders");

    /*
     * If parent_folder_id is not null, return the query for the parent folder
     */
    if (!isRoot && parent_folder_id) {
      return query(foldersRef, where("parent_folder_id", "==", parent_folder_id), orderBy("created_at", "desc"));
    }

    /*
     * If parent_folder_id is null, return the query for the root folder
     */
    return query(foldersRef, where("parent_folder_id", "==", null), where("owner_user_id", "==", currentUser?.uid), orderBy("created_at", "desc"));
  }, [parent_folder_id, isRoot]);

  /*
   * subscribeToFolders - subscribes to the query and updates the folders state this is make real time folders updates
   */
  const subscribeToFolders = useCallback(
    (q: Query, isRoot: boolean) => {
      return onSnapshot(
        q,
        (snapshot) => {
          const fetchedFolders = snapshot.docs.map((doc) => handleSerializeFoldersData(doc));
          isRoot ? setFolders(fetchedFolders as RootFolderGetData[]) : setFolders(fetchedFolders as SubFolderGetData[]);
          setStatus("succeded");
        },
        (error) => {
          setStatus("failed");
          console.error("Error fetching folders:", error);
        }
      );
    },
    [setFolders, setStatus, handleSerializeFoldersData]
  );

  /*
   * useEffect - Subscribes to the query and updates the folders state
   * This is make real time folders updates and fetch the root folder
   */
  useEffect(() => {
    if (!isRoot && !shouldFetchInMount) return;

    setStatus("loading");
    const q = buildQuery();
    const unsubscribe = subscribeToFolders(q, isRoot);
    return () => unsubscribe();
  }, [isRoot, shouldFetchInMount, buildQuery, subscribeToFolders, setStatus]);

  //

  const handleSubFolderValidation = useCallback(
    ({ isFromMyStorage, isFromSharedWithMe, isRoot }: HandleSubFolderValidationParams): HandleSubFolderValidationReturn[] => {
      return [
        {
          condition: isRoot,
          message: "Invalid should be sub Folder",
          nextAction: "home",
        },
        {
          condition: !isValidParentFolder,
          message: "Invalid Parent Folder",
          nextAction: "not-found",
        },
        {
          condition: !isValidSearchParams,
          message: "Invalid Search Params 1",
          nextAction: "home",
        },
        {
          condition: isFromMyStorage === false && isFromSharedWithMe === false,
          message: "Invalid Search Params 2",
          nextAction: "home",
        },
      ];
    },
    [isValidParentFolder, isValidSearchParams]
  );

  /*
   * useEffect - Subscribes to the query and updates the folder state
   * This enables real-time folder updates and fetches the parent folder
   */

  useEffect(() => {
    const checkAndSubscribeToFolders = () => {
      if (isRoot || !parent_folder_id || !shouldFetchInMount) return;

      const isMyRootFolder = parentFolderData?.root_folder_user_id === user?.uid;
      const isFromMyStorage = isValidSearchParams && searchParams.get("st") === "my-storage" && isMyRootFolder;
      const isFromSharedWithMe = isValidSearchParams && searchParams.get("st") === "shared-with-me" && !isMyRootFolder;

      // sub folder params and parent folder check
      const result = handleSubFolderValidation({
        isFromMyStorage,
        isFromSharedWithMe,
        isRoot,
      });
      const firstInvalidValidation = result.find((validation) => validation.condition);

      // handle action if validation is active
      firstInvalidValidation && firstInvalidValidation.nextAction === "home" && navigate("/storage/my-storage", { replace: true });

      firstInvalidValidation && firstInvalidValidation.nextAction === "not-found" && navigate("/not-found", { replace: true });

      // handle subscribe to folders and real time updates
      setStatus("loading");
      const q = buildQuery();
      const unsubscribe = subscribeToFolders(q, isRoot);
      return () => unsubscribe();
    };

    !["idle", "loading"].includes(parentFolderState.status) && checkAndSubscribeToFolders();
  }, [
    setStatus,
    buildQuery,
    subscribeToFolders,
    parentFolderData,
    isValidParentFolder,
    handleSubFolderValidation,
    isRoot,
    isValidSearchParams,
    navigate,
    parentFolderData?.owner_user_id,
    parent_folder_id,
    searchParams,
    shouldFetchInMount,
    user?.uid,
    parentFolderState.status,
  ]);
};

export default useGetFolder;
