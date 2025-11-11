import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App';
import { DealsProvider } from './contexts/DealsContext';
import { CreditApplicationsProvider } from './contexts/CreditApplicationsContext';
import './theme/mobileDataGrid.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DealsProvider>
          <CreditApplicationsProvider>
            <App />
          </CreditApplicationsProvider>
        </DealsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
