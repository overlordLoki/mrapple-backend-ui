import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const URL = 'https://mrapple-backend.overlord-loki.com/';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        // Add registration API logic here
        const response = await fetch(URL+'Register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, address }),
        });
        const data = await response.json();
        if (data.success) {
            navigate('/login');
        } else {
            alert('Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={handleRegister} className="space-y-4">
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
                <div>
                    <label htmlFor="address" className="block">Address</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
