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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import BuildIcon from '@mui/icons-material/Build';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';

interface LineItem {
  id: number;
  type: 'Labor' | 'Part';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  partNumber?: string;
  technicianName?: string;
  laborHours?: number;
}

interface ServiceOrder {
  id: number;
  roNumber: string;
  customerName: string;
  customerPhone: string;
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  vin: string;
  mileage: number;
  serviceType: 'Maintenance' | 'Repair' | 'Inspection' | 'Warranty' | 'Internal';
  description: string;
  status: 'Open' | 'In Progress' | 'Awaiting Parts' | 'Awaiting Approval' | 'Completed' | 'Invoiced' | 'Closed' | 'Cancelled';
  serviceAdvisor: string;
  primaryTechnician: string;
  openDate: string;
  promisedDate: string;
  completedDate?: string;
  lineItems: LineItem[];
  laborTotal: number;
  partsTotal: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  customerConcerns: string;
  technicianNotes: string;
  recommendedServices?: string;
  authorizedBy?: string;
  approvalDate?: string;
}

const ServiceOrders: React.FC = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'add' | 'edit'>('add');
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOrder, setMenuOrder] = useState<ServiceOrder | null>(null);
  const [formData, setFormData] = useState<Partial<ServiceOrder>>({
    customerName: '',
    customerPhone: '',
    vehicleYear: new Date().getFullYear(),
    vehicleMake: '',
    vehicleModel: '',
    vin: '',
    mileage: 0,
    serviceType: 'Repair',
    description: '',
    status: 'Open',
    serviceAdvisor: '',
    primaryTechnician: '',
    openDate: new Date().toISOString().split('T')[0],
    promisedDate: new Date().toISOString().split('T')[0],
    lineItems: [],
    laborTotal: 0,
    partsTotal: 0,
    subtotal: 0,
    taxRate: 8.25,
    taxAmount: 0,
    totalAmount: 0,
    customerConcerns: '',
    technicianNotes: '',
    recommendedServices: '',
  });

  // Mock data
  useEffect(() => {
    const mockOrders: ServiceOrder[] = [
      {
        id: 1,
        roNumber: 'RO-2025-1001',
        customerName: 'John Smith',
        customerPhone: '(555) 123-4567',
        vehicleYear: 2020,
        vehicleMake: 'Honda',
        vehicleModel: 'Accord',
        vin: '1HGCV1F30LA012345',
        mileage: 45000,
        serviceType: 'Maintenance',
        description: '45K mile service',
        status: 'Completed',
        serviceAdvisor: 'Mike Johnson',
        primaryTechnician: 'Tom Rodriguez',
        openDate: '2025-11-08',
        promisedDate: '2025-11-08',
        completedDate: '2025-11-08',
        lineItems: [
          {
            id: 1,
            type: 'Labor',
            description: 'Oil Change Service',
            quantity: 1,
            unitPrice: 45.00,
            total: 45.00,
            technicianName: 'Tom Rodriguez',
            laborHours: 0.5,
          },
          {
            id: 2,
            type: 'Part',
            description: 'Synthetic Oil 0W-20',
            quantity: 5,
            unitPrice: 8.99,
            total: 44.95,
            partNumber: 'OIL-0W20-SYN',
          },
          {
            id: 3,
            type: 'Part',
            description: 'Oil Filter',
            quantity: 1,
            unitPrice: 12.50,
            total: 12.50,
            partNumber: 'FILT-15400-PLM-A02',
          },
          {
            id: 4,
            type: 'Labor',
            description: 'Multi-Point Inspection',
            quantity: 1,
            unitPrice: 0,
            total: 0,
            technicianName: 'Tom Rodriguez',
            laborHours: 0.3,
          },
        ],
        laborTotal: 45.00,
        partsTotal: 57.45,
        subtotal: 102.45,
        taxRate: 8.25,
        taxAmount: 8.45,
        totalAmount: 110.90,
        customerConcerns: 'Routine maintenance due',
        technicianNotes: 'Completed oil change. All fluids checked. Tire pressure adjusted.',
        recommendedServices: 'Recommend brake fluid flush at next service',
      },
      {
        id: 2,
        roNumber: 'RO-2025-1002',
        customerName: 'Sarah Williams',
        customerPhone: '(555) 234-5678',
        vehicleYear: 2019,
        vehicleMake: 'Toyota',
        vehicleModel: 'Camry',
        vin: '4T1B11HK9KU123456',
        mileage: 62000,
        serviceType: 'Repair',
        description: 'Check engine light - P0420 code',
        status: 'In Progress',
        serviceAdvisor: 'Lisa Chen',
        primaryTechnician: 'David Martinez',
        openDate: '2025-11-09',
        promisedDate: '2025-11-11',
        lineItems: [
          {
            id: 1,
            type: 'Labor',
            description: 'Diagnostic Scan',
            quantity: 1,
            unitPrice: 125.00,
            total: 125.00,
            technicianName: 'David Martinez',
            laborHours: 1.0,
          },
          {
            id: 2,
            type: 'Labor',
            description: 'Catalytic Converter Replacement',
            quantity: 1,
            unitPrice: 250.00,
            total: 250.00,
            technicianName: 'David Martinez',
            laborHours: 2.5,
          },
          {
            id: 3,
            type: 'Part',
            description: 'Catalytic Converter',
            quantity: 1,
            unitPrice: 850.00,
            total: 850.00,
            partNumber: 'CAT-17410-0H150',
          },
          {
            id: 4,
            type: 'Part',
            description: 'Exhaust Gasket',
            quantity: 2,
            unitPrice: 15.50,
            total: 31.00,
            partNumber: 'GSKT-17451-31060',
          },
        ],
        laborTotal: 375.00,
        partsTotal: 881.00,
        subtotal: 1256.00,
        taxRate: 8.25,
        taxAmount: 103.62,
        totalAmount: 1359.62,
        customerConcerns: 'Check engine light on, rough idle',
        technicianNotes: 'Confirmed P0420 code. Catalytic converter efficiency below threshold. Replacement in progress.',
        authorizedBy: 'Customer approved via phone',
        approvalDate: '2025-11-09',
      },
      {
        id: 3,
        roNumber: 'RO-2025-1003',
        customerName: 'Robert Brown',
        customerPhone: '(555) 345-6789',
        vehicleYear: 2021,
        vehicleMake: 'Ford',
        vehicleModel: 'F-150',
        vin: '1FTFW1E51MFA12345',
        mileage: 28000,
        serviceType: 'Repair',
        description: 'Brake noise and vibration',
        status: 'Awaiting Approval',
        serviceAdvisor: 'Mike Johnson',
        primaryTechnician: 'James Wilson',
        openDate: '2025-11-10',
        promisedDate: '2025-11-11',
        lineItems: [
          {
            id: 1,
            type: 'Labor',
            description: 'Brake Inspection',
            quantity: 1,
            unitPrice: 50.00,
            total: 50.00,
            technicianName: 'James Wilson',
            laborHours: 0.5,
          },
          {
            id: 2,
            type: 'Labor',
            description: 'Front Brake Pad & Rotor Replacement',
            quantity: 1,
            unitPrice: 200.00,
            total: 200.00,
            technicianName: 'James Wilson',
            laborHours: 2.0,
          },
          {
            id: 3,
            type: 'Part',
            description: 'Front Brake Pads (Set)',
            quantity: 1,
            unitPrice: 125.00,
            total: 125.00,
            partNumber: 'PAD-BC3Z2001A',
          },
          {
            id: 4,
            type: 'Part',
            description: 'Front Rotors (Pair)',
            quantity: 1,
            unitPrice: 180.00,
            total: 180.00,
            partNumber: 'ROT-BR3Z1125B',
          },
        ],
        laborTotal: 250.00,
        partsTotal: 305.00,
        subtotal: 555.00,
        taxRate: 8.25,
        taxAmount: 45.79,
        totalAmount: 600.79,
        customerConcerns: 'Grinding noise when braking, steering wheel vibrates',
        technicianNotes: 'Front pads at 2mm, rotors warped. Recommend immediate replacement. Customer contacted for approval.',
        recommendedServices: 'Recommend rear brake inspection at next service',
      },
      {
        id: 4,
        roNumber: 'RO-2025-1004',
        customerName: 'Emily Davis',
        customerPhone: '(555) 456-7890',
        vehicleYear: 2018,
        vehicleMake: 'Chevrolet',
        vehicleModel: 'Silverado',
        vin: '1GCVKREC9JZ123456',
        mileage: 75000,
        serviceType: 'Maintenance',
        description: 'Tire replacement and alignment',
        status: 'Open',
        serviceAdvisor: 'Lisa Chen',
        primaryTechnician: 'Tom Rodriguez',
        openDate: '2025-11-11',
        promisedDate: '2025-11-13',
        lineItems: [
          {
            id: 1,
            type: 'Labor',
            description: 'Tire Mount & Balance (4)',
            quantity: 1,
            unitPrice: 120.00,
            total: 120.00,
            technicianName: 'Tom Rodriguez',
            laborHours: 1.0,
          },
          {
            id: 2,
            type: 'Labor',
            description: '4-Wheel Alignment',
            quantity: 1,
            unitPrice: 99.95,
            total: 99.95,
            technicianName: 'Tom Rodriguez',
            laborHours: 1.0,
          },
          {
            id: 3,
            type: 'Part',
            description: 'Tire Disposal Fee',
            quantity: 4,
            unitPrice: 5.00,
            total: 20.00,
            partNumber: 'FEE-TIRE-DISP',
          },
        ],
        laborTotal: 219.95,
        partsTotal: 20.00,
        subtotal: 239.95,
        taxRate: 8.25,
        taxAmount: 19.80,
        totalAmount: 259.75,
        customerConcerns: 'Customer bringing own tires for installation',
        technicianNotes: 'Awaiting customer arrival with tires',
      },
    ];
    setOrders(mockOrders);
  }, []);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filteredOrders = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return orders;
    }

    const searchTerm = normalizeText(trimmedQuery);

    return orders.filter((order) => {
      if (normalizeText(order.roNumber).includes(searchTerm)) return true;
      if (normalizeText(order.customerName).includes(searchTerm)) return true;
      if (normalizeText(order.vehicleMake).includes(searchTerm)) return true;
      if (normalizeText(order.vehicleModel).includes(searchTerm)) return true;
      if (normalizeText(order.vin).includes(searchTerm)) return true;
      if (normalizeText(order.status).includes(searchTerm)) return true;
      if (normalizeText(order.serviceAdvisor).includes(searchTerm)) return true;
      if (normalizeText(order.primaryTechnician).includes(searchTerm)) return true;

      return false;
    });
  }, [orders, searchQuery]);

  const handleOpen = (mode: 'add' | 'edit', order?: ServiceOrder) => {
    setViewMode(mode);
    if (order) {
      setSelectedOrder(order);
      setFormData(order);
    } else {
      setFormData({
        customerName: '',
        customerPhone: '',
        vehicleYear: new Date().getFullYear(),
        vehicleMake: '',
        vehicleModel: '',
        vin: '',
        mileage: 0,
        serviceType: 'Repair',
        description: '',
        status: 'Open',
        serviceAdvisor: '',
        primaryTechnician: '',
        openDate: new Date().toISOString().split('T')[0],
        promisedDate: new Date().toISOString().split('T')[0],
        lineItems: [],
        laborTotal: 0,
        partsTotal: 0,
        subtotal: 0,
        taxRate: 8.25,
        taxAmount: 0,
        totalAmount: 0,
        customerConcerns: '',
        technicianNotes: '',
        recommendedServices: '',
      });
    }
    setOpen(true);
  };

  const handleViewOpen = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setViewOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedOrder(null);
    setTabValue(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, order: ServiceOrder) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOrder(null);
  };

  const handleMenuAction = (action: 'view' | 'edit' | 'delete') => {
    if (menuOrder) {
      switch (action) {
        case 'view':
          setSelectedOrder(menuOrder);
          setViewOpen(true);
          break;
        case 'edit':
          setSelectedOrder(menuOrder);
          setFormData(menuOrder);
          setViewMode('edit');
          setOpen(true);
          break;
        case 'delete':
          handleDelete(menuOrder.id);
          break;
      }
    }
    handleMenuClose();
  };

  const handleSubmit = () => {
    if (viewMode === 'add') {
      const newOrder: ServiceOrder = {
        ...formData as ServiceOrder,
        id: orders.length + 1,
        roNumber: `RO-2025-${String(1000 + orders.length + 1)}`,
      };
      setOrders([...orders, newOrder]);
    } else if (viewMode === 'edit' && selectedOrder) {
      const updatedOrders = orders.map(order =>
        order.id === selectedOrder.id ? { ...order, ...formData } : order
      );
      setOrders(updatedOrders);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this service order?')) {
      setOrders(orders.filter(order => order.id !== id));
    }
  };

  const handleChange = (field: keyof ServiceOrder, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': case 'Closed': return 'success';
      case 'In Progress': return 'primary';
      case 'Awaiting Approval': return 'warning';
      case 'Awaiting Parts': return 'info';
      case 'Cancelled': return 'error';
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
    total: filteredOrders.length,
    open: filteredOrders.filter(o => o.status === 'Open' || o.status === 'In Progress').length,
    awaitingApproval: filteredOrders.filter(o => o.status === 'Awaiting Approval').length,
    totalRevenue: filteredOrders
      .filter(o => o.status === 'Completed' || o.status === 'Invoiced' || o.status === 'Closed')
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  const columns: GridColDef[] = [
    { field: 'roNumber', headerName: 'RO #', width: 130 },
    { field: 'customerName', headerName: 'Customer', width: 150 },
    { 
      field: 'vehicle', 
      headerName: 'Vehicle', 
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        `${params.row.vehicleYear} ${params.row.vehicleMake} ${params.row.vehicleModel}`
      ),
    },
    { field: 'serviceType', headerName: 'Type', width: 120 },
    { field: 'primaryTechnician', headerName: 'Technician', width: 140 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value as string}
          color={getStatusColor(params.value as string)}
          size="small"
          icon={params.value === 'Completed' || params.value === 'Closed' ? <CheckCircleIcon /> : undefined}
        />
      ),
    },
    {
      field: 'totalAmount',
      headerName: 'Total',
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
              onClick={(e) => handleMenuOpen(e, params.row as ServiceOrder)}
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
          Service Orders (RO)
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen('add')}
        >
          New Service Order
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
                    Total Orders
                  </Typography>
                  <Typography variant="h4">{stats.total}</Typography>
                </Box>
                <BuildIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
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
                    Open/In Progress
                  </Typography>
                  <Typography variant="h4" color="primary.main">{stats.open}</Typography>
                </Box>
                <PendingIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
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
                    Awaiting Approval
                  </Typography>
                  <Typography variant="h4" color="warning.main">{stats.awaitingApproval}</Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
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
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {formatCurrency(stats.totalRevenue)}
                  </Typography>
                </Box>
                <AttachMoneyIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by RO #, customer, vehicle, VIN, status, advisor, technician..."
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
          rows={filteredOrders}
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
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          {viewMode === 'add' ? 'New Service Order' : `Edit Service Order - ${selectedOrder?.roNumber}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
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
              <Grid item xs={12} sm={3}>
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
              <Grid item xs={12} sm={5}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Service Type"
                  value={formData.serviceType}
                  onChange={(e) => handleChange('serviceType', e.target.value)}
                  required
                >
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Repair">Repair</MenuItem>
                  <MenuItem value="Inspection">Inspection</MenuItem>
                  <MenuItem value="Warranty">Warranty</MenuItem>
                  <MenuItem value="Internal">Internal</MenuItem>
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
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Awaiting Parts">Awaiting Parts</MenuItem>
                  <MenuItem value="Awaiting Approval">Awaiting Approval</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Invoiced">Invoiced</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
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
                  label="Primary Technician"
                  value={formData.primaryTechnician}
                  onChange={(e) => handleChange('primaryTechnician', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Open Date"
                  type="date"
                  value={formData.openDate}
                  onChange={(e) => handleChange('openDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Promised Date"
                  type="date"
                  value={formData.promisedDate}
                  onChange={(e) => handleChange('promisedDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Customer Concerns"
                  value={formData.customerConcerns}
                  onChange={(e) => handleChange('customerConcerns', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Technician Notes"
                  value={formData.technicianNotes}
                  onChange={(e) => handleChange('technicianNotes', e.target.value)}
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
            {viewMode === 'add' ? 'Create Order' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Service Order - {selectedOrder?.roNumber}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                <Tab label="Order Details" />
                <Tab label="Line Items" />
                <Tab label="Notes" />
              </Tabs>

              {tabValue === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Customer Name</Typography>
                    <Typography variant="body1">{selectedOrder.customerName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                    <Typography variant="body1">{selectedOrder.customerPhone}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Vehicle</Typography>
                    <Typography variant="body1">
                      {selectedOrder.vehicleYear} {selectedOrder.vehicleMake} {selectedOrder.vehicleModel}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">VIN</Typography>
                    <Typography variant="body1">{selectedOrder.vin}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Mileage</Typography>
                    <Typography variant="body1">{selectedOrder.mileage.toLocaleString()} miles</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Service Type</Typography>
                    <Typography variant="body1">{selectedOrder.serviceType}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                    <Chip 
                      label={selectedOrder.status} 
                      color={getStatusColor(selectedOrder.status)}
                      icon={selectedOrder.status === 'Completed' || selectedOrder.status === 'Closed' ? <CheckCircleIcon /> : undefined}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Service Advisor</Typography>
                    <Typography variant="body1">{selectedOrder.serviceAdvisor}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Primary Technician</Typography>
                    <Typography variant="body1">{selectedOrder.primaryTechnician}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Open Date</Typography>
                    <Typography variant="body1">{selectedOrder.openDate}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Promised Date</Typography>
                    <Typography variant="body1">{selectedOrder.promisedDate}</Typography>
                  </Grid>
                  {selectedOrder.completedDate && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="textSecondary">Completed Date</Typography>
                      <Typography variant="body1">{selectedOrder.completedDate}</Typography>
                    </Grid>
                  )}
                </Grid>
              )}

              {tabValue === 1 && (
                <Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Type</strong></TableCell>
                          <TableCell><strong>Description</strong></TableCell>
                          <TableCell><strong>Details</strong></TableCell>
                          <TableCell align="right"><strong>Qty</strong></TableCell>
                          <TableCell align="right"><strong>Unit Price</strong></TableCell>
                          <TableCell align="right"><strong>Total</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.lineItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Chip 
                                label={item.type} 
                                size="small" 
                                color={item.type === 'Labor' ? 'primary' : 'secondary'}
                              />
                            </TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>
                              {item.type === 'Labor' ? (
                                <Typography variant="caption">
                                  Tech: {item.technicianName}<br />
                                  Hours: {item.laborHours}
                                </Typography>
                              ) : (
                                <Typography variant="caption">
                                  Part #: {item.partNumber}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell align="right"><strong>{formatCurrency(item.total)}</strong></TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={5} align="right"><strong>Labor Total:</strong></TableCell>
                          <TableCell align="right"><strong>{formatCurrency(selectedOrder.laborTotal)}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} align="right"><strong>Parts Total:</strong></TableCell>
                          <TableCell align="right"><strong>{formatCurrency(selectedOrder.partsTotal)}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} align="right"><strong>Subtotal:</strong></TableCell>
                          <TableCell align="right"><strong>{formatCurrency(selectedOrder.subtotal)}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} align="right"><strong>Tax ({selectedOrder.taxRate}%):</strong></TableCell>
                          <TableCell align="right"><strong>{formatCurrency(selectedOrder.taxAmount)}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} align="right">
                            <Typography variant="h6">TOTAL:</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="h6" color="primary">{formatCurrency(selectedOrder.totalAmount)}</Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {tabValue === 2 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Customer Concerns</Typography>
                    <Typography variant="body1">{selectedOrder.customerConcerns}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Technician Notes</Typography>
                    <Typography variant="body1">{selectedOrder.technicianNotes}</Typography>
                  </Grid>
                  {selectedOrder.recommendedServices && (
                    <>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">Recommended Services</Typography>
                        <Typography variant="body1" color="warning.main">{selectedOrder.recommendedServices}</Typography>
                      </Grid>
                    </>
                  )}
                  {selectedOrder.authorizedBy && (
                    <>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">Authorized By</Typography>
                        <Typography variant="body1">{selectedOrder.authorizedBy}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">Approval Date</Typography>
                        <Typography variant="body1">{selectedOrder.approvalDate}</Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              )}
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
          Edit Order
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete Order
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ServiceOrders;
