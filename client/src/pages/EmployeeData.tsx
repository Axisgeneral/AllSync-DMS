import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const EmployeeData: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Employee Data Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Manage employee information including personal details, contact information, 
          emergency contacts, certifications, and employment history.
        </Typography>
      </Paper>
    </Box>
  );
};

export default EmployeeData;
