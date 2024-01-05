import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to="/dashboard">
                    <img src="hms_logo.jpg" alt="Logo" style={{ height: '50px' }} />
                </Link>
            </div>
            <div className="username">
                {user && <span>Hello, {user.username}</span>} {/* Centered user's name */}
            </div>
            <div className="settings-dropdown">
                <button className="dropdown-button">Settings</button>
                <div className="dropdown-content">
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
