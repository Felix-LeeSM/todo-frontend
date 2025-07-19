import { AuthProvider } from "@domain/auth/contexts/AuthProvider";
import { GroupProvider } from "@domain/group/contexts/GroupProvider";
import { Todo } from "@page/Todo";
import { GroupRoute } from "@route/GroupRoute";
import { GuestRoute } from "@route/GuestRoute";
import { UserRoute } from "@route/UserRoute";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import { GroupsPage } from "@/page/GroupsPage";
import { NotFoundPage } from "@/page/NotFoundPage";
import { SignInPage } from "@/page/SignInPage";

import "react-toastify/dist/ReactToastify.css";
import { Layout } from "@domain/shared/components/Layout";
import { CalandarPage } from "@/page/CalendarPage";
import { LandingPage } from "@/page/LandingPage";
import { SignUpPage } from "@/page/SignUpPage";

function App() {
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} newestOnTop={true} closeOnClick transition={Flip} />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />

            <Route element={<UserRoute />}>
              <Route element={<Layout />}>
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/calendar" element={<CalandarPage />} />
                <Route path="/groups/:groupId" element={<GroupProvider />}>
                  <Route element={<GroupRoute />}>
                    <Route path="/" element={<Todo />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
