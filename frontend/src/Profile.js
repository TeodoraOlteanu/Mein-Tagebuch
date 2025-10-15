import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        newPassword: ''
    });
    const [error, setError] = useState('');
    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:3001/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser({
                ...user,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:3001/profile', {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleDeleteAccount = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete('http://localhost:3001/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.removeItem('token');
            alert('Account deleted successfully');
            window.location.href = '/login'; // Redirect to the login page
        } catch (error) {
            console.error('Error deleting account:', error);
            setError('Failed to delete account');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={user.name} onChange={handleChange} />
                </div>
                <div>
                    <label>Surname:</label>
                    <input type="text" name="surname" value={user.surname} onChange={handleChange} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={user.email} onChange={handleChange} />
                </div>
                <div>
                    <label>New Password:</label>
                    <input type="password" name="newPassword" value={user.newPassword} onChange={handleChange} />
                </div>
                <button type="submit">Update Profile</button>
            </form>
            <button onClick={handleDeleteAccount} style={{ marginTop: '20px', color: 'red' }}>Delete Account</button>
        </div>
    );
}

export default Profile;
