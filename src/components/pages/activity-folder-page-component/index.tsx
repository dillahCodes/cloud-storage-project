import MainLayout from "@components/layout/main-layout";
import MappingFolderActivity from "./mapping-folder-activity";
import useMobileHeaderTitle from "@/hooks/use-mobile-header-title";

const ActivityFolderPageComponent = () => {
  useMobileHeaderTitle("activity");

  return (
    <MainLayout withBreadcrumb={false} withFooter={false} showAddButton={false}>
      <MappingFolderActivity />
    </MainLayout>
  );
};

export default ActivityFolderPageComponent;
