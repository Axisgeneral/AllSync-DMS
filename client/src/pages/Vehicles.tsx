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
  Chip,
  IconButton,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import axios from 'axios';

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    stockNumber: '',
    vin: '',
    year: new Date().getFullYear(),
    make: '',
    model: '',
    trim: '',
    type: 'Sedan',
    condition: 'New',
    mileage: 0,
    exteriorColor: '',
    interiorColor: '',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    price: 0,
    cost: 0,
    status: 'Available',
    location: 'Main Lot',
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('/api/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleOpen = (mode: 'add' | 'edit' | 'view', vehicle?: any) => {
    setViewMode(mode);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setFormData(vehicle);
    } else {
      setSelectedVehicle(null);
      setFormData({
        stockNumber: '',
        vin: '',
        year: new Date().getFullYear(),
        make: '',
        model: '',
        trim: '',
        type: 'Sedan',
        condition: 'New',
        mileage: 0,
        exteriorColor: '',
        interiorColor: '',
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        price: 0,
        cost: 0,
        status: 'Available',
        location: 'Main Lot',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVehicle(null);
  };

  const handleSubmit = async () => {
    try {
      if (viewMode === 'add') {
        await axios.post('/api/vehicles', formData);
      } else if (viewMode === 'edit') {
        await axios.put(`/api/vehicles/${selectedVehicle.id}`, formData);
      }
      fetchVehicles();
      handleClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await axios.delete(`/api/vehicles/${id}`);
        fetchVehicles();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'stockNumber', headerName: 'Stock #', width: 120 },
    { field: 'year', headerName: 'Year', width: 80 },
    { field: 'make', headerName: 'Make', width: 120 },
    { field: 'model', headerName: 'Model', width: 150 },
    { field: 'trim', headerName: 'Trim', width: 100 },
    { field: 'condition', headerName: 'Condition', width: 100 },
    { field: 'mileage', headerName: 'Mileage', width: 100 },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      valueFormatter: (params) => `$${params.toLocaleString()}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Available' ? 'success' :
            params.value === 'Sold' ? 'default' : 'warning'
          }
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
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
          Vehicle Inventory
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen('add')}
        >
          Add Vehicle
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={vehicles}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode === 'add' ? 'Add Vehicle' : viewMode === 'edit' ? 'Edit Vehicle' : 'View Vehicle'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Number"
                value={formData.stockNumber}
                onChange={(e) => setFormData({ ...formData, stockNumber: e.target.value })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="VIN"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Make"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trim"
                value={formData.trim}
                onChange={(e) => setFormData({ ...formData, trim: e.target.value })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={viewMode === 'view'}
              >
                {['Sedan', 'SUV', 'Truck', 'Coupe', 'Van', 'Convertible'].map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Condition"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                disabled={viewMode === 'view'}
              >
                {['New', 'Used', 'Certified'].map((condition) => (
                  <MenuItem key={condition} value={condition}>{condition}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
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
                {['Available', 'Sold', 'Pending', 'On Hold'].map((status) => (
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
              {viewMode === 'add' ? 'Add' : 'Save'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vehicles;
