import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import Settings from './pages/Settings';
import XeroCallback from './pages/XeroCallback';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Dext to Xero
              </Typography>
              <Button
                color="inherit"
                component={Link}
                to="/settings"
                startIcon={<SettingsIcon />}
              >
                Settings
              </Button>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Routes>
              <Route path="/settings" element={<Settings />} />
              <Route path="/xero/callback" element={<XeroCallback />} />
              {/* Add more routes here as we create more pages */}
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
