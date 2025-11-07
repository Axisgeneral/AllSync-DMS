import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Leads: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Leads Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Track and manage sales leads. This page will include lead capture forms, 
          lead scoring, follow-up tracking, and conversion analytics.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Leads;
