import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { settingsApi } from '../services/api';

const XeroCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        if (!code) {
          throw new Error('No authorization code received');
        }

        await settingsApi.handleXeroCallback(code);
        navigate('/settings');
      } catch (err) {
        setError('Failed to complete Xero authentication');
        console.error('Xero callback error:', err);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
    >
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Completing Xero authentication...
      </Typography>
    </Box>
  );
};

export default XeroCallback; 