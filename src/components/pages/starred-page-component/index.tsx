import useResetAllBreadcrumbItems from "@/features/breadcrumb/hooks/use-reset-all-breadcrumb-items";
import useCurrentFolderState from "@/features/folder/hooks/use-current-folder-state";
import useGetStarredFolders from "@/features/folder/hooks/use-get-starred-folders";
import useMobileHeaderTitle from "@/hooks/use-mobile-header-title";
import MainLayout from "@components/layout/main-layout";
import StarredMappingFolders from "./starred-mapping-folders";
import { Flex, Spin } from "antd";

const StarredPageComponent: React.FC = () => {
  useMobileHeaderTitle("starred");
  /**
   * reset all breadcrumb and set first breadcrumb
   */
  useResetAllBreadcrumbItems({
    shouldReset: true,
    addFirstBreadcrumbItem: {
      label: "starred",
      path: "/storage/starred",
      key: "starred",
      icon: "star",
    },
  });

  /**
   * fetch starred folders
   */
  useGetStarredFolders({
    shouldFetch: true,
  });

  /**
   * current folder state
   */
  const { status: fetchStatus } = useCurrentFolderState();

  return (
    <MainLayout showAddButton>
      <Flex className="max-w-screen-lg mx-auto px-3 my-5" vertical gap="middle">
        {fetchStatus === "loading" && <Spin />}
        <StarredMappingFolders />
      </Flex>
    </MainLayout>
  );
};

export default StarredPageComponent;
