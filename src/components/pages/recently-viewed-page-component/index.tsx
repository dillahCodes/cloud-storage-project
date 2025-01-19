import useResetAllBreadcrumbItems from "@/features/breadcrumb/hooks/use-reset-all-breadcrumb-items";
import useGetRecentFile from "@/features/file/hooks/use-get-recent-file";
import { fileSelector } from "@/features/file/slice/file-slice";
import useMobileHeaderTitle from "@/hooks/use-mobile-header-title";
import RootFileMapping from "@components/layout/file/root-file-mapping";
import FoldersAndFilesSortingOptions from "@components/layout/folder-and-files-sorting-options";
import MainLayout from "@components/layout/main-layout";
import { Flex } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import EmptyRecent from "./empty-recent";

const RecentlyViewedComponent: React.FC = () => {
  useMobileHeaderTitle("recently viewed");

  useResetAllBreadcrumbItems({
    shouldReset: true,
    addFirstBreadcrumbItem: {
      label: "recently viewed",
      path: "/storage/recently-viewed",
      key: "recently viewed",
      icon: "recent",
    },
  });

  /**
   * handle get recent files
   */
  useGetRecentFile();

  /**
   * rencet files state
   */
  const { files } = useSelector(fileSelector);
  const isFileEmpty = useMemo(() => files.length === 0, [files.length]);

  return (
    <MainLayout showAddButton={false} showPasteButton={false}>
      <Flex className="max-w-screen-lg mx-auto px-3 my-5" vertical gap="middle">
        {!isFileEmpty && <FoldersAndFilesSortingOptions sortingFor="Files" />}
        {isFileEmpty ? <EmptyRecent /> : <RootFileMapping />}
      </Flex>
    </MainLayout>
  );
};

export default RecentlyViewedComponent;
