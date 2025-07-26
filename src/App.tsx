import { AuthProvider } from "@domain/auth/contexts/AuthProvider";
import { GroupProvider } from "@domain/group/contexts/GroupProvider";
import { GroupRoute } from "@route/GroupRoute";
import { GuestRoute } from "@route/GuestRoute";
import { UserRoute } from "@route/UserRoute";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GroupsPage } from "@/page/GroupsPage";
import { NotFoundPage } from "@/page/NotFoundPage";
import { SignInPage } from "@/page/SignInPage";

import "react-toastify/dist/ReactToastify.css";
import { Layout } from "@domain/shared/components/Layout";
import { CalandarPage } from "@/page/CalendarPage";
import { LandingPage } from "@/page/LandingPage";
import { SignUpPage } from "@/page/SignUpPage";
import { GroupTodoPage } from "./page/GroupTodoPage";

function App() {
  const navigate = useNavigate();
  return (
    <AuthProvider>
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
          </Route>
          <Route path="/groups/:groupId" element={<GroupProvider onNotFound={() => navigate("/groups")} />}>
            <Route element={<GroupRoute />}>
              <Route element={<Layout />}>
                <Route index element={<GroupTodoPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
