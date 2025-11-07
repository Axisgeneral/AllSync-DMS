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

const Service: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    customerName: '',
    vehicleInfo: '',
    serviceType: 'Maintenance',
    description: '',
    appointmentDate: '',
    appointmentTime: '',
    status: 'Scheduled',
    advisor: '',
    estimatedCost: 0,
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/service/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleOpen = (mode: 'add' | 'edit' | 'view', appointment?: any) => {
    setViewMode(mode);
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData(appointment);
    } else {
      setSelectedAppointment(null);
      setFormData({
        customerName: '',
        vehicleInfo: '',
        serviceType: 'Maintenance',
        description: '',
        appointmentDate: '',
        appointmentTime: '',
        status: 'Scheduled',
        advisor: '',
        estimatedCost: 0,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAppointment(null);
  };

  const handleSubmit = async () => {
    try {
      if (viewMode === 'add') {
        await axios.post('/api/service/appointments', formData);
      } else if (viewMode === 'edit') {
        await axios.put(`/api/service/appointments/${selectedAppointment.id}`, formData);
      }
      fetchAppointments();
      handleClose();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`/api/service/appointments/${id}`);
        fetchAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'appointmentNumber', headerName: 'Appt #', width: 100 },
    { field: 'customerName', headerName: 'Customer', width: 140 },
    { field: 'vehicleInfo', headerName: 'Vehicle', width: 150 },
    { field: 'serviceType', headerName: 'Type', width: 120 },
    { field: 'appointmentDate', headerName: 'Date', width: 120 },
    { field: 'appointmentTime', headerName: 'Time', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params: any) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Completed' ? 'success' :
            params.value === 'In Progress' ? 'primary' : 'default'
          }
          size="small"
        />
      ),
    },
    {
      field: 'estimatedCost',
      headerName: 'Cost',
      width: 100,
      valueFormatter: (params: any) => `$${params.toFixed(2)}`,
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
          Service & Appointments
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen('add')}
        >
          New Appointment
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={appointments}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode === 'add' ? 'New Appointment' : viewMode === 'edit' ? 'Edit Appointment' : 'View Appointment'}
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
                select
                label="Service Type"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                disabled={viewMode === 'view'}
              >
                {['Maintenance', 'Repair', 'Inspection', 'Recall'].map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Service Advisor"
                value={formData.advisor}
                onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Appointment Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Appointment Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.appointmentTime}
                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Cost"
                type="number"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: parseFloat(e.target.value) })}
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
                {['Scheduled', 'In Progress', 'Completed', 'Cancelled'].map((status) => (
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

export default Service;
