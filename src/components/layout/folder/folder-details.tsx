import { CollaboratorUserData } from "@/features/folder/folder-collaborator";
import useFolderDetails from "@/features/folder/hooks/use-folder-details";
import useFolderPermissionState from "@/features/folder/hooks/use-folder-permission-state";
import useGetCollaborators from "@/features/folder/hooks/use-get-collaborators";
import useGetGeneralAccess from "@/features/folder/hooks/use-get-general-access";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import Button from "@components/ui/button";
import { Flex, Spin, Typography } from "antd";
import { useMemo } from "react";
import { GrStorage } from "react-icons/gr";
import { IoIosArrowBack } from "react-icons/io";
import { MdFolderOpen } from "react-icons/md";
import FolderCollaboratorsAvatar from "./folder-collaborators-avatar";
import ManageAccessButton from "./manage-access-button";
import useUser from "@/features/auth/hooks/use-user";
import useFolderGetPermission from "@/features/folder/hooks/use-folder-get-permission";
import useModalManageAccessContentSetState from "@/features/folder/hooks/use-modal-manage-access-content-setstate";

const generateCollaboratorsNameInfo = (collaborators: CollaboratorUserData[] | null, isFolderPrivate: boolean): string => {
  if (!collaborators || collaborators.length === 0) return "";
  if (isFolderPrivate || collaborators.length === 1) return "private to you";

  const ownerName = collaborators.find((c) => c.role === "owner")?.name;
  const otherNames = collaborators.map((c) => c.name).filter((name) => name !== ownerName);

  if (otherNames.length === 0) return "shared with collaborators";
  if (otherNames.length === 1) return `Owned by ${ownerName}. Shared with ${otherNames[0]}`;
  if (otherNames.length === 2) return otherNames.join(" and ");

  return `Owned by ${ownerName}. shared with ${otherNames.slice(0, -1).join(", ")}, and ${otherNames[otherNames.length - 1]}`;
};

const { Text } = Typography;
const FolderDetails = () => {
  const { user } = useUser();
  const { isRootFolder } = useFolderPermissionState();
  const { isDesktopDevice } = useGetClientScreenWidth();
  const { folderDetailsData, handleNavigateToFolderLocation, folderStatus, handleBack, folderData } = useFolderDetails();

  /**
   * fetch collaborators data
   */
  const { fetchCollaboratorsUserDataStatus, collaboratorsUserData } = useGetCollaborators({
    folderId: folderData?.folder_id,
    shouldFetch: Boolean(folderData?.folder_id),
    shoudFetchUserCollaboratorsData: Boolean(folderData?.folder_id),
  });
  const { fetchStatus, generalAccessDataState } = useGetGeneralAccess({
    folderId: folderData?.folder_id,
    shouldFetch: Boolean(folderData?.folder_id),
  });

  const isLoading = useMemo(() => {
    return folderStatus === "loading" || fetchCollaboratorsUserDataStatus === "loading" || fetchStatus === "loading";
  }, [fetchCollaboratorsUserDataStatus, fetchStatus, folderStatus]);

  /**
   * set data to store
   */
  useModalManageAccessContentSetState({
    withUseEffect: {
      setModalCollaboratorsUserData: collaboratorsUserData,
      setModalGeneralData: generalAccessDataState,
      setModalFolderData: folderData,
    },
  });

  /**
   * get permission based on collaborators data
   */
  const { permissions, permissionDataDetails } = useFolderGetPermission({
    userId: user ? user.uid : null,
    collaboratorsUserData: collaboratorsUserData ?? null,
    generalAccessDataState: generalAccessDataState ?? null,
    parentFolderOwnerId: null,
    shouldProcessPermission: isLoading,
  });

  console.log({ permissions, permissionDataDetails });

  const isFolderPrivate = generalAccessDataState?.type === "private";

  const collaboratorsNameInfo = useMemo(() => {
    return generateCollaboratorsNameInfo(collaboratorsUserData, isFolderPrivate);
  }, [collaboratorsUserData, isFolderPrivate]);

  if (isLoading) {
    return (
      <Flex className="w-full h-screen" align="center" justify="center">
        <Spin />
      </Flex>
    );
  }

  return (
    <div className="w-full">
      <Flex className="w-full p-3" gap="middle" vertical>
        {!isDesktopDevice && (
          <Button type="primary" size="small" className="w-fit text-black" icon={<IoIosArrowBack />} onClick={handleBack}>
            <Text className="text-sm font-archivo">Back</Text>
          </Button>
        )}

        <Text className="text-9xl font-archivo mx-auto">
          <MdFolderOpen />
        </Text>

        <Flex vertical>
          <Text className="text-sm font-archivo font-bold  capitalize">folder name :</Text>
          <Text className="text-sm font-archivo ">{folderDetailsData.folderName}</Text>
        </Flex>

        <Flex vertical>
          <Text className="text-sm font-archivo font-bold  capitalize">owner :</Text>
          <Text className="text-sm font-archivo ">{folderDetailsData.folderOwnerName}</Text>
        </Flex>

        <Flex vertical>
          <Text className="text-sm font-archivo font-bold  capitalize">location :</Text>
          <Button type="primary" size="small" className="w-fit text-black" onClick={handleNavigateToFolderLocation} icon={<GrStorage />}>
            <Text className="text-sm font-archivo">{folderDetailsData.folderLocationName}</Text>
          </Button>
        </Flex>

        <Flex vertical>
          <Text className="text-sm font-archivo font-bold  capitalize">created :</Text>
          <Text className="text-sm font-archivo ">
            {folderDetailsData.folderCreatedAt} by {folderDetailsData.folderCreatedByName}
          </Text>
        </Flex>

        <Flex vertical>
          <Text className="text-sm font-archivo font-bold  capitalize">Modified :</Text>
          <Text className="text-sm font-archivo ">
            {folderDetailsData.folderModifiedAt} {folderDetailsData.folderModifiedByName !== "-" ? " by" : "-"}{" "}
            {folderDetailsData.folderModifiedByName}
          </Text>
        </Flex>
      </Flex>

      <Flex className="w-full border-t-2 border-black p-3" vertical gap="middle">
        <Text className="text-base font-archivo font-bold text-center  capitalize">Who has access</Text>

        <Flex vertical gap="small">
          <FolderCollaboratorsAvatar collaborators={collaboratorsUserData} generalAccessData={generalAccessDataState} />
          <Text className="text-sm font-archivo">{collaboratorsNameInfo}</Text>
          <ManageAccessButton disabledButton={!permissions.canManageAccess && !isRootFolder} />
        </Flex>
      </Flex>
    </div>
  );
};

export default FolderDetails;
