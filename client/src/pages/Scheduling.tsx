import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Scheduling: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Employee Scheduling
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Create and manage employee work schedules. Track shift assignments, 
          time-off requests, and schedule conflicts.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Scheduling;
