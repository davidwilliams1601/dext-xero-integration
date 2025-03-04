import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { settingsApi, Settings as SettingsType } from '../services/api';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsType>({
    dextApiKey: '',
    xeroClientId: '',
    xeroClientSecret: '',
    openaiApiKey: '',
    googleCloudVisionCredentials: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getSettings();
      setSettings(data);
    } catch (err) {
      setError('Failed to load settings');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await settingsApi.updateSettings(settings);
      setSuccess(true);
    } catch (err) {
      setError('Failed to save settings');
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleXeroAuth = async () => {
    try {
      const authUrl = await settingsApi.getXeroAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to initiate Xero authentication');
      console.error('Error getting Xero auth URL:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Settings saved successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dext API Key"
                name="dextApiKey"
                value={settings.dextApiKey}
                onChange={handleChange}
                type="password"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Xero Client ID"
                name="xeroClientId"
                value={settings.xeroClientId}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Xero Client Secret"
                name="xeroClientSecret"
                value={settings.xeroClientSecret}
                onChange={handleChange}
                type="password"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleXeroAuth}
                sx={{ mr: 2 }}
              >
                Authenticate with Xero
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="OpenAI API Key"
                name="openaiApiKey"
                value={settings.openaiApiKey}
                onChange={handleChange}
                type="password"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Google Cloud Vision Credentials"
                name="googleCloudVisionCredentials"
                value={settings.googleCloudVisionCredentials}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                Save Settings
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Settings; 