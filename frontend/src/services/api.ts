const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Settings {
    dextApiKey: string | null;
    xeroClientId: string | null;
    xeroClientSecret: string | null;
    openaiApiKey: string | null;
    googleCloudVisionCredentials: any | null;
}

export const settingsApi = {
    async getSettings(): Promise<Settings> {
        const response = await fetch(`${API_URL}/api/settings`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        return response.json();
    },

    async updateSettings(settings: Partial<Settings>): Promise<void> {
        const response = await fetch(`${API_URL}/api/settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settings),
        });
        if (!response.ok) throw new Error('Failed to update settings');
    },
};

export const xeroApi = {
    async getXeroAuthUrl(): Promise<{ authUrl: string }> {
        const response = await fetch(`${API_URL}/api/xero/auth-url`);
        if (!response.ok) throw new Error('Failed to get Xero auth URL');
        return response.json();
    },

    async handleXeroCallback(code: string): Promise<void> {
        const response = await fetch(`${API_URL}/api/xero/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });
        if (!response.ok) throw new Error('Failed to handle Xero callback');
    },

    async refreshXeroToken(): Promise<void> {
        const response = await fetch(`${API_URL}/api/xero/refresh-token`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to refresh Xero token');
    },
}; 