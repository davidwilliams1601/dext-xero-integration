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
        } catch (err) {
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
        } catch (err) {
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
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Dext API Key
                    </label>
                    <input
                        type="password"
                        name="dextApiKey"
                        value={settings.dextApiKey || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Xero Client ID
                    </label>
                    <input
                        type="text"
                        name="xeroClientId"
                        value={settings.xeroClientId || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Xero Client Secret
                    </label>
                    <input
                        type="password"
                        name="xeroClientSecret"
                        value={settings.xeroClientSecret || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        OpenAI API Key
                    </label>
                    <input
                        type="password"
                        name="openaiApiKey"
                        value={settings.openaiApiKey || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Google Cloud Vision Credentials (JSON)
                    </label>
                    <textarea
                        name="googleCloudVisionCredentials"
                        value={settings.googleCloudVisionCredentials ? JSON.stringify(settings.googleCloudVisionCredentials, null, 2) : ''}
                        onChange={handleChange}
                        rows={10}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
                        placeholder="Paste your Google Cloud Vision credentials JSON here"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        This should be the contents of your Google Cloud Vision service account key file
                    </p>
                </div>

                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Save Settings
                </button>
            </form>
        </div>
    );
};

export default SettingsPage; 