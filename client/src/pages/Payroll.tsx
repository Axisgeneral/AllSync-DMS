import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Payroll: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Payroll Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Process payroll, calculate wages, commissions, and deductions. 
          Generate pay stubs and manage tax withholdings.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Payroll;
