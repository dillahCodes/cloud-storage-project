import emptyIlustration from "@assets/File-bundle-amico.svg";
import { Flex, Layout, Typography } from "antd";

const { Text } = Typography;
const EmptyRecent: React.FC = () => {
  return (
    <Layout className="flex items-center justify-center p-3">
      <Flex vertical className="w-fit mx-auto" align="center" gap="middle">
        <img src={emptyIlustration} alt="empty folder" className="max-w-[200px] w-full mx-auto" />
        <Text className="text-sm text-center font-archivo font-bold">
          <Text>It looks like you haven't opened any files recently.</Text>
        </Text>
      </Flex>
    </Layout>
  );
};

export default EmptyRecent;
