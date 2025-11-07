import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const GLMapping: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        General Ledger Mapping
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Configure general ledger account mappings for automated accounting entries. 
          Map transaction types to GL accounts.
        </Typography>
      </Paper>
    </Box>
  );
};

export default GLMapping;
