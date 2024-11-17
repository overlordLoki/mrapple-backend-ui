import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, loginWithGoogle } from './Api';
import { GoogleLogin } from '@react-oauth/google';

interface LoginProps {
  setUserId: (userId: number) => void;
}

const Login = ({ setUserId }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser({ user_name: username, password });
      setLoading(false);

      if (response.message === 'Login successful') {
        const userId = response.user_id;
        localStorage.setItem('userId', userId.toString());
        setUserId(userId);
        navigate('/dashboard');
      } else {
        setErrorMessage('Invalid username or password.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  const handleGoogleLoginSuccess = async (response: any) => {
    if (!response.credential) {
      setErrorMessage('Google login response is missing a credential.');
      return;
    }
    setLoading(true);

    try {
      const backendResponse = await loginWithGoogle(response.credential);
      setLoading(false);

      if (backendResponse.user_id) {
        localStorage.setItem('userId', backendResponse.user_id.toString());
        setUserId(backendResponse.user_id);
        navigate('/dashboard');
      } else {
        setErrorMessage('Google login failed. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Google login error:', error);
      setErrorMessage('Google login failed. Please try again.');
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Google login error');
    setErrorMessage('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
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
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
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
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white py-2 rounded transition duration-200`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {errorMessage && (
          <p className="mt-4 text-red-500 text-center">{errorMessage}</p>
        )}

        <div className="mt-4 text-center space-y-4">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />

          <p className="text-sm">
            Not registered?{' '}
            <Link to="/register" className="text-red-500 hover:underline">
              Register here
            </Link>
          </p>
          <p className="text-sm">
            <Link to="/forgot-password" className="text-red-500 hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
