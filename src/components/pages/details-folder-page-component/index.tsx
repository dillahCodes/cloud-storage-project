import FolderDetails from "@components/layout/folder/folder-details";
import MainLayout from "@components/layout/main-layout";
import { Flex } from "antd";

const DetailsFolderPageComponent = () => {
  return (
    <MainLayout showAddButton={false} withFooter={false} withBreadcrumb={false} showPasteButton={false}>
      <Flex className="pb-3">
        <FolderDetails />
      </Flex>
    </MainLayout>
  );
};

export default DetailsFolderPageComponent;
