import { FirebaseUserData } from "@/features/auth/auth";
import useUser from "@/features/auth/hooks/use-user";
import { auth, db } from "@/firebase/firebase-services";
import useDetectLocation from "@/hooks/use-detect-location";
import {
  collection,
  DocumentData,
  FirestoreError,
  onSnapshot,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { RootFolderGetData, SubFolderGetData } from "../folder";
import { parentFolderSelector } from "../slice/parent-folder-slice";
import useCurrentFolderSetState from "./use-current-folder-setstate";
import useIsValidParams from "./use-isvalid-params";

interface ValidationSubFolderParams {
  user: FirebaseUserData | null;
  parentFolderData: SubFolderGetData | null;
  isValidSearchParams: boolean;
  isRoot: boolean;
  isSubMyStorageLocation: boolean;
  isSubSharedWithMeLocation: boolean;
  navigate: NavigateFunction;
}

interface ValidationData {
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
  const folderDataSerialized = JSON.parse(JSON.stringify(data.data())) as RootFolderGetData | SubFolderGetData;
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

const validateSubFolder = (params: ValidationSubFolderParams) => {
  const { isValidSearchParams, navigate, parentFolderData, user, isRoot, isSubMyStorageLocation, isSubSharedWithMeLocation } = params;

  const isMyRootFolder: boolean = parentFolderData!.root_folder_user_id === user!.uid;
  const isFromMyStorage: boolean = isValidSearchParams && isSubMyStorageLocation && isMyRootFolder;
  const isFromSharedWithMe: boolean = isValidSearchParams && isSubSharedWithMeLocation && !isMyRootFolder;

  const validations: ValidationData[] = [
    {
      condition: isRoot,
      message: "Invalid should be sub Folder",
      nextAction: "home",
    },
    {
      condition: !user,
      message: "Invalid User",
      nextAction: "home",
    },
    {
      condition: !parentFolderData,
      message: "Invalid Parent Folder",
      nextAction: "not-found",
    },
    {
      condition: !isValidSearchParams,
      message: "Invalid Search Params 1",
      nextAction: "home",
    },
    {
      condition: !isFromMyStorage && !isFromSharedWithMe,
      message: "Invalid Search Params 2",
      nextAction: "home",
    },
  ];

  const validationResult = validations.find((validation) => validation.condition);
  if (validationResult) {
    switch (validationResult.nextAction) {
      case "home":
        navigate("/storage/my-storage", { replace: true });
        break;

      case "not-found":
        navigate("/not-found", { replace: true });
        break;

      default:
        break;
    }
    return false;
  }

  return true;
};

const useGetFolder = ({ isRoot, shouldFetchInMount }: UseGetFolderProps) => {
  const { user } = useUser();

  /**
   * params hooks
   */
  const { folderId: parent_folder_id } = useParams<{ folderId: string }>();
  const { isValidSearchParams } = useIsValidParams();

  /**
   * location hooks
   */
  const navigate = useNavigate();
  const { isSubMyStorageLocation, isSubSharedWithMeLocation } = useDetectLocation();

  /**
   * parent folder state
   */
  const parentFolderState = useSelector(parentFolderSelector);
  const { parentFolderData } = parentFolderState;

  /**
   * set folders state
   */
  const { setStatus, setFolders } = useCurrentFolderSetState();

  /**
   * handle on folder snapshot
   */
  const handleOnFolderSnapshot = useCallback(
    (snap: QuerySnapshot<DocumentData, DocumentData>) => {
      const fetchedFolders = snap.docs.map((doc) => handleSerializeFoldersData(doc));
      isRoot ? setFolders(fetchedFolders as RootFolderGetData[]) : setFolders(fetchedFolders as SubFolderGetData[]);
      setStatus("succeded");
    },
    [isRoot, setFolders, setStatus]
  );

  /**
   * handle folder snapshot error
   */
  const handleFolderSnapshotError = useCallback(
    (err: FirestoreError) => {
      setStatus("failed");
      console.error("Error fetching folders:", err.message);
    },
    [setStatus]
  );

  /**
   * subscribe to folders
   */
  const subscribeToFolders = useCallback(
    (q: Query) => {
      return onSnapshot(q, handleOnFolderSnapshot, handleFolderSnapshotError);
    },
    [handleOnFolderSnapshot, handleFolderSnapshotError]
  );

  /**
   * function for handle fetch root folder
   */
  const handleFetchRootFolder = useCallback(() => {
    setStatus("loading");
    const q = buildQuery(true); // isRoot
    return subscribeToFolders(q);
  }, [subscribeToFolders, setStatus]);

  /**
   * function for handle fetch sub folder
   */
  const handleFetchSubFolder = useCallback(() => {
    setStatus("loading");
    const q = buildQuery(false, parent_folder_id);
    return subscribeToFolders(q);
  }, [subscribeToFolders, setStatus, parent_folder_id]);

  /**
   * fetch folder data function with validation
   */
  const fetchFolderData = useCallback(() => {
    if (!shouldFetchInMount) return;

    if (isRoot) {
      handleFetchRootFolder();
      return;
    }

    const isValidationPassed = validateSubFolder({
      isRoot,
      isSubMyStorageLocation,
      isSubSharedWithMeLocation,
      isValidSearchParams,
      navigate,
      parentFolderData,
      user,
    });

    if (isValidationPassed) {
      handleFetchSubFolder();
      return;
    }
  }, [
    shouldFetchInMount,
    isRoot,
    handleFetchRootFolder,
    handleFetchSubFolder,
    isValidSearchParams,
    navigate,
    parentFolderData,
    user,
    isSubMyStorageLocation,
    isSubSharedWithMeLocation,
  ]);

  useEffect(() => {
    fetchFolderData();
  }, [fetchFolderData]);
};

export default useGetFolder;
