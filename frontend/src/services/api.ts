const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
    async getSettings() {
        const response = await fetch(`${API_URL}/api/settings`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        return response.json();
    },

    async updateSettings(settings: any) {
        const response = await fetch(`${API_URL}/api/settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settings),
        });
        if (!response.ok) throw new Error('Failed to update settings');
        return response.json();
    },

    async getXeroAuthUrl() {
        const response = await fetch(`${API_URL}/api/xero/auth-url`);
        if (!response.ok) throw new Error('Failed to get Xero auth URL');
        return response.json();
    },

    async handleXeroCallback(code: string) {
        const response = await fetch(`${API_URL}/api/xero/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });
        if (!response.ok) throw new Error('Failed to handle Xero callback');
        return response.json();
    },

    async refreshXeroToken() {
        const response = await fetch(`${API_URL}/api/xero/refresh-token`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to refresh Xero token');
        return response.json();
    },
}; 