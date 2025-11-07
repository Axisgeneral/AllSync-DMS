import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Trades: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Trade-In Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Manage trade-in vehicles. Appraise trade values, track reconditioning needs, 
          and monitor trade-in inventory.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Trades;
