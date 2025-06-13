import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTwitter, FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import axios from 'axios';

const SignupPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [passwordhash, setPassword] = useState('');
    
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (passwordhash !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('https://api.jpegapp.lol/auth/register', {
                username,
                email,
                passwordhash,
            });

            console.log('Registration successful:', response.data);
            navigate('/login');

        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            console.error("Registration error:", err);
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

                    <div className="relative">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            value={passwordhash}
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

                    <div className="relative">
                        <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                            placeholder="Confirm Password"
                            className="w-full px-4 py-2 pr-10 border border-gray-700 rounded-md bg-black text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-twitter-blue focus:border-transparent disabled:opacity-50"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-300"
                            aria-label="Toggle confirm password visibility"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
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

                    {/* Link to Login */}
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