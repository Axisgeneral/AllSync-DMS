import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PartsManagement: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Parts Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Manage parts inventory. Track parts stock levels, ordering, pricing, 
          and parts suppliers.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PartsManagement;
