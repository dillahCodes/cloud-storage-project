import useAddFirstBreadcrumbItem from "@/features/breadcrumb/hooks/use-add-first-breadcrumb-item";
import useAutoDeleteUnusedBreadcrumbItems from "@/features/breadcrumb/hooks/use-auto-delete-unused-breadcrumb-items";
import useBreadcrumbState from "@/features/breadcrumb/hooks/use-breadcrumb-state";
import useFilesState from "@/features/file/hooks/use-files-state";
import useGetFiles from "@/features/file/hooks/use-get-files";
import useCurrentFolderState from "@/features/folder/hooks/use-current-folder-state";
import useGetFolder from "@/features/folder/hooks/use-get-folder";
import useIsValidParams from "@/features/folder/hooks/use-isvalid-params";
import useMobileHeaderTitle from "@/hooks/use-mobile-header-title";
import MainLayout from "@components/layout/main-layout";
import { Layout, Spin } from "antd";
import MappingFiles from "./mapping-files";
import MappingFolder from "./mapping-folder";

const MyStoragePageComponent = () => {
  useMobileHeaderTitle("my storage"); // set mobile header title
  useIsValidParams({ removeSearchParams: true }); // remove search params (st) if not valid

  const { items } = useBreadcrumbState();

  // add first breadcrumb item
  useAddFirstBreadcrumbItem({
    addInMount: true,
    breadcrumbItem: {
      label: "my storage",
      path: "/storage/my-storage",
      key: "my storage",
      icon: "storage",
    },
  });

  // auto delete unused breadcrumb items
  useAutoDeleteUnusedBreadcrumbItems({
    breadcrumbKey: "my storage",
    shouldDelete: items.length > 1,
  });

  // get files and files state
  useGetFiles({ isRoot: true, shouldFetchInMount: true });
  const { status: fileStatus } = useFilesState();

  //  get folders and folders state
  useGetFolder({ isRoot: true, shouldFetchInMount: true });
  const { status: folderStatus } = useCurrentFolderState();

  const isLoading = fileStatus === "loading" || folderStatus === "loading";

  return (
    <MainLayout showAddButton showPasteButton>
      {isLoading ? (
        <Layout className="h-screen w-full flex justify-center items-center">
          <Spin size="large" />
        </Layout>
      ) : (
        <>
          <MappingFolder />
          <MappingFiles />
        </>
      )}
    </MainLayout>
  );
};

export default MyStoragePageComponent;
