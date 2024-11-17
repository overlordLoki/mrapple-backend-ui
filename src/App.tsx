import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import Login from './login/Login';
import Dashboard from './dashboard/Dashboard';
import Register from './login/Register';
import ForgotPassword from './login/ForgotPassword';
import './index.css';
import { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider

const img = 'url("/bg.jpg")';
const NavigationBar = () => {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    alert('You have successfully logged out.');
    localStorage.removeItem('userId'); // Clear userId from localStorage
    navigate("/login");
  };

  return (
    <div className="bg-green-700 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">Dashboard</Link>
        <div className="space-x-4">
          <Link to="/register" className="hover:text-gray-300">Register</Link>
          <Link to="/login" className="hover:text-gray-300">Login</Link>
          <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('userId');
    if (user) {
      setUserId(Number(user)); // If userId is found in localStorage, use it
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div 
        className="min-h-screen bg-cover bg-center" 
        style={{ backgroundImage: img }}
      >
        <Router>
          {/* Navigation Bar */}
          <NavigationBar />

          <Routes>
            <Route path="/" element={<Login setUserId={setUserId} />} />
            <Route path="/login" element={<Login setUserId={setUserId} />} />
            <Route path="/dashboard" element={userId ? <Dashboard userId={userId} /> : <Login setUserId={setUserId} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Router>
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
