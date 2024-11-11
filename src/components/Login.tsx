import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const URL = 'https://mrapple-backend.overlord-loki.com/';  // Your API base URL

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
          const response = await fetch(URL + 'login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ user_name: username, password: password }), // Ensure the correct keys
          });
  
          // Check if the response is not ok (failure case)
          if (!response.ok) {
              const errorMessage = await response.text(); // Handle plain text error messages
              setErrorMessage(errorMessage || 'Login failed');
              return;
          }
  
          // If response is OK, handle the success case
          const data = await response.json(); // Expecting JSON for success message
          if (data.message === 'Login successful') {  // Check the `message` field
              navigate('/dashboard');
          } else {
              setErrorMessage('Login failed');
          }
      } catch (error) {
          console.error('Login error:', error);
          setErrorMessage('An error occurred. Please try again.'); // Handle errors like network failure
      }
  };
  

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                    Login
                </button>
            </form>

            {/* Show error message if any */}
            {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
        </div>
    );
};

export default Login;
