import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeDetailsPage from "./pages/employees/EmployeeDetailsPage";
import PrivateRoute from "./components/PrivateRoute";
import AuthPageComponent from "./pages/AuthPage/AuthPage";
import Main from "./pages/MainPage/Main";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Settings from "./pages/SettingsPage/Settings";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPageComponent />} />
        <Route
          path="/main"
          element={
            <PrivateRoute>
              <Main />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <PrivateRoute>
              <EmployeeDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
