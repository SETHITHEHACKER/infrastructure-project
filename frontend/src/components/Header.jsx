import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="fixed-header">
      <div className="header-container">
        <h2 className="logo">Geo-Tagged Infrastructure Damage Reporting</h2>

        <nav className="nav-buttons">
          {!user && (
            <>
              <Link to="/" className="nav-btn">Home</Link>
              <Link to="/login" className="nav-btn">Login</Link>
              <Link to="/register" className="nav-btn">Register</Link>
            </>
          )}

          {user?.role === "Citizen" && (
            <>
              <Link to="/citizen/dashboard" className="nav-btn">Dashboard</Link>
              <Link to="/citizen/submit" className="nav-btn">Report Damage</Link>
              <button onClick={logout} className="nav-btn logout-btn">Logout</button>
            </>
          )}

          {user?.role === "Sanitization" && (
            <>
              <Link to="/sanitization/dashboard" className="nav-btn">Dashboard</Link>
              <Link to="/sanitization/pending" className="nav-btn">Pending</Link>
              <Link to="/sanitization/raise-issue" className="nav-btn">Raise Issue</Link>
              <button onClick={logout} className="nav-btn logout-btn">Logout</button>
            </>
          )}

          {user?.role === "Admin" && (
            <>
              <Link to="/admin/dashboard" className="nav-btn">Dashboard</Link>
              <Link to="/admin/manage-users" className="nav-btn">Users</Link>
              <Link to="/admin/issues" className="nav-btn">Issues</Link>
              <button onClick={logout} className="nav-btn logout-btn">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;