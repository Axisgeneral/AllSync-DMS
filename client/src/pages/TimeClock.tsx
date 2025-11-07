import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const TimeClock: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Time Clock
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Employee time tracking system. Clock in/out, track hours worked, 
          breaks, and overtime.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TimeClock;
