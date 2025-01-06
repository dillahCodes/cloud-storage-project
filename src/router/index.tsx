import LoginPage from "@/pages/login-page";
import ProfilePage from "@/pages/profile-page";
import RegisterPage from "@/pages/register-page";
import ProtectedRouter from "./protected";

import DetailsFolderPage from "@/pages/details-folder-page";
import ForgotPasswordPage from "@/pages/forgot-password-page";
import MystoragePage from "@/pages/my-storage-page";
import NestedFolderPage from "@/pages/nested-folder-page";
import NotificationDetailsPage from "@/pages/notification-details";
import NotificationPage from "@/pages/notification-page";
import RecentlyPage from "@/pages/recently-page";
import SharedWithMePage from "@/pages/shared-with-me-page";
import StarredPage from "@/pages/starred-page";
import { history } from "@/store/store";
import { Route, Routes } from "react-router-dom";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import Error404Page from "./error404-page";
import ActivityFolderPage from "@/pages/activity-folder-page";
import MoveFolderOrFilePage from "@/pages/move-folder-or-file-page";

const ErrorBoundary: React.FC = () => {
  return <div>Something went wrong. Please try again later.</div>;
};

const Routers: React.FC = () => {
  return (
    <Router history={history}>
      <Routes>
        <Route path="*" element={<ErrorBoundary />} />

        <Route element={<ProtectedRouter />} path="/storage">
          <Route path="my-storage" element={<MystoragePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="notification/:notificationId" element={<NotificationDetailsPage />} />
          <Route path="shared-with-me" element={<SharedWithMePage />} />
          <Route path="recently-viewed" element={<RecentlyPage />} />
          <Route path="starred" element={<StarredPage />} />
          <Route path="folders/:folderId" element={<NestedFolderPage />} />
          <Route path="folder/details/:folderId" element={<DetailsFolderPage />} />
          <Route path="folder/activity/:folderId" element={<ActivityFolderPage />} />
          <Route path="folder/move" element={<MoveFolderOrFilePage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/not-found" element={<Error404Page />} />
      </Routes>
    </Router>
  );
};

export default Routers;
