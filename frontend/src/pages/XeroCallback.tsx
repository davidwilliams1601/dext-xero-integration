import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { xeroApi } from '../services/api';

const XeroCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            if (!code) {
                setError('No authorization code received');
                return;
            }

            try {
                await xeroApi.handleXeroCallback(code);
                navigate('/settings');
            } catch (err) {
                setError('Failed to complete Xero authentication');
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
                <button
                    onClick={() => navigate('/settings')}
                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Return to Settings
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Completing Xero Authentication...</h1>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
        </div>
    );
};

export default XeroCallback; 