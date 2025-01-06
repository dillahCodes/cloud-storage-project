import useUser from "@/features/auth/hooks/use-user";
import { auth, db } from "@/firebase/firebase-services";
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

/**
 * serialize  - serialize timestamps data for redux toolkit
 **/
const handleSerializeFoldersData = (data: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
  const folderDataSerialized = {
    ...data.data(),
    created_at: JSON.parse(JSON.stringify(data.data().created_at)),
    updated_at: data.data().updated_at ? JSON.parse(JSON.stringify(data.data().updated_at)) : null,
  } as RootFolderGetData | SubFolderGetData;

  return folderDataSerialized;
};

/**
 * Build the query based on the parent_folder_id and isRoot
 */
const buildQuery = (isRoot: boolean, parent_folder_id?: string): Query<DocumentData> => {
  const { currentUser } = auth;
  const foldersRef = collection(db, "folders");

  const isSubFolder = !isRoot && parent_folder_id;

  return isSubFolder
    ? query(foldersRef, where("parent_folder_id", "==", parent_folder_id), orderBy("created_at", "desc"))
    : query(foldersRef, where("parent_folder_id", "==", null), where("owner_user_id", "==", currentUser?.uid), orderBy("created_at", "desc"));
};

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
   * Subscribes to the query and updates the folders state for real-time updates.
   *
   * @param {Query} q - The Firestore query to subscribe to.
   * @returns {() => void} Unsubscribe function to stop listening to updates.
   */
  const subscribeToFolders = useCallback(
    (q: Query) => {
      return onSnapshot(
        q,
        (snapshot) => {
          const fetchedFolders = snapshot.docs.map(handleSerializeFoldersData);
          isRoot ? setFolders(fetchedFolders as RootFolderGetData[]) : setFolders(fetchedFolders as SubFolderGetData[]);
          setStatus("succeded");
        },
        (error) => {
          setStatus("failed");
          console.error("Error fetching folders:", error);
        }
      );
    },
    [setFolders, setStatus, isRoot]
  );

  /**
   * Validates the subfolder based on the searchParams and parentFolderData.
   * Returns an array of objects with condition, message and nextAction properties.
   * The first object with condition === true will be taken as the validation result.
   * @param {HandleSubFolderValidationParams} params Object with properties isFromMyStorage, isFromSharedWithMe and isRoot.
   * @returns {HandleSubFolderValidationReturn[]} Array of objects with condition, message and nextAction properties.
   */
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

  /**
   * Validates the subfolder based on the searchParams and parentFolderData.
   * If the validation fails, it will return an object with condition, message and nextAction properties.
   * The nextAction can be either "home" or "not-found". If the validation is successful, it will return null.
   * @param {void} - No arguments are needed.
   * @returns {HandleSubFolderValidationReturn | null} Object with condition, message and nextAction properties or null if the validation is successful.
   */
  const validateSubFolder = useCallback(() => {
    if (!parent_folder_id) return null;

    const isMyRootFolder = parentFolderData?.root_folder_user_id === user?.uid;
    const isFromMyStorage = isValidSearchParams && searchParams.get("st") === "my-storage" && isMyRootFolder;
    const isFromSharedWithMe = isValidSearchParams && searchParams.get("st") === "shared-with-me" && !isMyRootFolder;

    const validationResult = handleSubFolderValidation({
      isFromMyStorage,
      isFromSharedWithMe,
      isRoot: false,
    });

    return validationResult.find((validation) => validation.condition);
  }, [parent_folder_id, parentFolderData, user, isValidSearchParams, searchParams, handleSubFolderValidation]);

  /**
   * Handles the validation result of the subfolder validation.
   * If the validation fails, it will navigate to the specified route.
   * If the validation is successful, it will return false.
   * @param {HandleSubFolderValidationReturn | null} validation - The validation result of the subfolder validation.
   * @returns {boolean} True if the validation failed, false if the validation is successful.
   */
  const handleValidationAction = useCallback(
    (validation: ReturnType<typeof validateSubFolder>) => {
      if (!validation) return false;

      if (validation.nextAction === "home") {
        navigate("/storage/my-storage", { replace: true });
        return true;
      }

      if (validation.nextAction === "not-found") {
        navigate("/not-found", { replace: true });
        return true;
      }

      return false;
    },
    [navigate]
  );

  const fetchRootFolder = useCallback(() => {
    setStatus("loading");
    const q = buildQuery(true); // isRoot
    return subscribeToFolders(q);
  }, [subscribeToFolders, setStatus]);

  const fetchSubFolder = useCallback(() => {
    setStatus("loading");
    const q = buildQuery(false, parent_folder_id);
    return subscribeToFolders(q);
  }, [subscribeToFolders, setStatus, parent_folder_id]);

  const fetchFolderData = useCallback(() => {
    if (!shouldFetchInMount) return;

    if (isRoot) {
      return fetchRootFolder();
    } else {
      const validation = validateSubFolder();
      const validationHandled = handleValidationAction(validation);

      if (!validationHandled) return fetchSubFolder();
    }
  }, [shouldFetchInMount, isRoot, fetchRootFolder, validateSubFolder, handleValidationAction, fetchSubFolder]);

  useEffect(() => {
    fetchFolderData();
  }, [fetchFolderData]);
};

export default useGetFolder;
