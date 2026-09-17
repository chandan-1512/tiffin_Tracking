import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <nav>
      <Link className="brand" to="/">TiffinTrack</Link>
      <div>
        {role === "OWNER" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/customers">Customers</Link>
            <Link to="/import">Import</Link>
          </>
        )}

        {role === "CUSTOMER" && <Link to="/my-account">My Account</Link>}

        {role && (
          <button onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
