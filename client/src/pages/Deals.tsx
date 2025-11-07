import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Deals: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Deals Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Manage all active and completed deals. Track deal stages, paperwork status, 
          delivery schedules, and deal profitability.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Deals;
