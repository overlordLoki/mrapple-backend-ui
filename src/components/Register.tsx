import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from './Api'; // Importing the API function

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    // Validate password length before submitting
    const validatePassword = (password: string) => {
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters.');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure password is valid before submitting
        if (!validatePassword(password)) return;

        try {
            await registerUser({ user_name: username, password, address, email });
            setSuccessMessage('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error: any) {
            setErrorMessage(error.message || 'Registration failed. Please try again.');
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
                        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
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
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
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
