import { Flex, Spin } from "antd";

const LoadingActivity = () => {
  return (
    <Flex className="w-full h-screen" align="center" justify="center">
      <Spin size="large" />
    </Flex>
  );
};

export default LoadingActivity;
