import React, { useEffect, useState } from 'react';
import { settingsApi, Settings } from '../services/api';

const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<Settings>({
        dextApiKey: null,
        xeroClientId: null,
        xeroClientSecret: null,
        openaiApiKey: null,
        googleCloudVisionCredentials: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await settingsApi.getSettings();
            setSettings(data);
        } catch (error) {
            console.error('Error loading settings:', error);
            setError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await settingsApi.updateSettings(settings);
            setSuccess('Settings updated successfully');
        } catch (error) {
            console.error('Error updating settings:', error);
            setError('Failed to update settings');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings((prev: Settings) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
                    
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {success && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="dextApiKey" className="block text-sm font-medium text-gray-700">
                                Dext API Key
                            </label>
                            <input
                                type="password"
                                id="dextApiKey"
                                name="dextApiKey"
                                value={settings.dextApiKey || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="xeroClientId" className="block text-sm font-medium text-gray-700">
                                Xero Client ID
                            </label>
                            <input
                                type="text"
                                id="xeroClientId"
                                name="xeroClientId"
                                value={settings.xeroClientId || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="xeroClientSecret" className="block text-sm font-medium text-gray-700">
                                Xero Client Secret
                            </label>
                            <input
                                type="password"
                                id="xeroClientSecret"
                                name="xeroClientSecret"
                                value={settings.xeroClientSecret || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="openaiApiKey" className="block text-sm font-medium text-gray-700">
                                OpenAI API Key
                            </label>
                            <input
                                type="password"
                                id="openaiApiKey"
                                name="openaiApiKey"
                                value={settings.openaiApiKey || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="googleCloudVisionCredentials" className="block text-sm font-medium text-gray-700">
                                Google Cloud Vision Credentials (JSON)
                            </label>
                            <textarea
                                id="googleCloudVisionCredentials"
                                name="googleCloudVisionCredentials"
                                value={settings.googleCloudVisionCredentials ? JSON.stringify(settings.googleCloudVisionCredentials, null, 2) : ''}
                                onChange={handleChange}
                                rows={10}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                                placeholder="Paste your Google Cloud Vision credentials JSON here"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                This should be the contents of your Google Cloud Vision service account key file
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Save Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage; 