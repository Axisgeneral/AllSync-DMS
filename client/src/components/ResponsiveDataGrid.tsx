import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridColDef, DataGridProps } from '@mui/x-data-grid';

interface ResponsiveDataGridProps extends Omit<DataGridProps, 'columns'> {
  columns: GridColDef[];
  mobileColumns?: GridColDef[]; // Optional mobile-specific columns
}

/**
 * ResponsiveDataGrid - A wrapper around MUI DataGrid that optimizes for mobile devices
 * 
 * On mobile (screen width < 600px):
 * - Uses mobileColumns if provided, otherwise uses desktop columns
 * - Applies dense mode
 * - Reduces column widths
 * - Adjusts pagination
 * 
 * On desktop:
 * - Uses standard columns
 * - Standard spacing
 */
const ResponsiveDataGrid: React.FC<ResponsiveDataGridProps> = ({
  columns,
  mobileColumns,
  ...otherProps
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Use mobile columns if provided, otherwise use desktop columns
  const displayColumns = isMobile && mobileColumns ? mobileColumns : columns;

  // Adjust column widths for mobile if using desktop columns
  const adjustedColumns = isMobile && !mobileColumns
    ? displayColumns.map(col => ({
        ...col,
        width: col.width ? Math.min(col.width as number, 120) : 80,
        minWidth: 60,
      }))
    : displayColumns;

  return (
    <Box
      sx={{
        width: '100%',
        height: isMobile ? 'calc(100vh - 120px)' : 600, // Full height on mobile
        '& .MuiDataGrid-root': {
          border: 'none',
        },
      }}
    >
      <DataGrid
        {...otherProps}
        columns={adjustedColumns}
        density={isMobile ? 'compact' : 'standard'}
        pageSizeOptions={isMobile ? [10, 25] : [10, 25, 50, 100]}
        initialState={{
          ...otherProps.initialState,
          pagination: {
            paginationModel: {
              pageSize: isMobile ? 10 : 25,
            },
          },
        }}
        sx={{
          ...otherProps.sx,
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
        }}
      />
    </Box>
  );
};

export default ResponsiveDataGrid;
