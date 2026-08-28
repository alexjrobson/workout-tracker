import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";
import PlanPage from "./components/PlanPage";
import SessionPage from "./components/SessionPage";
import HistoryPage from "./components/HistoryPage";
import ProgressPage from "./components/ProgressPage";

function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginForm />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/session/:id" element={<SessionPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Route>
      <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
