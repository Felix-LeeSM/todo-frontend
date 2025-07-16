import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import { AuthProvider } from "./domain/auth/contexts/AuthProvider";
import { GroupProvider } from "./domain/group/contexts/GroupProvider";
import { Group } from "./page/Group";
import { Home } from "./page/Home";
import { SignIn } from "./page/SignIn";
import { SignUp } from "./page/SignUp";
import { Todo } from "./page/Todo";
import { GroupRoute } from "./route/GroupRoute";
import { GuestRoute } from "./route/GuestRoute";
import { UserRoute } from "./route/UserRoute";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} newestOnTop={true} closeOnClick transition={Flip} />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/group"
              element={
                <UserRoute>
                  <Group />
                </UserRoute>
              }
            />
            <Route
              path="/group/:groupId"
              element={
                <UserRoute>
                  <GroupProvider>
                    <GroupRoute>
                      <Todo />
                    </GroupRoute>
                  </GroupProvider>
                </UserRoute>
              }
            />
            <Route
              path="/signin"
              element={
                <GuestRoute>
                  <SignIn />
                </GuestRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <SignUp />
                </GuestRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
