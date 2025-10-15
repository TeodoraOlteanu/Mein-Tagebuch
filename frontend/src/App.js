import React from 'react';
import Signup from './Signup';
import Login from './Login';
import EmailVerify from './EmailVerify'
import ABCModel from './ABCModel';
import ABCDetail from './ABCDetail';
import Navbar from './Navbar.js';
import ProtectedRoute from './ProtectedRoute';
import Profile from './Profile.js'; // Adjust path as necessary


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar></Navbar>
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path='/users/verify/:token' element={<EmailVerify />} />
      <Route path='/abc' element={<ProtectedRoute element={<ABCModel />} />} />
      <Route path="/abc/:abcId" element={<ProtectedRoute element={<ABCDetail />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

    </Routes>
    </Router>
  );
}

export default App;
