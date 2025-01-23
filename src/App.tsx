import { Layout, Spin } from "antd";
import useAuthStateChanged from "./features/auth/hooks/use-auth-state-changed";
import useUser from "./features/auth/hooks/use-user";
import useGetMyMessageCount from "./features/message/hooks/use-get-my-message-count";
import useUserOnStorageChange from "./features/storage/hooks/use-user-on-storage-change";
import "./index.css";
import Routers from "./router";

function App() {
  /**
   * listen user storage change
   */
  useUserOnStorageChange();

  /**
   * listen to auth state
   */
  const { status, user } = useUser();
  useAuthStateChanged();

  /**
   * http polling fetch message
   */
  const shouldFetchMessage = Boolean(status === "succeeded" && user);
  useGetMyMessageCount({
    shouldFetch: shouldFetchMessage,
  });

  if (status === "loading") {
    return (
      <Layout className="h-screen w-full flex justify-center items-center">
        <Spin size="large" />
      </Layout>
    );
  }
  return <Routers />;
}

export default App;
