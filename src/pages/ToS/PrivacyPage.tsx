import React from 'react';

const PrivacyPage: React.FC = () => (
    <div className="min-h-screen bg-black text-gray-100 px-6 py-10">
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-twitter-blue mb-6">Privacy Policy</h1>

            <p className="mb-4">
                At JPEG, we respect your privacy and are committed to protecting your personal information. This policy outlines what we collect, how we use it, and your rights.
            </p>

            <h2 className="text-xl font-semibold text-twitter-blue mb-2">1. Information We Collect</h2>
            <p className="mb-4">
                When you register, we collect your username, email address, and password. No other personal information is required or collected.
            </p>

            <h2 className="text-xl font-semibold text-twitter-blue mb-2">2. Cookies</h2>
            <p className="mb-4">
                We do not use cookies for tracking. A cookie is only used to store your session JWT token securely after login.
            </p>

            <h2 className="text-xl font-semibold text-twitter-blue mb-2">3. Email Communication</h2>
            <p className="mb-4">
                JPEG does not send any emails. You will not receive newsletters, confirmations, or marketing messages from us.
            </p>

            <h2 className="text-xl font-semibold text-twitter-blue mb-2">4. Data Security</h2>
            <p className="mb-4">
                Your information is stored securely and never shared with third parties. Passwords are hashed and never stored in plain text.
            </p>

            <h2 className="text-xl font-semibold text-twitter-blue mb-2">5. Your Rights (GDPR)</h2>
            <p className="mb-4">
                If you are located in the EU, you have the right to access, correct, or delete your data. You may contact us at any time to request this.
            </p>

            <p className="text-sm text-gray-400">
                Effective date: June 16, 2025
            </p>
        </div>
    </div>
);

export default PrivacyPage;
