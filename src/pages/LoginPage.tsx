import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTwitter, FaEye, FaEyeSlash } from 'react-icons/fa'; 
import axios from 'axios';
import { useAuthContext } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const { login } = useAuthContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('https://api.jpegapp.lol/auth/login', { email: username, password: password });
            
            const { token, streamToken } = response.data;
            if (token && streamToken) {
                await login(token, streamToken);
                navigate('/');
            } else {
                throw new Error("Login successful, but tokens were not provided by the server.");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-gray-100 px-4">
            <div className="w-full max-w-md p-8 space-y-6">
                <div className="flex justify-center text-sky-500 mb-6">
                    <FaTwitter size={40} />
                </div>

                <h1 className="text-2xl font-bold text-center">Log in</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="sr-only">Email</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                            placeholder="Email"
                            className="w-full px-4 py-2 border border-gray-700 rounded-md bg-black text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-twitter-blue focus:border-transparent disabled:opacity-50"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'} 
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            placeholder="Password"
                            className="w-full px-4 py-2 pr-10 border border-gray-700 rounded-md bg-black text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-twitter-blue focus:border-transparent disabled:opacity-50"
                        />
                        <button
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-300"
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2 font-bold text-white bg-twitter-blue rounded-full hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-twitter-blue transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Logging in...' : 'Log in'}
                        </button>
                    </div>

                    <div className="flex items-center justify-end text-sm">
                        <Link
                            to="/register"
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