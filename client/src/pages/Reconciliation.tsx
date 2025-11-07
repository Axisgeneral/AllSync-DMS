import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Reconciliation: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Account Reconciliation
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Reconcile bank accounts, credit card accounts, and other financial accounts. 
          Track discrepancies and ensure accurate financial reporting.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Reconciliation;
