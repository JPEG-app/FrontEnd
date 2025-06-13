import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTwitter } from 'react-icons/fa';
import axios from 'axios'; // Using the standard axios import, as in the original

const SignupPage: React.FC = () => {
    // State for all three required fields
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [passwordhash, setPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Using the full, hardcoded URL, identical in style to the original LoginPage
            const response = await axios.post('https://api.jpegapp.lol/auth/register', {
                username,
                email,
                passwordhash,
            });

            console.log('Registration successful:', response.data);

            // After successful registration, redirect the user to the login page
            navigate('/login');

        } catch (err: any) {
            // Update the error message to be more relevant for registration
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            console.error("Registration error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-gray-100 px-4">
            <div className="w-full max-w-md p-8 space-y-6">
                {/* Logo - Identical to LoginPage */}
                <div className="flex justify-center text-sky-500 mb-6">
                    <FaTwitter size={40} />
                </div>

                {/* Title updated for registration */}
                <h1 className="text-2xl font-bold text-center">Create your account</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username Input */}
                    <div>
                        <label htmlFor="username" className="sr-only">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                            placeholder="Username"
                            className="w-full px-4 py-2 border border-gray-700 rounded-md bg-black text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-twitter-blue focus:border-transparent disabled:opacity-50"
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            placeholder="Email"
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
                            autoComplete="new-password"
                            required
                            value={passwordhash}
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
                            {isLoading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </div>

                    {/* Link updated to point back to the Login page */}
                    <div className="text-center text-sm pt-2">
                        <span className="text-gray-400">Already have an account? </span>
                        <Link
                            to="/login"
                            className="font-medium text-twitter-blue hover:underline"
                        >
                            Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;