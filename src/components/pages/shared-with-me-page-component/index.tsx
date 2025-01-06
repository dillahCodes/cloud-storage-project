import useResetAllBreadcrumbItems from "@/features/breadcrumb/hooks/use-reset-all-breadcrumb-items";
import useCurrentFolderState from "@/features/folder/hooks/use-current-folder-state";
import useGetSharedWithMeFolderData from "@/features/folder/hooks/use-get-shared-with-me-folder-data";
import useMobileHeaderTitle from "@/hooks/use-mobile-header-title";
import MainLayout from "@components/layout/main-layout";
import { Flex, Spin } from "antd";
import SharredMappingFolders from "./shared-mapping-folders";

const SharedWithMePageComponent: React.FC = () => {
  useMobileHeaderTitle("shared with me");

  // reset all breadcrumb and set first breadcrumb
  useResetAllBreadcrumbItems({
    shouldReset: true,
    addFirstBreadcrumbItem: {
      label: "shared with me",
      path: "/storage/shared-with-me",
      key: "shared with me",
      icon: "share",
    },
  });

  // get folders shared and use state
  useGetSharedWithMeFolderData({ shouldFetch: true });
  const { status: fetchStatus } = useCurrentFolderState();

  return (
    <MainLayout showAddButton={false} showPasteButton={false}>
      <Flex className="max-w-screen-lg mx-auto px-3 my-5" vertical gap="middle">
        {fetchStatus === "loading" && <Spin />}
        <SharredMappingFolders />
      </Flex>
    </MainLayout>
  );
};

export default SharedWithMePageComponent;
