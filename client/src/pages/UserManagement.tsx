import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const UserManagement: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        User Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Manage system user accounts, roles, and permissions. Configure access levels 
          and security settings for different user types.
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserManagement;
