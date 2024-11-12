import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // Add Link import
import { loginUser } from './Api';  // Import loginUser from Api.ts

interface LoginProps {
  setUserId: (userId: number) => void;
}

const Login = ({ setUserId }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await loginUser({ user_name: username, password });
  
      if (response.message === 'Login successful') {
        const userId = response.user_id; // Change this to user_id
        localStorage.setItem('userId', userId.toString()); // Store userId in localStorage
        setUserId(userId);
        navigate('/dashboard');
      } else {
        setErrorMessage('Login failed, please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition duration-200"
          >
            Login
          </button>
        </form>

        {errorMessage && (
          <p className="mt-4 text-red-500 text-center">{errorMessage}</p>
        )}

        <div className="mt-4 text-center space-y-2">
          <p className="text-sm">
            Not registered? <Link to="/register" className="text-red-500 hover:underline">Register here</Link>
          </p>
          <p className="text-sm">
            <Link to="/forgot-password" className="text-red-500 hover:underline">Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
