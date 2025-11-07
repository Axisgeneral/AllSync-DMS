import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ServiceOrders: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Service Orders
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Manage service repair orders. Track labor, parts, technician assignments, 
          and service completion status.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ServiceOrders;
