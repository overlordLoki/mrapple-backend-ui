import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URL = 'https://mrapple-backend.overlord-loki.com/';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${URL}register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_name: username, password, address }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccessMessage('Registration successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setErrorMessage(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred during registration. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
                <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
                <form onSubmit={handleRegister} className="space-y-4">
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
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium">Address</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition duration-200"
                    >
                        Register
                    </button>
                </form>

                {errorMessage && <p className="mt-4 text-red-500 text-center">{errorMessage}</p>}
                {successMessage && <p className="mt-4 text-green-500 text-center">{successMessage}</p>}

                <div className="mt-4 text-center">
                    <button 
                        onClick={() => navigate('/login')} 
                        className="text-sm text-red-500 hover:underline"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
