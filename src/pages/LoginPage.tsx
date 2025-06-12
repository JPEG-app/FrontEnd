import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTwitter } from 'react-icons/fa';
import axios from 'axios';
import { useAuthContext } from '../contexts/AuthContext';


const LoginPage: React.FC = () => {
    const { login } = useAuthContext();
    const [username, setUsername] = useState(''); // Can be username or email
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
        const response = await axios.post('https://jpeg.gateway/auth/login', { email: username, password: password });
        console.log('Login successful:', response.data);
        login({ username: response.data.username || username });
        navigate('/');
    } catch (err: any) {
        setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        console.error("Login error:", err);
    } finally {
        setIsLoading(false);
    }
    };

    return (
    <div className="flex items-center justify-center min-h-screen bg-black text-gray-100 px-4">
        <div className="w-full max-w-md p-8 space-y-6"> {/* Consider adding bg-gray-900 rounded-lg if you want a card effect */}
        {/* Logo */}
        <div className="flex justify-center text-sky-500 mb-6">
            <FaTwitter size={40} /> {/* Or your app's logo */}
        </div>

        <h1 className="text-2xl font-bold text-center">Log in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username/Email Input */}
            <div>
            <label htmlFor="username" className="sr-only">Username or Email</label>
            <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                placeholder="Username or Email"
                className="w-full px-4 py-2 border border-gray-700 rounded-md bg-black text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-twitter-blue focus:border-transparent disabled:opacity-50"
            />
            </div>

            {/* Password Input */}
            <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-700 rounded-md bg-black text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-twitter-blue focus:border-transparent disabled:opacity-50"
            />
            </div>

            {/* Error Message */}
            {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Submit Button */}
            <div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 font-bold text-white bg-twitter-blue rounded-full hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-twitter-blue transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Logging in...' : 'Log in'}
            </button>
            </div>

            {/* Links */}
            <div className="flex items-center justify-between text-sm">
            <Link
                to="/forgot-password" // Define this route later if needed
                className="font-medium text-twitter-blue hover:underline"
            >
                Forgot password?
            </Link>
            <Link
                to="/signup" // Define this route later if needed
                className="font-medium text-twitter-blue hover:underline"
            >
                Sign up
            </Link>
            </div>
        </form>
        </div>
    </div>
    );
};

export default LoginPage;


// application insights 