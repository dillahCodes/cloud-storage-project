import { dekstopMoveSelector, setMoveParentFolderId } from "@/features/move-folder-or-file/slice/dekstop-move-slice";
import { moveFoldersAndFilesDataSelector, setMoveParentFolderData } from "@/features/move-folder-or-file/slice/move-folders-and-files-data-slice";
import { Flex, message, Spin, Typography } from "antd";
import classNames from "classnames";
import { IoMdFolderOpen } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import emptyIlustration from "@assets/File-bundle-amico.svg";
import { useMemo } from "react";
import FileIconsVariant from "../file/file-icons-variant";
import abbreviateText from "@/util/abbreviate-text";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";

const { Text } = Typography;

const DektopMoveMappingFoldersAndFilesContent: React.FC = () => {
  const dispatch = useDispatch();
  const { folderId: folderIdWantToMove } = useSelector(dekstopMoveSelector);
  const { foldersData, folderStatus, filesData, fileStatus } = useSelector(moveFoldersAndFilesDataSelector);

  const isFolderEmpty = useMemo(() => !foldersData || foldersData.length === 0, [foldersData]);
  const isFileEmpty = useMemo(() => !filesData || filesData.length === 0, [filesData]);

  const isFileLoading = useMemo(() => fileStatus === "loading", [fileStatus]);
  const isFolderLoading = useMemo(() => folderStatus === "loading", [folderStatus]);

  const isEmpty = useMemo(() => isFolderEmpty && isFileEmpty, [isFolderEmpty, isFileEmpty]);
  const isLoading = useMemo(() => isFolderLoading || isFileLoading, [isFolderLoading, isFileLoading]);

  const handleClickFolder = (folderData: RootFolderGetData | SubFolderGetData) => {
    if (folderIdWantToMove === folderData.folder_id) {
      message.open({
        type: "error",
        content: "You can't move to the same folder",
        className: "font-archivo text-sm",
        key: "folder-move-error-message",
      });
      return;
    }
    dispatch(setMoveParentFolderId(folderData.folder_id));
    dispatch(setMoveParentFolderData(folderData));
  };

  if (isLoading) {
    return (
      <CenteredFlex>
        <Spin />
      </CenteredFlex>
    );
  }

  if (isEmpty) return <EmptyIllustration />;

  return (
    <Flex vertical gap="small" className="w-full h-[200px] p-3 overflow-y-auto snap-y">
      {foldersData &&
        foldersData.map((folder) => (
          <FolderItem
            key={folder.folder_id}
            folder={folder}
            isSelected={folder.folder_id === folderIdWantToMove}
            onClick={() => handleClickFolder(folder)}
          />
        ))}
      {filesData && filesData.map((file) => <FilesItem key={file.file_id} fileName={file.file_name} fileType={file.file_type} />)}
    </Flex>
  );
};

export default DektopMoveMappingFoldersAndFilesContent;

const CenteredFlex: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Flex vertical align="center" justify="center" className="w-full h-[200px] p-3">
    {children}
  </Flex>
);

const FolderItem: React.FC<{
  folder: { folder_id: string; folder_name: string };
  isSelected: boolean;
  onClick: () => void;
}> = ({ folder, isSelected, onClick }) => (
  <Flex
    onClick={onClick}
    gap="middle"
    className={classNames("snap-start group hover:bg-[#FFB6C1] cursor-pointer bg-[#ff87a6] w-full h-fit p-3 py-2 rounded-sm border-2 border-black", {
      "opacity-[.7]": isSelected,
    })}
  >
    <Text className="text-lg font-archivo group-hover:text-[#fff1ff]">
      <IoMdFolderOpen />
    </Text>
    <Text className="text-sm font-archivo group-hover:text-[#fff1ff]">{abbreviateText(folder.folder_name, 30)}</Text>
  </Flex>
);

const FilesItem: React.FC<{ fileName: string; fileType: string }> = ({ fileName, fileType }) => {
  return (
    <Flex
      gap="middle"
      className={classNames(
        "snap-start group opacity-[.7] hover:bg-[#FFB6C1] cursor-pointer bg-[#ff87a6] w-full h-fit p-3 py-2 rounded-sm border-2 border-black"
      )}
    >
      <Text className="text-lg font-archivo group-hover:text-[#fff1ff]">
        <FileIconsVariant fileType={fileType} />
      </Text>
      <Text className="text-sm font-archivo group-hover:text-[#fff1ff]">{abbreviateText(fileName, 30)}</Text>
    </Flex>
  );
};

const EmptyIllustration: React.FC = () => (
  <CenteredFlex>
    <img src={emptyIlustration} className="w-[110px]" alt="empty-illustration" />
    <Text className="text-sm font-roboto-slab">This folder is empty</Text>
  </CenteredFlex>
);
