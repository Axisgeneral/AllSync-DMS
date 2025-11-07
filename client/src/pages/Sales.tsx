import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import axios from 'axios';

const Sales: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    customerName: '',
    vehicleInfo: '',
    salePrice: 0,
    downPayment: 0,
    tradeInValue: 0,
    financeType: 'Cash',
    salesPerson: '',
    status: 'Pending',
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get('/api/sales');
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const handleOpen = (mode: 'add' | 'edit' | 'view', sale?: any) => {
    setViewMode(mode);
    if (sale) {
      setSelectedSale(sale);
      setFormData(sale);
    } else {
      setSelectedSale(null);
      setFormData({
        customerName: '',
        vehicleInfo: '',
        salePrice: 0,
        downPayment: 0,
        tradeInValue: 0,
        financeType: 'Cash',
        salesPerson: '',
        status: 'Pending',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSale(null);
  };

  const handleSubmit = async () => {
    try {
      if (viewMode === 'add') {
        await axios.post('/api/sales', formData);
      } else if (viewMode === 'edit') {
        await axios.put(`/api/sales/${selectedSale.id}`, formData);
      }
      fetchSales();
      handleClose();
    } catch (error) {
      console.error('Error saving sale:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await axios.delete(`/api/sales/${id}`);
        fetchSales();
      } catch (error) {
        console.error('Error deleting sale:', error);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'dealNumber', headerName: 'Deal #', width: 120 },
    { field: 'customerName', headerName: 'Customer', width: 150 },
    { field: 'vehicleInfo', headerName: 'Vehicle', width: 180 },
    {
      field: 'salePrice',
      headerName: 'Price',
      width: 120,
      valueFormatter: (params: any) => `$${params.toLocaleString()}`,
    },
    { field: 'salesPerson', headerName: 'Sales Person', width: 150 },
    { field: 'saleDate', headerName: 'Date', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: any) => (
        <Chip
          label={params.value}
          color={params.value === 'Completed' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: any) => (
        <Box>
          <IconButton size="small" onClick={() => handleOpen('view', params.row)}>
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleOpen('edit', params.row)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Sales Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen('add')}
        >
          New Sale
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={sales}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode === 'add' ? 'New Sale' : viewMode === 'edit' ? 'Edit Sale' : 'View Sale'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vehicle Info"
                value={formData.vehicleInfo}
                onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sale Price"
                type="number"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Down Payment"
                type="number"
                value={formData.downPayment}
                onChange={(e) => setFormData({ ...formData, downPayment: parseFloat(e.target.value) })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trade-In Value"
                type="number"
                value={formData.tradeInValue}
                onChange={(e) => setFormData({ ...formData, tradeInValue: parseFloat(e.target.value) })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Finance Type"
                value={formData.financeType}
                onChange={(e) => setFormData({ ...formData, financeType: e.target.value })}
                disabled={viewMode === 'view'}
              >
                {['Cash', 'Loan', 'Lease'].map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sales Person"
                value={formData.salesPerson}
                onChange={(e) => setFormData({ ...formData, salesPerson: e.target.value })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                disabled={viewMode === 'view'}
              >
                {['Pending', 'Completed', 'Cancelled'].map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {viewMode !== 'view' && (
            <Button onClick={handleSubmit} variant="contained">
              {viewMode === 'add' ? 'Create' : 'Save'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sales;
