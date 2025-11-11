import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SmsIcon from '@mui/icons-material/Sms';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import { createMobileColumns, MobileColumnPresets, getMobileDialogProps } from '../utils/mobileUtils';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'Individual' | 'Business';
  status: 'Active' | 'Inactive';
  notes: string;
  createdDate: string;
  lastContact: string;
  communicationHistory?: CommunicationRecord[];
}

interface CommunicationRecord {
  id: number;
  type: 'email' | 'sms';
  subject?: string;
  message: string;
  sentBy: string;
  sentDate: string;
  status: 'sent' | 'failed' | 'pending';
}

interface PurchaseHistory {
  id: number;
  dealNumber: string;
  vehicleInfo: string;
  purchaseDate: string;
  salePrice: number;
  dealStage: string;
}

interface ServiceHistory {
  id: number;
  type: 'order' | 'appointment';
  orderNumber?: string;
  appointmentDate?: string;
  vehicleInfo: string;
  serviceType: string;
  status: string;
  total?: number;
  description: string;
}

const Customers: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [purchaseHistoryOpen, setPurchaseHistoryOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistory[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuCustomer, setMenuCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    type: 'Individual',
    status: 'Active',
    notes: '',
    lastContact: new Date().toISOString().split('T')[0],
  });
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
  });
  const [smsData, setSmsData] = useState({
    message: '',
  });

  // Mock data
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        type: 'Individual',
        status: 'Active',
        notes: 'Preferred customer, purchased 3 vehicles',
        createdDate: '2024-01-15',
        lastContact: '2025-11-06',
        communicationHistory: [
          {
            id: 1,
            type: 'email',
            subject: 'Thank you for your business',
            message: 'Thank you for choosing AllSync Auto...',
            sentBy: 'Sarah Johnson',
            sentDate: '2025-11-05 10:30 AM',
            status: 'sent',
          },
          {
            id: 2,
            type: 'sms',
            message: 'Hi John, your vehicle service is due. Would you like to schedule?',
            sentBy: 'Sarah Johnson',
            sentDate: '2025-11-06 2:15 PM',
            status: 'sent',
          },
        ],
      },
      {
        id: 2,
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@email.com',
        phone: '(555) 234-5678',
        address: '456 Oak Avenue',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        type: 'Individual',
        status: 'Active',
        notes: 'Referred by John Smith',
        createdDate: '2024-03-20',
        lastContact: '2025-11-07',
        communicationHistory: [
          {
            id: 3,
            type: 'email',
            subject: 'Service reminder',
            message: 'Hi Emily, your vehicle is due for maintenance...',
            sentBy: 'Mike Wilson',
            sentDate: '2025-11-04 3:45 PM',
            status: 'sent',
          },
        ],
      },
      {
        id: 3,
        firstName: 'Acme',
        lastName: 'Corporation',
        email: 'fleet@acmecorp.com',
        phone: '(555) 345-6789',
        address: '789 Business Blvd',
        city: 'Naperville',
        state: 'IL',
        zipCode: '60540',
        type: 'Business',
        status: 'Active',
        notes: 'Fleet account with 15 vehicles',
        createdDate: '2023-06-10',
        lastContact: '2025-11-07',
        communicationHistory: [],
      },
      {
        id: 4,
        firstName: 'Jennifer',
        lastName: 'Wilson',
        email: 'jennifer.wilson@email.com',
        phone: '(555) 456-7890',
        address: '321 Elm Street',
        city: 'Aurora',
        state: 'IL',
        zipCode: '60505',
        type: 'Individual',
        status: 'Active',
        notes: 'Recent purchase - 2025 Honda CR-V',
        createdDate: '2025-10-28',
        lastContact: '2025-11-03',
        communicationHistory: [
          {
            id: 4,
            type: 'email',
            subject: 'Congratulations on your purchase!',
            message: 'Thank you for choosing AllSync Auto. We hope you enjoy your new CR-V!',
            sentBy: 'Mike Wilson',
            sentDate: '2025-11-03 4:00 PM',
            status: 'sent',
          },
          {
            id: 5,
            type: 'sms',
            message: 'Thanks for your purchase Jennifer! Let us know if you need anything.',
            sentBy: 'Mike Wilson',
            sentDate: '2025-11-03 4:05 PM',
            status: 'sent',
          },
        ],
      },
      {
        id: 5,
        firstName: 'Robert',
        lastName: 'Taylor',
        email: 'robert.taylor@email.com',
        phone: '(555) 567-8901',
        address: '654 Pine Road',
        city: 'Joliet',
        state: 'IL',
        zipCode: '60435',
        type: 'Individual',
        status: 'Inactive',
        notes: 'Moved out of state',
        createdDate: '2022-05-15',
        lastContact: '2024-08-20',
        communicationHistory: [
          {
            id: 6,
            type: 'sms',
            message: 'Hi Robert, we noticed you haven\'t visited in a while. Everything okay?',
            sentBy: 'Sarah Johnson',
            sentDate: '2024-08-20 11:20 AM',
            status: 'sent',
          },
        ],
      },
    ];
    setCustomers(mockCustomers);
  }, []);

  // Normalize phone number for searching (remove all non-digit characters)
  const normalizePhone = (phone: string): string => {
    return phone.replace(/\D/g, '');
  };

  // Normalize text for searching (remove extra spaces, convert to lowercase)
  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  // Use useMemo to filter customers based on search query
  const filteredCustomers = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return customers;
    }

    const searchTerm = normalizeText(trimmedQuery);
    const normalizedPhoneQuery = normalizePhone(trimmedQuery);

    return customers.filter((customer) => {
      // Search by name (check first name, last name, and full name)
      const firstName = normalizeText(customer.firstName);
      const lastName = normalizeText(customer.lastName);
      const fullName = `${firstName} ${lastName}`;
      
      if (firstName.includes(searchTerm)) return true;
      if (lastName.includes(searchTerm)) return true;
      if (fullName.includes(searchTerm)) return true;

      // Search by email
      if (customer.email.toLowerCase().includes(searchTerm)) return true;

      // Search by phone (normalized - digits only)
      if (normalizedPhoneQuery) {
        const normalizedCustomerPhone = normalizePhone(customer.phone);
        if (normalizedCustomerPhone.includes(normalizedPhoneQuery)) return true;
      }

      // Search by address
      if (customer.address && normalizeText(customer.address).includes(searchTerm)) return true;

      // Search by city
      if (customer.city && normalizeText(customer.city).includes(searchTerm)) return true;

      // Search by state
      if (customer.state && normalizeText(customer.state).includes(searchTerm)) return true;

      // Search by zipCode
      if (customer.zipCode && customer.zipCode.includes(trimmedQuery)) return true;

      // Search by type
      if (normalizeText(customer.type).includes(searchTerm)) return true;

      // Search by status
      if (normalizeText(customer.status).includes(searchTerm)) return true;

      // Search by notes
      if (customer.notes && normalizeText(customer.notes).includes(searchTerm)) return true;

      return false;
    });
  }, [customers, searchQuery]);

  const handleOpen = (customerMode: 'add' | 'edit' | 'view', customer?: Customer) => {
    setMode(customerMode);
    if (customer) {
      setSelectedCustomer(customer);
      if (customerMode === 'edit') {
        setFormData(customer);
      }
      if (customerMode === 'view') {
        // Load purchase and service history for this customer
        // Mock data - In real app, fetch from API based on customer.id
        const mockPurchases: PurchaseHistory[] = [
          {
            id: 1,
            dealNumber: 'DL-2025-1001',
            vehicleInfo: '2024 Honda CR-V EX',
            purchaseDate: '2025-11-05',
            salePrice: 35000,
            dealStage: 'Delivered',
          },
          {
            id: 2,
            dealNumber: 'DL-2024-0856',
            vehicleInfo: '2020 Honda Accord Sport',
            purchaseDate: '2020-08-15',
            salePrice: 24500,
            dealStage: 'Delivered',
          },
        ];
        
        const mockServices: ServiceHistory[] = [
          {
            id: 1,
            type: 'order',
            orderNumber: 'SO-2025-001',
            vehicleInfo: '2024 Honda CR-V EX',
            serviceType: 'Oil Change & Inspection',
            status: 'Completed',
            total: 89.99,
            description: 'Regular maintenance - 5,000 miles',
          },
          {
            id: 2,
            type: 'appointment',
            appointmentDate: '2025-11-15 10:00 AM',
            vehicleInfo: '2024 Honda CR-V EX',
            serviceType: 'Tire Rotation',
            status: 'Scheduled',
            description: 'Upcoming scheduled service',
          },
          {
            id: 3,
            type: 'order',
            orderNumber: 'SO-2024-245',
            vehicleInfo: '2020 Honda Accord Sport',
            serviceType: 'Brake Service',
            status: 'Completed',
            total: 425.50,
            description: 'Front brake pads replacement',
          },
          {
            id: 4,
            type: 'order',
            orderNumber: 'SO-2024-189',
            vehicleInfo: '2020 Honda Accord Sport',
            serviceType: 'Oil Change',
            status: 'Completed',
            total: 79.99,
            description: 'Synthetic oil change',
          },
        ];
        
        setPurchaseHistory(mockPurchases);
        setServiceHistory(mockServices);
      }
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        type: 'Individual',
        status: 'Active',
        notes: '',
        lastContact: new Date().toISOString().split('T')[0],
      });
    }
    if (customerMode === 'view') {
      setViewOpen(true);
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setEmailOpen(false);
    setSmsOpen(false);
    setHistoryOpen(false);
    setSelectedCustomer(null);
    setEmailData({ subject: '', message: '' });
    setSmsData({ message: '' });
    setTabValue(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCustomer(null);
  };

  const handleMenuAction = (action: 'view' | 'edit' | 'delete' | 'email' | 'sms' | 'history') => {
    if (menuCustomer) {
      if (action === 'view') {
        handleOpen('view', menuCustomer);
      } else if (action === 'edit') {
        handleOpen('edit', menuCustomer);
      } else if (action === 'delete') {
        handleDelete(menuCustomer.id);
      } else if (action === 'email') {
        handleOpenEmail(menuCustomer);
      } else if (action === 'sms') {
        handleOpenSms(menuCustomer);
      } else if (action === 'history') {
        handleOpenPurchaseHistory(menuCustomer);
      }
    }
    handleMenuClose();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSubmit = () => {
    if (mode === 'add') {
      const newCustomer: Customer = {
        ...formData as Customer,
        id: customers.length + 1,
        createdDate: new Date().toISOString().split('T')[0],
        communicationHistory: [],
      };
      const updatedCustomers = [...customers, newCustomer];
      setCustomers(updatedCustomers);
    } else if (mode === 'edit' && selectedCustomer) {
      const updatedCustomers = customers.map(customer =>
        customer.id === selectedCustomer.id ? { ...customer, ...formData } : customer
      );
      setCustomers(updatedCustomers);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      const updatedCustomers = customers.filter(customer => customer.id !== id);
      setCustomers(updatedCustomers);
    }
  };

  const handleOpenEmail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEmailData({
      subject: '',
      message: '',
    });
    setEmailOpen(true);
  };

  const handleOpenSms = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSmsData({
      message: '',
    });
    setSmsOpen(true);
  };

  const handleOpenHistory = (customer: Customer) => {
    setSelectedCustomer(customer);
    setHistoryOpen(true);
  };
  
  const handleOpenPurchaseHistory = (customer: Customer) => {
    setSelectedCustomer(customer);
    
    // Mock data - In real app, fetch from API based on customer.id
    const mockPurchases: PurchaseHistory[] = [
      {
        id: 1,
        dealNumber: 'DL-2025-1001',
        vehicleInfo: '2024 Honda CR-V EX',
        purchaseDate: '2025-11-05',
        salePrice: 35000,
        dealStage: 'Delivered',
      },
      {
        id: 2,
        dealNumber: 'DL-2024-0856',
        vehicleInfo: '2020 Honda Accord Sport',
        purchaseDate: '2020-08-15',
        salePrice: 24500,
        dealStage: 'Delivered',
      },
    ];
    
    const mockServices: ServiceHistory[] = [
      {
        id: 1,
        type: 'order',
        orderNumber: 'SO-2025-001',
        vehicleInfo: '2024 Honda CR-V EX',
        serviceType: 'Oil Change & Inspection',
        status: 'Completed',
        total: 89.99,
        description: 'Regular maintenance - 5,000 miles',
      },
      {
        id: 2,
        type: 'appointment',
        appointmentDate: '2025-11-15 10:00 AM',
        vehicleInfo: '2024 Honda CR-V EX',
        serviceType: 'Tire Rotation',
        status: 'Scheduled',
        description: 'Upcoming scheduled service',
      },
      {
        id: 3,
        type: 'order',
        orderNumber: 'SO-2024-245',
        vehicleInfo: '2020 Honda Accord Sport',
        serviceType: 'Brake Service',
        status: 'Completed',
        total: 425.50,
        description: 'Front brake pads replacement',
      },
      {
        id: 4,
        type: 'order',
        orderNumber: 'SO-2024-189',
        vehicleInfo: '2020 Honda Accord Sport',
        serviceType: 'Oil Change',
        status: 'Completed',
        total: 79.99,
        description: 'Synthetic oil change',
      },
    ];
    
    setPurchaseHistory(mockPurchases);
    setServiceHistory(mockServices);
    setPurchaseHistoryOpen(true);
  };

  const handleSendEmail = () => {
    if (!selectedCustomer || !emailData.subject || !emailData.message) {
      alert('Please fill in all fields');
      return;
    }

    const newCommunication: CommunicationRecord = {
      id: Date.now(),
      type: 'email',
      subject: emailData.subject,
      message: emailData.message,
      sentBy: 'Current User', // In real app, get from auth context
      sentDate: new Date().toLocaleString(),
      status: 'sent',
    };

    // Update customer with new communication
    const updatedCustomers = customers.map(customer => {
      if (customer.id === selectedCustomer.id) {
        return {
          ...customer,
          communicationHistory: [...(customer.communicationHistory || []), newCommunication],
          lastContact: new Date().toISOString().split('T')[0],
        };
      }
      return customer;
    });
    setCustomers(updatedCustomers);

    alert(`Email sent to ${selectedCustomer.firstName} ${selectedCustomer.lastName}`);
    handleClose();
  };

  const handleSendSms = () => {
    if (!selectedCustomer || !smsData.message) {
      alert('Please enter a message');
      return;
    }

    const newCommunication: CommunicationRecord = {
      id: Date.now(),
      type: 'sms',
      message: smsData.message,
      sentBy: 'Current User', // In real app, get from auth context
      sentDate: new Date().toLocaleString(),
      status: 'sent',
    };

    // Update customer with new communication
    const updatedCustomers = customers.map(customer => {
      if (customer.id === selectedCustomer.id) {
        return {
          ...customer,
          communicationHistory: [...(customer.communicationHistory || []), newCommunication],
          lastContact: new Date().toISOString().split('T')[0],
        };
      }
      return customer;
    });
    setCustomers(updatedCustomers);

    alert(`SMS sent to ${selectedCustomer.firstName} ${selectedCustomer.lastName}`);
    handleClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'default';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Business' ? 'primary' : 'info';
  };

  // Statistics
  const stats = {
    total: filteredCustomers.length,
    active: filteredCustomers.filter(c => c.status === 'Active').length,
    individual: filteredCustomers.filter(c => c.type === 'Individual').length,
    business: filteredCustomers.filter(c => c.type === 'Business').length,
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      valueGetter: (params: any) => `${params.row.firstName} ${params.row.lastName}`,
    },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'city', headerName: 'City', width: 130 },
    { field: 'state', headerName: 'State', width: 80 },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          icon={params.value === 'Business' ? <BusinessIcon /> : <PersonIcon />}
          label={params.value as string}
          color={getTypeColor(params.value as string) as any}
          size="small"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value as string}
          color={getStatusColor(params.value as string) as any}
          size="small"
        />
      ),
    },
    { field: 'lastContact', headerName: 'Last Contact', width: 130 },
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
              onClick={(e) => handleMenuOpen(e, params.row as Customer)}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Mobile-optimized columns - only show essential information
  const mobileColumns: GridColDef[] = useMemo(() => {
    if (!isMobile) return columns;
    
    return [
      {
        field: 'name',
        headerName: 'Name',
        width: 120,
        flex: 1,
        valueGetter: (params: any) => `${params.row.firstName} ${params.row.lastName}`,
      },
      { 
        field: 'phone', 
        headerName: 'Phone', 
        width: 100,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Chip
            label={params.value as string}
            color={getStatusColor(params.value as string) as any}
            size="small"
            sx={{ fontSize: '0.65rem', height: '20px' }}
          />
        ),
      },
      {
        field: 'actions',
        headerName: '',
        width: 60,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
          <IconButton
            size="small"
            onClick={(e) => handleMenuOpen(e, params.row as Customer)}
            sx={{ p: 0.5 }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        ),
      },
    ];
  }, [isMobile, columns]);

  return (
    <Box sx={{ p: { xs: 0, sm: 'inherit' } }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: { xs: 1, sm: 3 },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 0 },
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '1.25rem', sm: '2.125rem' } }}>
          Customers {isMobile && `(${filteredCustomers.length})`}
        </Typography>
        <Button
          variant="contained"
          startIcon={!isMobile && <AddIcon />}
          onClick={() => handleOpen('add')}
          size={isMobile ? 'small' : 'medium'}
          fullWidth={isMobile}
        >
          {isMobile ? '+ Add' : 'Add New Customer'}
        </Button>
      </Box>

      {/* Search Box */}
      <Paper sx={{ p: { xs: 1, sm: 2 }, mb: { xs: 1, sm: 3 } }}>
        <TextField
          fullWidth
          size={isMobile ? 'small' : 'medium'}
          placeholder={isMobile ? "Search customers..." : "Search customers by name, email, phone, address, city, state, zip, type, status, or notes..."}
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
                <IconButton size="small" onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {searchQuery && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Found {filteredCustomers.length} of {customers.length} customers
          </Typography>
        )}
      </Paper>

      {/* Statistics Cards */}
      {!isMobile && (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Customers
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.total}
                  </Typography>
                </Box>
                <GroupIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
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
                    Active
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {stats.active}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
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
                    Individual
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                    {stats.individual}
                  </Typography>
                </Box>
                <PersonIcon sx={{ fontSize: 48, color: 'info.main', opacity: 0.3 }} />
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
                    Business
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {stats.business}
                  </Typography>
                </Box>
                <BusinessIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      )}

      {/* Customers Data Grid */}
      <Paper sx={{ 
        height: isMobile ? 'calc(100vh - 200px)' : 500, 
        width: '100%',
        p: { xs: 0, sm: 2 },
      }}>
        <DataGrid
          rows={filteredCustomers}
          columns={isMobile ? mobileColumns : columns}
          density={isMobile ? 'compact' : 'standard'}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: isMobile ? 25 : 10 },
            },
          }}
          pageSizeOptions={isMobile ? [25, 50] : [5, 10, 25]}
          checkboxSelection={!isMobile}
          onRowClick={(params) => handleOpen('view', params.row as Customer)}
          sx={{
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
            },
          }}
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {mode === 'add' ? 'Add New Customer' : 'Edit Customer'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Individual' | 'Business' })}
              >
                <MenuItem value="Individual">Individual</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Contact Date"
                type="date"
                value={formData.lastContact}
                onChange={(e) => setFormData({ ...formData, lastContact: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {mode === 'add' ? 'Add Customer' : 'Update Customer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="lg" fullWidth fullScreen={isMobile}>
        <DialogTitle>Customer Details</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Box sx={{ mt: 1 }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
                <Tab label="Information" />
                <Tab label="Vehicle Purchases" icon={<DirectionsCarIcon />} iconPosition="start" />
                <Tab label="Service History" icon={<BuildIcon />} iconPosition="start" />
                <Tab label={`Communications (${selectedCustomer.communicationHistory?.length || 0})`} />
              </Tabs>

              {/* Information Tab */}
              {tabValue === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon color="action" />
                      <Typography>{selectedCustomer.email}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon color="action" />
                      <Typography>{selectedCustomer.phone}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography color="textSecondary" variant="body2">Address</Typography>
                    <Typography>{selectedCustomer.address || 'Not provided'}</Typography>
                    {selectedCustomer.city && (
                      <Typography>
                        {selectedCustomer.city}, {selectedCustomer.state} {selectedCustomer.zipCode}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Type</Typography>
                    <Chip
                      icon={selectedCustomer.type === 'Business' ? <BusinessIcon /> : <PersonIcon />}
                      label={selectedCustomer.type}
                      color={getTypeColor(selectedCustomer.type) as any}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Status</Typography>
                    <Chip
                      label={selectedCustomer.status}
                      color={getStatusColor(selectedCustomer.status) as any}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Created Date</Typography>
                    <Typography>{selectedCustomer.createdDate}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Last Contact</Typography>
                    <Typography>{selectedCustomer.lastContact}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography color="textSecondary" variant="body2">Notes</Typography>
                    <Typography>{selectedCustomer.notes || 'No notes'}</Typography>
                  </Grid>
                </Grid>
              )}

              {/* Vehicle Purchases Tab */}
              {tabValue === 1 && (
                <Box>
                  {purchaseHistory.length > 0 ? (
                    <Grid container spacing={2}>
                      {purchaseHistory.map((purchase) => (
                        <Grid item xs={12} key={purchase.id}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <DirectionsCarIcon color="primary" />
                                    <Typography variant="h6">{purchase.vehicleInfo}</Typography>
                                  </Box>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                      <Typography variant="caption" color="text.secondary">Deal Number</Typography>
                                      <Typography variant="body2" fontWeight="bold">{purchase.dealNumber}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                      <Typography variant="caption" color="text.secondary">Purchase Date</Typography>
                                      <Typography variant="body2">{purchase.purchaseDate}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                      <Typography variant="caption" color="text.secondary">Sale Price</Typography>
                                      <Typography variant="body2" color="success.main" fontWeight="bold">
                                        ${purchase.salePrice.toLocaleString()}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                      <Typography variant="caption" color="text.secondary">Status</Typography>
                                      <Box>
                                        <Chip label={purchase.dealStage} size="small" color="success" />
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <DirectionsCarIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No Vehicle Purchases
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This customer hasn't purchased any vehicles yet
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Service History Tab */}
              {tabValue === 2 && (
                <Box>
                  {serviceHistory.length > 0 ? (
                    <List>
                      {serviceHistory.map((service, index) => (
                        <React.Fragment key={service.id}>
                          {index > 0 && <Divider sx={{ my: 2 }} />}
                          <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                            <ListItemIcon sx={{ mt: 1 }}>
                              {service.type === 'order' ? (
                                <AssignmentIcon color="primary" />
                              ) : (
                                <EventIcon color="secondary" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                      {service.serviceType}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {service.vehicleInfo}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={service.status}
                                    size="small"
                                    color={
                                      service.status === 'Completed' ? 'success' :
                                      service.status === 'Scheduled' ? 'info' :
                                      service.status === 'In Progress' ? 'warning' : 'default'
                                    }
                                  />
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                                    {service.description}
                                  </Typography>
                                  <Grid container spacing={2}>
                                    {service.type === 'order' && service.orderNumber && (
                                      <Grid item xs={12} sm={4}>
                                        <Typography variant="caption" color="text.secondary">Order Number</Typography>
                                        <Typography variant="body2" fontWeight="bold">{service.orderNumber}</Typography>
                                      </Grid>
                                    )}
                                    {service.type === 'appointment' && service.appointmentDate && (
                                      <Grid item xs={12} sm={4}>
                                        <Typography variant="caption" color="text.secondary">Appointment</Typography>
                                        <Typography variant="body2" fontWeight="bold">{service.appointmentDate}</Typography>
                                      </Grid>
                                    )}
                                    {service.total !== undefined && (
                                      <Grid item xs={12} sm={4}>
                                        <Typography variant="caption" color="text.secondary">Total</Typography>
                                        <Typography variant="body2" fontWeight="bold" color="success.main">
                                          ${service.total.toFixed(2)}
                                        </Typography>
                                      </Grid>
                                    )}
                                  </Grid>
                                </Box>
                              }
                            />
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <BuildIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No Service History
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        No service orders or appointments found for this customer
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Communication History Tab */}
              {tabValue === 3 && (
                <Box>
                  {selectedCustomer.communicationHistory && selectedCustomer.communicationHistory.length > 0 ? (
                    <List>
                      {selectedCustomer.communicationHistory.map((comm, index) => (
                        <React.Fragment key={comm.id}>
                          {index > 0 && <Divider />}
                          <ListItem alignItems="flex-start">
                            <ListItemIcon>
                              {comm.type === 'email' ? (
                                <EmailIcon color="primary" />
                              ) : (
                                <SmsIcon color="secondary" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {comm.type === 'email' ? `Email: ${comm.subject}` : 'SMS Message'}
                                  </Typography>
                                  <Chip
                                    label={comm.status}
                                    size="small"
                                    color={comm.status === 'sent' ? 'success' : comm.status === 'failed' ? 'error' : 'default'}
                                  />
                                </Box>
                              }
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                                    {comm.message}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Sent by {comm.sentBy} on {comm.sentDate}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <HistoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No communication history
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            onClick={() => {
              handleClose();
              if (selectedCustomer) handleOpenEmail(selectedCustomer);
            }}
            startIcon={<EmailIcon />}
          >
            Send Email
          </Button>
          <Button
            onClick={() => {
              handleClose();
              if (selectedCustomer) handleOpenSms(selectedCustomer);
            }}
            startIcon={<SmsIcon />}
          >
            Send SMS
          </Button>
          <Button
            onClick={() => {
              handleClose();
              if (selectedCustomer) handleOpen('edit', selectedCustomer);
            }}
            variant="contained"
          >
            Edit Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={emailOpen} onClose={handleClose} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon />
            Send Email to {selectedCustomer?.firstName} {selectedCustomer?.lastName}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="To"
                value={selectedCustomer?.email || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={8}
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSendEmail} variant="contained" startIcon={<SendIcon />}>
            Send Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send SMS Dialog */}
      <Dialog open={smsOpen} onClose={handleClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmsIcon />
            Send SMS to {selectedCustomer?.firstName} {selectedCustomer?.lastName}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="To"
                value={selectedCustomer?.phone || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={6}
                value={smsData.message}
                onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                required
                inputProps={{ maxLength: 160 }}
                helperText={`${smsData.message.length}/160 characters`}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSendSms} variant="contained" startIcon={<SendIcon />}>
            Send SMS
          </Button>
        </DialogActions>
      </Dialog>

      {/* Communication History Dialog */}
      <Dialog open={historyOpen} onClose={handleClose} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon />
            Communication History - {selectedCustomer?.firstName} {selectedCustomer?.lastName}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCustomer?.communicationHistory && selectedCustomer.communicationHistory.length > 0 ? (
            <List>
              {selectedCustomer.communicationHistory.map((comm, index) => (
                <React.Fragment key={comm.id}>
                  {index > 0 && <Divider />}
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      {comm.type === 'email' ? (
                        <EmailIcon color="primary" />
                      ) : (
                        <SmsIcon color="secondary" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {comm.type === 'email' ? `Email: ${comm.subject}` : 'SMS Message'}
                          </Typography>
                          <Chip
                            label={comm.status}
                            size="small"
                            color={comm.status === 'sent' ? 'success' : comm.status === 'failed' ? 'error' : 'default'}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                            {comm.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Sent by {comm.sentBy} on {comm.sentDate}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <HistoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No communication history
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Send an email or SMS to start tracking communications
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={() => {
            handleClose();
            if (selectedCustomer) handleOpenEmail(selectedCustomer);
          }} startIcon={<EmailIcon />}>
            Send Email
          </Button>
          <Button onClick={() => {
            handleClose();
            if (selectedCustomer) handleOpenSms(selectedCustomer);
          }} startIcon={<SmsIcon />}>
            Send SMS
          </Button>
        </DialogActions>
      </Dialog>

      {/* Purchase & Service History Dialog */}
      <Dialog open={purchaseHistoryOpen} onClose={() => setPurchaseHistoryOpen(false)} maxWidth="lg" fullWidth fullScreen={isMobile}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DirectionsCarIcon />
            Customer History - {selectedCustomer?.firstName} {selectedCustomer?.lastName}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
            <Tab label="Vehicle Purchases" icon={<DirectionsCarIcon />} iconPosition="start" />
            <Tab label="Service History" icon={<BuildIcon />} iconPosition="start" />
          </Tabs>

          {/* Vehicle Purchases Tab */}
          {tabValue === 0 && (
            <Box>
              {purchaseHistory.length > 0 ? (
                <Grid container spacing={2}>
                  {purchaseHistory.map((purchase) => (
                    <Grid item xs={12} key={purchase.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <DirectionsCarIcon color="primary" />
                                <Typography variant="h6">{purchase.vehicleInfo}</Typography>
                              </Box>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                  <Typography variant="caption" color="text.secondary">Deal Number</Typography>
                                  <Typography variant="body2" fontWeight="bold">{purchase.dealNumber}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                  <Typography variant="caption" color="text.secondary">Purchase Date</Typography>
                                  <Typography variant="body2">{purchase.purchaseDate}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                  <Typography variant="caption" color="text.secondary">Sale Price</Typography>
                                  <Typography variant="body2" color="success.main" fontWeight="bold">
                                    ${purchase.salePrice.toLocaleString()}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                  <Typography variant="caption" color="text.secondary">Status</Typography>
                                  <Box>
                                    <Chip label={purchase.dealStage} size="small" color="success" />
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <DirectionsCarIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No Vehicle Purchases
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This customer hasn't purchased any vehicles yet
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Service History Tab */}
          {tabValue === 1 && (
            <Box>
              {serviceHistory.length > 0 ? (
                <List>
                  {serviceHistory.map((service, index) => (
                    <React.Fragment key={service.id}>
                      {index > 0 && <Divider sx={{ my: 2 }} />}
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemIcon sx={{ mt: 1 }}>
                          {service.type === 'order' ? (
                            <AssignmentIcon color="primary" />
                          ) : (
                            <EventIcon color="secondary" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {service.serviceType}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {service.vehicleInfo}
                                </Typography>
                              </Box>
                              <Chip
                                label={service.status}
                                size="small"
                                color={
                                  service.status === 'Completed' ? 'success' :
                                  service.status === 'Scheduled' ? 'info' :
                                  service.status === 'In Progress' ? 'warning' : 'default'
                                }
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                                {service.description}
                              </Typography>
                              <Grid container spacing={2}>
                                {service.type === 'order' && service.orderNumber && (
                                  <Grid item xs={12} sm={4}>
                                    <Typography variant="caption" color="text.secondary">Order Number</Typography>
                                    <Typography variant="body2" fontWeight="bold">{service.orderNumber}</Typography>
                                  </Grid>
                                )}
                                {service.type === 'appointment' && service.appointmentDate && (
                                  <Grid item xs={12} sm={4}>
                                    <Typography variant="caption" color="text.secondary">Appointment</Typography>
                                    <Typography variant="body2" fontWeight="bold">{service.appointmentDate}</Typography>
                                  </Grid>
                                )}
                                {service.total !== undefined && (
                                  <Grid item xs={12} sm={4}>
                                    <Typography variant="caption" color="text.secondary">Total</Typography>
                                    <Typography variant="body2" fontWeight="bold" color="success.main">
                                      ${service.total.toFixed(2)}
                                    </Typography>
                                  </Grid>
                                )}
                              </Grid>
                            </Box>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <BuildIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No Service History
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No service orders or appointments found for this customer
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Summary Box */}
          {(purchaseHistory.length > 0 || serviceHistory.length > 0) && (
            <Paper elevation={2} sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {purchaseHistory.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Vehicle{purchaseHistory.length !== 1 ? 's' : ''} Purchased
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      ${purchaseHistory.reduce((sum, p) => sum + p.salePrice, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Sales Value
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary.main" fontWeight="bold">
                      {serviceHistory.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Service Visit{serviceHistory.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setPurchaseHistoryOpen(false);
            setTabValue(0);
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" color="info" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('history')}>
          <ListItemIcon>
            <DirectionsCarIcon fontSize="small" color="success" />
          </ListItemIcon>
          Purchase & Service History
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('email')}>
          <ListItemIcon>
            <EmailIcon fontSize="small" color="primary" />
          </ListItemIcon>
          Send Email
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('sms')}>
          <ListItemIcon>
            <SmsIcon fontSize="small" color="secondary" />
          </ListItemIcon>
          Send SMS
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          Edit Customer
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete Customer
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Customers;
