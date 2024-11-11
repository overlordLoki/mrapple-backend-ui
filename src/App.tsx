import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import './index.css'; 
const img = 'url("https://images.squarespace-cdn.com/content/v1/6541874d1e536d4a5a63bc9e/427caf30-d00d-4088-835b-2f6be1b3dfc4/Bostock-Apple-Harvest-Royal-Gala-070.jpg")';

const NavigationBar = () => {
  const navigate = useNavigate();  // useNavigate hook should be inside a functional component rendered by Router

  // Logout handler
  const handleLogout = () => {
    alert('You have successfully logged out.');
    navigate("/login");
  };

  return (
    <div className="bg-green-800 text-white p-4 shadow-md">
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
  return (
    <div 
      className="min-h-screen bg-cover bg-center" 
      style={{ backgroundImage: img }}
    >
      <Router>
        {/* Navigation Bar */}
        <NavigationBar />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
