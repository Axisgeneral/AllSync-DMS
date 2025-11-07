import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const LenderManagement: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Lender Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Manage relationships with financing partners. Track lender rates, 
          approval rates, and lending programs.
        </Typography>
      </Paper>
    </Box>
  );
};

export default LenderManagement;
