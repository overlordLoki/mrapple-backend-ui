import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URL = 'https://mrapple-backend.overlord-loki.com/';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${URL}forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const error = await response.text();
                setErrorMessage(
                    error.includes('Not Found')
                        ? 'The email address you entered is not registered.'
                        : 'Failed to request password reset. Please try again.'
                );
                return;
            }

            const data = await response.json();
            if (data.success) {
                setMessage('Password reset email sent. Please check your inbox.');
                setTimeout(() => navigate('/login'), 5000);
            } else {
                setErrorMessage(data.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-start p-6">
            <div className="max-w-md w-full bg-white p-8 rounded shadow-md mt-10">
                <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm">Email Address</label>
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
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
                    >
                        Reset Password
                    </button>
                </form>

                {message && <p className="mt-4 text-green-500 text-sm text-center">{message}</p>}
                {errorMessage && <p className="mt-4 text-red-500 text-sm text-center">{errorMessage}</p>}

                <div className="mt-4 text-center">
                    <p className="text-sm">
                        Remembered your password?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-red-500 hover:underline"
                        >
                            Go to Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
