import getUserDataInDb from "@/features/auth/get-user-data-in-db";
import useUser from "@/features/auth/hooks/use-user";
import useDrawer from "@/hooks/use-drawer";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getFolderById from "../get-folder-by-id";
import useGetFolderById from "./use-get-folder-byid";
import { message } from "antd";
import translateEpochToDate from "@/util/translateEpochToDate";

interface FolderDetailsData {
  folderName: string;
  folderOwnerName: string;
  folderLocationName: string;
  folderCreatedAt: string;
  folderCreatedByName: string;
  folderModifiedAt: string;
  folderModifiedByName: string;
}

// Helper Functions
const getFolderOwnerName = async (ownerUserId: string, isMyFolder: boolean): Promise<string> => {
  return isMyFolder ? "Me" : await getUserDataInDb(ownerUserId).then((data) => data?.displayName ?? "Unknown User");
};

const getFolderLocationName = async (parentFolderId: string | null, isSubFolder: boolean): Promise<string> => {
  if (!isSubFolder || !parentFolderId) return "My Storage";
  return await getFolderById(parentFolderId).then((data) => data?.folder_name ?? "Unknown Location");
};

const getFolderCreatorName = async (ownerUserId: string, isMyFolder: boolean): Promise<string> => {
  return isMyFolder ? "Me" : await getUserDataInDb(ownerUserId).then((data) => data?.displayName ?? "Unknown User");
};

const getFolderModifiedAt = (updatedAt: { seconds: number } | null, isFolderModified: boolean): string => {
  return isFolderModified && updatedAt ? translateEpochToDate(updatedAt.seconds) : "-";
};

const getFolderModifiedByName = async (updatedBy: string | null, isModifiedByMe: boolean): Promise<string> => {
  if (!updatedBy) return "-";
  return isModifiedByMe ? "Me" : await getUserDataInDb(updatedBy).then((data) => data?.displayName ?? "Unknown User");
};

const useFolderDetails = () => {
  const [folderDetailsData, setFolderDetailsData] = useState<FolderDetailsData>({
    folderName: "",
    folderOwnerName: "",
    folderLocationName: "",
    folderCreatedAt: "",
    folderCreatedByName: "",
    folderModifiedAt: "",
    folderModifiedByName: "",
  });

  const navigate = useNavigate();
  const { user } = useUser();

  const { isDesktopDevice } = useGetClientScreenWidth();
  const { folderId } = useParams();

  /**
   * dektop drawer
   */
  const { drawerState } = useDrawer();
  const { desktopDrawerFolderId } = drawerState;

  /**
   * crate current active folderId
   * ant use it for fetching folder data
   */
  const activeFolderId = useMemo(() => {
    if (isDesktopDevice) {
      return desktopDrawerFolderId || folderId;
    } else {
      return folderId;
    }
  }, [desktopDrawerFolderId, folderId, isDesktopDevice]);

  /**
   * fetch folder details data
   */
  const { folderData, status } = useGetFolderById(activeFolderId);

  /**
   * not found condition
   */
  const isFolderDataNotFound = useMemo(() => {
    return !folderData && status === "succeeded";
  }, [folderData, status]);

  const isMyFolder = folderData?.owner_user_id === user?.uid;
  const isMyRootFolder = folderData?.root_folder_user_id === user?.uid;
  const isSubFolder = folderData?.parent_folder_id !== null;
  const isFolderModified = folderData?.updated_at !== null;
  const isModifiedByMe = isFolderModified && folderData?.updated_by === user?.uid;

  const param: NestedBreadcrumbType = isMyRootFolder ? "my-storage" : "shared-with-me";

  const handleNavigateToFolderLocation = () => {
    if (!folderData) return;
    const isFolderLocationMyStorage = folderDetailsData.folderLocationName === "My Storage";
    isFolderLocationMyStorage ? navigate("/storage/my-storage") : navigate(`/storage/folders/${folderData.parent_folder_id}?st=${param}`);
  };

  const handleBack = () => navigate(-1);

  /**
   * handle create folder details data
   */
  useEffect(() => {
    if (!folderData) return;
    const fetchFolderDetails = async () => {
      const folderOwnerName = await getFolderOwnerName(folderData.owner_user_id, isMyFolder);
      const folderLocationName = await getFolderLocationName(folderData.parent_folder_id, isSubFolder);
      const folderCreatedAt = translateEpochToDate(folderData.created_at.seconds);
      const folderCreatedByName = await getFolderCreatorName(folderData.owner_user_id, isMyFolder);
      const folderModifiedAt = getFolderModifiedAt(folderData.updated_at, isFolderModified);
      const folderModifiedByName = await getFolderModifiedByName(folderData.updated_by, isModifiedByMe);

      setFolderDetailsData({
        folderName: folderData.folder_name,
        folderOwnerName,
        folderLocationName,
        folderCreatedAt,
        folderCreatedByName,
        folderModifiedAt,
        folderModifiedByName,
      });
    };

    fetchFolderDetails();
  }, [folderData, isMyFolder, isSubFolder, isFolderModified, isModifiedByMe]);

  /**
   * handle folder details not found
   */
  useEffect(() => {
    if (isFolderDataNotFound) {
      message.open({
        type: "error",
        content: "Folder details not found",
        className: "font-archivo text-sm",
      });
      navigate("/storage/my-storage");
    }
  }, [isFolderDataNotFound, navigate]);

  return { folderDetailsData, handleNavigateToFolderLocation, handleBack, folderStatus: status, folderData, activeFolderId };
};

export default useFolderDetails;
