import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword'; 
import './index.css'; 
const img = 'url("https://images.squarespace-cdn.com/content/v1/6541874d1e536d4a5a63bc9e/427caf30-d00d-4088-835b-2f6be1b3dfc4/Bostock-Apple-Harvest-Royal-Gala-070.jpg")';
const App = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center" 
      style={{ backgroundImage: img }}
    >
      <Router>
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
