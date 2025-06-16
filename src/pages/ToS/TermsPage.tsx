import React from 'react';

const TermsPage: React.FC = () => (
    <div className="min-h-screen bg-black text-gray-100 px-6 py-10">
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-twitter-blue mb-6">Terms of Service</h1>

            <p className="mb-4">
                By using JPEG (Just Post Everything), you agree to comply with these Terms of Service. These terms govern your access to and use of the JPEG application and services.
            </p>

            <h2 className="text-xl font-semibold text-twitter-blue mb-2">1. Account Registration</h2>
            <p className="mb-4">
                You must be at least 13 years old to use this service. You agree to provide accurate and complete information when creating an account, including a valid email address.
            </p>

            <h2 className="text-xl font-semibold text-twitter-blue mb-2">2. User Responsibilities</h2>
            <p className="mb-4">
                You are solely responsible for the content you post. You agree not to post anything illegal, harmful, harassing, or infringing on the rights of others.
            </p>

            <h2 className="text-xl font-semibold text-twitter-blue mb-2">3. Prohibited Activities</h2>
            <p className="mb-4">
                You may not use JPEG to spam, phish, impersonate others, or perform any unauthorized access or reverse engineering of the platform.
            </p>

            <h2 className="text-xl font-semibold text-twitter-blue mb-2">4. Termination</h2>
            <p className="mb-4">
                We reserve the right to suspend or terminate accounts at any time for violations of these terms or abuse of the platform.
            </p>

            <h2 className="text-xl font-semibold text-twitter-blue mb-2">5. Changes to Terms</h2>
            <p className="mb-4">
                We may update these Terms from time to time. Continued use of the service implies acceptance of the updated terms.
            </p>

            <p className="text-sm text-gray-400">
                Effective date: June 16, 2025
            </p>
        </div>
    </div>
);

export default TermsPage;
