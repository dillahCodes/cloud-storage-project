import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { store } from "./store/store.ts";
import AntdThemeProvider from "./theme/antd-theme.tsx";
import { UploadTaskManagerProvider } from "./features/file/slice/upload-task-manager.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <UploadTaskManagerProvider>
        <AntdThemeProvider>
          <App />
        </AntdThemeProvider>
      </UploadTaskManagerProvider>
    </Provider>
  </StrictMode>
);
