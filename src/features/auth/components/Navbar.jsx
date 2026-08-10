import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import "../navbar.scss";

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate("/login");
  };

  const initials = (user?.username || user?.email || "?")
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/">
          <span className="navbar__logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.7L20 10l-6.1 1.3L12 17l-1.9-5.7L4 10l6.1-1.3z" /></svg>
          </span>
          <span className="navbar__title">Interview<span className="navbar__title-accent">Genie</span></span>
        </Link>
      </div>

      <div className="navbar__actions">
        {user && (
          <div className="navbar__user">
            <span className="navbar__avatar">{initials}</span>
            <span className="navbar__user-name">{user.username || user.email}</span>
          </div>
        )}
        <button type="button" onClick={handleLogoutClick} className="navbar__logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
