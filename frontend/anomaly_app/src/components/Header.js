import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import "../resources/output.css";
import logo from "../resources/hospital-empanelment.png";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "/dashboard/users/logout",
        {},
        {
          withCredentials: true,
        }
      );

      logout(); // Update the state/context to reflect logout
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed", error.response);
    }
  };

  return (
    <header className="flex justify-between items-center bg-zinc-900 rounded-lg max-w-screen p-2 m-2">
      <div>
        <Link to="/dashboard">
          <img src={logo} alt="Logo" className="w-[100px] h-fit" />
        </Link>
      </div>
      <div className="text-white">
        {user && <span>Hello, {user.username}</span>}
      </div>
      <div className="text-white text-sm p-2">
        <button>Settings</button>
        <div>
          {user ? (
            <>
              <Link to="/account-detail">Account</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
