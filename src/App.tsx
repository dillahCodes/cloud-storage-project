import { Layout, Spin } from "antd";
import useAuthStateChanged from "./features/auth/hooks/use-auth-state-changed";
import useUser from "./features/auth/hooks/use-user";
import useGetMyMessageCount from "./features/message/hooks/use-get-my-message-count";
import "./index.css";
import Routers from "./router";

function App() {
  const { status, user } = useUser();
  useAuthStateChanged();

  useGetMyMessageCount({
    shouldFetch: Boolean(status === "succeeded" && user),
  });

  if (status === "loading")
    return (
      <Layout className="h-screen w-full flex justify-center items-center">
        <Spin size="large" />
      </Layout>
    );
  return <Routers />;
}

export default App;
