import React, { useState, useEffect, useMemo } from 'react';
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
  Card,
  CardContent,
  InputAdornment,
  Tooltip,
  Divider,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EventIcon from '@mui/icons-material/Event';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';

interface ServiceAppointment {
  id: number;
  appointmentNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  vin: string;
  mileage: number;
  serviceType: 'Oil Change' | 'Maintenance' | 'Repair' | 'Inspection' | 'Recall' | 'Diagnostic' | 'Tire Service';
  description: string;
  requestedServices: string[];
  appointmentDate: string;
  appointmentTime: string;
  status: 'Scheduled' | 'Checked In' | 'In Progress' | 'Awaiting Parts' | 'Completed' | 'Cancelled' | 'No Show';
  serviceAdvisor: string;
  assignedTechnician?: string;
  estimatedCost: number;
  estimatedCompletionTime?: string;
  actualCost?: number;
  laborHours?: number;
  partsTotal?: number;
  notes: string;
  createdDate: string;
  lastUpdated: string;
}

const Service: React.FC = () => {
  const [appointments, setAppointments] = useState<ServiceAppointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'add' | 'edit'>('add');
  const [selectedAppointment, setSelectedAppointment] = useState<ServiceAppointment | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAppointment, setMenuAppointment] = useState<ServiceAppointment | null>(null);
  const [formData, setFormData] = useState<Partial<ServiceAppointment>>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleYear: new Date().getFullYear(),
    vehicleMake: '',
    vehicleModel: '',
    vin: '',
    mileage: 0,
    serviceType: 'Maintenance',
    description: '',
    requestedServices: [],
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '09:00',
    status: 'Scheduled',
    serviceAdvisor: '',
    assignedTechnician: '',
    estimatedCost: 0,
    estimatedCompletionTime: '',
    notes: '',
  });

  // Mock data
  useEffect(() => {
    const mockAppointments: ServiceAppointment[] = [
      {
        id: 1,
        appointmentNumber: 'SVC-2025-001',
        customerName: 'John Smith',
        customerPhone: '(555) 123-4567',
        customerEmail: 'john.smith@email.com',
        vehicleYear: 2020,
        vehicleMake: 'Honda',
        vehicleModel: 'Accord',
        vin: '1HGCV1F30LA012345',
        mileage: 45000,
        serviceType: 'Maintenance',
        description: 'Routine maintenance - oil change and tire rotation',
        requestedServices: ['Oil Change', 'Tire Rotation', 'Multi-point Inspection'],
        appointmentDate: '2025-11-12',
        appointmentTime: '09:00',
        status: 'Scheduled',
        serviceAdvisor: 'Mike Johnson',
        assignedTechnician: 'Tom Rodriguez',
        estimatedCost: 89.99,
        estimatedCompletionTime: '10:30',
        notes: 'Customer prefers synthetic oil',
        createdDate: '2025-11-08',
        lastUpdated: '2025-11-08',
      },
      {
        id: 2,
        appointmentNumber: 'SVC-2025-002',
        customerName: 'Sarah Williams',
        customerPhone: '(555) 234-5678',
        customerEmail: 'sarah.w@email.com',
        vehicleYear: 2019,
        vehicleMake: 'Toyota',
        vehicleModel: 'Camry',
        vin: '4T1B11HK9KU123456',
        mileage: 62000,
        serviceType: 'Repair',
        description: 'Check engine light on - needs diagnostic',
        requestedServices: ['Diagnostic Scan', 'Oxygen Sensor Replacement'],
        appointmentDate: '2025-11-11',
        appointmentTime: '14:00',
        status: 'In Progress',
        serviceAdvisor: 'Lisa Chen',
        assignedTechnician: 'David Martinez',
        estimatedCost: 450.00,
        estimatedCompletionTime: '16:30',
        actualCost: 425.00,
        laborHours: 2.5,
        partsTotal: 275.00,
        notes: 'Found P0420 code - replacing catalytic converter',
        createdDate: '2025-11-09',
        lastUpdated: '2025-11-11',
      },
      {
        id: 3,
        appointmentNumber: 'SVC-2025-003',
        customerName: 'Robert Brown',
        customerPhone: '(555) 345-6789',
        customerEmail: 'rbrown@email.com',
        vehicleYear: 2021,
        vehicleMake: 'Ford',
        vehicleModel: 'F-150',
        vin: '1FTFW1E51MFA12345',
        mileage: 28000,
        serviceType: 'Inspection',
        description: 'State inspection due',
        requestedServices: ['State Inspection', 'Emissions Test'],
        appointmentDate: '2025-11-10',
        appointmentTime: '11:00',
        status: 'Completed',
        serviceAdvisor: 'Mike Johnson',
        assignedTechnician: 'James Wilson',
        estimatedCost: 35.00,
        estimatedCompletionTime: '11:45',
        actualCost: 35.00,
        laborHours: 0.5,
        partsTotal: 0,
        notes: 'Passed inspection',
        createdDate: '2025-11-05',
        lastUpdated: '2025-11-10',
      },
      {
        id: 4,
        appointmentNumber: 'SVC-2025-004',
        customerName: 'Emily Davis',
        customerPhone: '(555) 456-7890',
        customerEmail: 'emily.davis@email.com',
        vehicleYear: 2018,
        vehicleMake: 'Chevrolet',
        vehicleModel: 'Silverado',
        vin: '1GCVKREC9JZ123456',
        mileage: 75000,
        serviceType: 'Tire Service',
        description: 'New tire installation and alignment',
        requestedServices: ['Tire Installation', 'Wheel Alignment', 'Balance'],
        appointmentDate: '2025-11-13',
        appointmentTime: '13:00',
        status: 'Scheduled',
        serviceAdvisor: 'Lisa Chen',
        estimatedCost: 850.00,
        notes: 'Customer bringing own tires',
        createdDate: '2025-11-10',
        lastUpdated: '2025-11-10',
      },
      {
        id: 5,
        appointmentNumber: 'SVC-2025-005',
        customerName: 'Michael Johnson',
        customerPhone: '(555) 567-8901',
        customerEmail: 'mjohnson@email.com',
        vehicleYear: 2022,
        vehicleMake: 'Nissan',
        vehicleModel: 'Altima',
        vin: '1N4BL4BV4NC123456',
        mileage: 15000,
        serviceType: 'Recall',
        description: 'Recall service - brake system software update',
        requestedServices: ['Software Update', 'Brake System Inspection'],
        appointmentDate: '2025-11-14',
        appointmentTime: '10:00',
        status: 'Scheduled',
        serviceAdvisor: 'Mike Johnson',
        assignedTechnician: 'Tom Rodriguez',
        estimatedCost: 0,
        estimatedCompletionTime: '11:00',
        notes: 'Covered under recall - no charge',
        createdDate: '2025-11-08',
        lastUpdated: '2025-11-08',
      },
    ];
    setAppointments(mockAppointments);
  }, []);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filteredAppointments = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return appointments;
    }

    const searchTerm = normalizeText(trimmedQuery);

    return appointments.filter((appt) => {
      if (normalizeText(appt.appointmentNumber).includes(searchTerm)) return true;
      if (normalizeText(appt.customerName).includes(searchTerm)) return true;
      if (normalizeText(appt.vehicleMake).includes(searchTerm)) return true;
      if (normalizeText(appt.vehicleModel).includes(searchTerm)) return true;
      if (normalizeText(appt.vin).includes(searchTerm)) return true;
      if (normalizeText(appt.serviceType).includes(searchTerm)) return true;
      if (normalizeText(appt.status).includes(searchTerm)) return true;
      if (appt.serviceAdvisor && normalizeText(appt.serviceAdvisor).includes(searchTerm)) return true;
      if (appt.assignedTechnician && normalizeText(appt.assignedTechnician).includes(searchTerm)) return true;

      return false;
    });
  }, [appointments, searchQuery]);

  const handleOpen = (mode: 'add' | 'edit', appointment?: ServiceAppointment) => {
    setViewMode(mode);
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData(appointment);
    } else {
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        vehicleYear: new Date().getFullYear(),
        vehicleMake: '',
        vehicleModel: '',
        vin: '',
        mileage: 0,
        serviceType: 'Maintenance',
        description: '',
        requestedServices: [],
        appointmentDate: new Date().toISOString().split('T')[0],
        appointmentTime: '09:00',
        status: 'Scheduled',
        serviceAdvisor: '',
        assignedTechnician: '',
        estimatedCost: 0,
        estimatedCompletionTime: '',
        notes: '',
      });
    }
    setOpen(true);
  };

  const handleViewOpen = (appointment: ServiceAppointment) => {
    setSelectedAppointment(appointment);
    setViewOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedAppointment(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, appointment: ServiceAppointment) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuAppointment(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuAppointment(null);
  };

  const handleMenuAction = (action: 'view' | 'edit' | 'delete') => {
    if (menuAppointment) {
      if (action === 'view') {
        handleViewOpen(menuAppointment);
      } else if (action === 'edit') {
        handleOpen('edit', menuAppointment);
      } else if (action === 'delete') {
        handleDelete(menuAppointment.id);
      }
    }
    handleMenuClose();
  };

  const handleSubmit = () => {
    if (viewMode === 'add') {
      const newAppointment: ServiceAppointment = {
        ...formData as ServiceAppointment,
        id: appointments.length + 1,
        appointmentNumber: `SVC-2025-${String(appointments.length + 1).padStart(3, '0')}`,
        createdDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      setAppointments([...appointments, newAppointment]);
    } else if (viewMode === 'edit' && selectedAppointment) {
      const updatedAppointments = appointments.map(appt =>
        appt.id === selectedAppointment.id 
          ? { ...appt, ...formData, lastUpdated: new Date().toISOString().split('T')[0] } 
          : appt
      );
      setAppointments(updatedAppointments);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(appt => appt.id !== id));
    }
  };

  const handleChange = (field: keyof ServiceAppointment, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      case 'Checked In': return 'info';
      case 'Awaiting Parts': return 'warning';
      case 'Cancelled': case 'No Show': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Statistics
  const stats = {
    total: filteredAppointments.length,
    scheduled: filteredAppointments.filter(a => a.status === 'Scheduled').length,
    inProgress: filteredAppointments.filter(a => a.status === 'In Progress' || a.status === 'Checked In').length,
    completed: filteredAppointments.filter(a => a.status === 'Completed').length,
  };

  const columns: GridColDef[] = [
    { field: 'appointmentNumber', headerName: 'Appt #', width: 130 },
    { field: 'customerName', headerName: 'Customer', width: 150 },
    { 
      field: 'vehicle', 
      headerName: 'Vehicle', 
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        `${params.row.vehicleYear} ${params.row.vehicleMake} ${params.row.vehicleModel}`
      ),
    },
    { field: 'serviceType', headerName: 'Service Type', width: 130 },
    { field: 'appointmentDate', headerName: 'Date', width: 110 },
    { field: 'appointmentTime', headerName: 'Time', width: 90 },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value as string}
          color={getStatusColor(params.value as string)}
          size="small"
          icon={params.value === 'Completed' ? <CheckCircleIcon /> : undefined}
        />
      ),
    },
    {
      field: 'estimatedCost',
      headerName: 'Est. Cost',
      width: 110,
      renderCell: (params: GridRenderCellParams) => formatCurrency(params.value as number),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Actions">
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, params.row as ServiceAppointment)}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Service Appointments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen('add')}
        >
          New Appointment
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Appointments
                  </Typography>
                  <Typography variant="h4">{stats.total}</Typography>
                </Box>
                <EventIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Scheduled
                  </Typography>
                  <Typography variant="h4" color="info.main">{stats.scheduled}</Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    In Progress
                  </Typography>
                  <Typography variant="h4" color="warning.main">{stats.inProgress}</Typography>
                </Box>
                <BuildIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Completed
                  </Typography>
                  <Typography variant="h4" color="success.main">{stats.completed}</Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by appointment #, customer, vehicle, VIN, status, advisor, technician..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Data Grid */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredAppointments}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode === 'add' ? 'New Service Appointment' : 'Edit Service Appointment'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>Customer Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={formData.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.customerPhone}
                  onChange={(e) => handleChange('customerPhone', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleChange('customerEmail', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>Vehicle Information</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Year"
                  type="number"
                  value={formData.vehicleYear}
                  onChange={(e) => handleChange('vehicleYear', parseInt(e.target.value))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Make"
                  value={formData.vehicleMake}
                  onChange={(e) => handleChange('vehicleMake', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Model"
                  value={formData.vehicleModel}
                  onChange={(e) => handleChange('vehicleModel', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="VIN"
                  value={formData.vin}
                  onChange={(e) => handleChange('vin', e.target.value.toUpperCase())}
                  required
                  inputProps={{ maxLength: 17 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleChange('mileage', parseInt(e.target.value))}
                  required
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>Service Details</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Service Type"
                  value={formData.serviceType}
                  onChange={(e) => handleChange('serviceType', e.target.value)}
                  required
                >
                  <MenuItem value="Oil Change">Oil Change</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Repair">Repair</MenuItem>
                  <MenuItem value="Inspection">Inspection</MenuItem>
                  <MenuItem value="Recall">Recall</MenuItem>
                  <MenuItem value="Diagnostic">Diagnostic</MenuItem>
                  <MenuItem value="Tire Service">Tire Service</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  required
                >
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="Checked In">Checked In</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Awaiting Parts">Awaiting Parts</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                  <MenuItem value="No Show">No Show</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Appointment Date"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => handleChange('appointmentDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Appointment Time"
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) => handleChange('appointmentTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Service Advisor"
                  value={formData.serviceAdvisor}
                  onChange={(e) => handleChange('serviceAdvisor', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Assigned Technician"
                  value={formData.assignedTechnician}
                  onChange={(e) => handleChange('assignedTechnician', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estimated Cost"
                  type="number"
                  value={formData.estimatedCost}
                  onChange={(e) => handleChange('estimatedCost', parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Est. Completion Time"
                  type="time"
                  value={formData.estimatedCompletionTime}
                  onChange={(e) => handleChange('estimatedCompletionTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {viewMode === 'add' ? 'Create Appointment' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Appointment Details - {selectedAppointment?.appointmentNumber}</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Customer Information</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Customer Name</Typography>
                  <Typography variant="body1">{selectedAppointment.customerName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                  <Typography variant="body1">{selectedAppointment.customerPhone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  <Typography variant="body1">{selectedAppointment.customerEmail}</Typography>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Vehicle Information</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Vehicle</Typography>
                  <Typography variant="body1">
                    {selectedAppointment.vehicleYear} {selectedAppointment.vehicleMake} {selectedAppointment.vehicleModel}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">VIN</Typography>
                  <Typography variant="body1">{selectedAppointment.vin}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Mileage</Typography>
                  <Typography variant="body1">{selectedAppointment.mileage.toLocaleString()} miles</Typography>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Service Details</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Service Type</Typography>
                  <Typography variant="body1">{selectedAppointment.serviceType}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip 
                    label={selectedAppointment.status} 
                    color={getStatusColor(selectedAppointment.status)}
                    icon={selectedAppointment.status === 'Completed' ? <CheckCircleIcon /> : undefined}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                  <Typography variant="body1">{selectedAppointment.description}</Typography>
                </Grid>
                {selectedAppointment.requestedServices && selectedAppointment.requestedServices.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Requested Services</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {selectedAppointment.requestedServices.map((service, index) => (
                        <Chip key={index} label={service} size="small" color="primary" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Appointment Date</Typography>
                  <Typography variant="body1">{selectedAppointment.appointmentDate}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Appointment Time</Typography>
                  <Typography variant="body1">{selectedAppointment.appointmentTime}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Service Advisor</Typography>
                  <Typography variant="body1">{selectedAppointment.serviceAdvisor}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Assigned Technician</Typography>
                  <Typography variant="body1">{selectedAppointment.assignedTechnician || 'Not assigned'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Estimated Cost</Typography>
                  <Typography variant="body1">{formatCurrency(selectedAppointment.estimatedCost)}</Typography>
                </Grid>
                {selectedAppointment.actualCost && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Actual Cost</Typography>
                    <Typography variant="body1">{formatCurrency(selectedAppointment.actualCost)}</Typography>
                  </Grid>
                )}
                {selectedAppointment.estimatedCompletionTime && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Est. Completion Time</Typography>
                    <Typography variant="body1">{selectedAppointment.estimatedCompletionTime}</Typography>
                  </Grid>
                )}
                {selectedAppointment.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
                    <Typography variant="body1">{selectedAppointment.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" color="info" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          Edit Appointment
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete Appointment
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Service;
