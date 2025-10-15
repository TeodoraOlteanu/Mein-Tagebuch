import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        navigate('/login'); // Redirect to the login page
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;
