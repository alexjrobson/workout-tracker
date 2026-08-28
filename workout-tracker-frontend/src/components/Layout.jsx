import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">Iron Log</div>
        <nav className="nav">
          <NavLink to="/" end>
            Today
          </NavLink>
          <NavLink to="/plan">Plan</NavLink>
          <NavLink to="/history">History</NavLink>
          <NavLink to="/progress">Progress</NavLink>
          <button className="ghost" onClick={logout} type="button">
            Sign out
          </button>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
