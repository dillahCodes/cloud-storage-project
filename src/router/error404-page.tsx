import notFoundIlustreation from "@assets/404-error.svg";
import Button from "@components/ui/button";
import { Flex, Layout, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const Error404Page: React.FC = () => {
  const location = useLocation();
  const message = location.state?.message || "An unknown error occurred.";
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);

  return (
    <Layout className="min-h-screen flex items-center justify-center p-3">
      <Flex vertical className="w-fit mx-auto" align="center" gap="middle">
        <img src={notFoundIlustreation} alt="not found ilustration" className="max-w-xs mx-auto" />
        <Typography.Text className="font-normal font-archivo text-base max-w-2xl text-center">
          The Request Url The requested URL <span className="font-bold">{message}</span> was not found on this server.
          <span className="font-bold"> That’s all we know.</span>
        </Typography.Text>
        <Button type="primary" size="large" className="text-black font-archivo capitalize" onClick={handleGoBack}>
          Back to Previous
        </Button>
      </Flex>
    </Layout>
  );
};

export default Error404Page;
