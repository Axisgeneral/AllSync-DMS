import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const DealManagement: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        F&I Deal Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Manage finance and insurance products. Track product sales, 
          warranties, gap insurance, and aftermarket products.
        </Typography>
      </Paper>
    </Box>
  );
};

export default DealManagement;
