import { AuthProvider } from "@domain/auth/contexts/AuthProvider";
import { GroupProvider } from "@domain/group/contexts/GroupProvider";
import { GroupRoute } from "@route/GroupRoute";
import { GuestRoute } from "@route/GuestRoute";
import { UserRoute } from "@route/UserRoute";
import React, { Suspense } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import { Layout } from "@domain/shared/components/Layout";
import { Spinner } from "@domain/shared/components/Spinner";
import { RoleRoute } from "./route/RoleRoute";

const LandingPage = React.lazy(() => import("@/page/LandingPage"));
const SignInPage = React.lazy(() => import("@/page/SignInPage"));
const SignUpPage = React.lazy(() => import("@/page/SignUpPage"));
const GroupsPage = React.lazy(() => import("@/page/GroupsPage"));
const CalandarPage = React.lazy(() => import("@/page/CalendarPage"));
const InvitePage = React.lazy(() => import("./page/InvitationPage"));
const GroupTodoPage = React.lazy(() => import("./page/GroupTodoPage"));
const GroupSettingsPage = React.lazy(() => import("./page/GroupSettingsPage"));
const NotFoundPage = React.lazy(() => import("@/page/NotFoundPage"));

function App() {
  const navigate = useNavigate();
  return (
    <AuthProvider>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<GuestRoute />}>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>

          <Route element={<UserRoute />}>
            <Route element={<Layout />}>
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/calendar" element={<CalandarPage />} />
              <Route path="/groups/invitation/:token" element={<InvitePage />} />
            </Route>
            <Route path="/groups/:groupId" element={<GroupProvider onNotFound={() => navigate("/groups")} />}>
              <Route element={<GroupRoute />}>
                <Route element={<Layout />}>
                  <Route index element={<GroupTodoPage />} />
                  <Route element={<RoleRoute requiredRole="MANAGER" operater="gte" />}>
                    <Route path="settings" element={<GroupSettingsPage />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
