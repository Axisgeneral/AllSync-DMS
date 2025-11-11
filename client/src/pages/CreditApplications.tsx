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
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useCreditApplications } from '../contexts/CreditApplicationsContext';

interface CreditApplication {
  id: number;
  applicationNumber: string;
  customerName: string;
  ssn: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  employmentStatus: 'Employed' | 'Self-Employed' | 'Retired' | 'Unemployed';
  employer: string;
  monthlyIncome: number;
  yearsEmployed: number;
  residenceType: 'Own' | 'Rent' | 'Other';
  monthlyPayment: number;
  yearsAtResidence: number;
  vehicleOfInterest: string;
  requestedAmount: number;
  downPayment: number;
  tradeInValue: number;
  creditScore?: number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Denied' | 'Conditional';
  submittedTo?: string;
  submittedDate?: string;
  approvalDate?: string;
  approvedAmount?: number;
  apr?: number;
  term?: number;
  monthlyPaymentApproved?: number;
  stipulations?: string;
  denialReason?: string;
  applicationDate: string;
  salesPerson: string;
  notes: string;
}

const CreditApplications: React.FC = () => {
  const { submitToFI } = useCreditApplications();
  const [applications, setApplications] = useState<CreditApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedLender, setSelectedLender] = useState('');
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedApplication, setSelectedApplication] = useState<CreditApplication | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuApplication, setMenuApplication] = useState<CreditApplication | null>(null);
  const [formData, setFormData] = useState<Partial<CreditApplication>>({
    applicationNumber: '',
    customerName: '',
    ssn: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    employmentStatus: 'Employed',
    employer: '',
    monthlyIncome: 0,
    yearsEmployed: 0,
    residenceType: 'Own',
    monthlyPayment: 0,
    yearsAtResidence: 0,
    vehicleOfInterest: '',
    requestedAmount: 0,
    downPayment: 0,
    tradeInValue: 0,
    status: 'Draft',
    applicationDate: new Date().toISOString().split('T')[0],
    salesPerson: '',
    notes: '',
  });

  // Mock data
  useEffect(() => {
    const mockApplications: CreditApplication[] = [
      {
        id: 1,
        applicationNumber: 'CA-2025-1001',
        customerName: 'John Smith',
        ssn: '***-**-1234',
        dateOfBirth: '1985-03-15',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        employmentStatus: 'Employed',
        employer: 'Tech Solutions Inc',
        monthlyIncome: 6500,
        yearsEmployed: 5,
        residenceType: 'Own',
        monthlyPayment: 1500,
        yearsAtResidence: 3,
        vehicleOfInterest: '2024 Honda CR-V EX',
        requestedAmount: 32000,
        downPayment: 5000,
        tradeInValue: 8000,
        creditScore: 720,
        status: 'Approved',
        submittedTo: 'Honda Financial',
        submittedDate: '2025-11-05',
        approvalDate: '2025-11-06',
        approvedAmount: 32000,
        apr: 4.9,
        term: 60,
        monthlyPaymentApproved: 601.85,
        applicationDate: '2025-11-05',
        salesPerson: 'Sarah Johnson',
        notes: 'Excellent credit, approved immediately',
      },
      {
        id: 2,
        applicationNumber: 'CA-2025-1002',
        customerName: 'Emily Davis',
        ssn: '***-**-5678',
        dateOfBirth: '1990-07-22',
        email: 'emily.davis@email.com',
        phone: '(555) 234-5678',
        address: '456 Oak Avenue',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        employmentStatus: 'Employed',
        employer: 'Medical Center',
        monthlyIncome: 5800,
        yearsEmployed: 3,
        residenceType: 'Rent',
        monthlyPayment: 1200,
        yearsAtResidence: 2,
        vehicleOfInterest: '2025 Toyota Camry XLE',
        requestedAmount: 28500,
        downPayment: 8000,
        tradeInValue: 0,
        creditScore: 695,
        status: 'Under Review',
        submittedTo: 'Toyota Financial Services',
        submittedDate: '2025-11-09',
        applicationDate: '2025-11-09',
        salesPerson: 'Mike Wilson',
        notes: 'Awaiting final decision from lender',
      },
      {
        id: 3,
        applicationNumber: 'CA-2025-1003',
        customerName: 'Robert Taylor',
        ssn: '***-**-9012',
        dateOfBirth: '1978-11-30',
        email: 'robert.taylor@email.com',
        phone: '(555) 345-6789',
        address: '789 Elm Street',
        city: 'Naperville',
        state: 'IL',
        zipCode: '60540',
        employmentStatus: 'Self-Employed',
        employer: 'Taylor Consulting LLC',
        monthlyIncome: 8500,
        yearsEmployed: 10,
        residenceType: 'Own',
        monthlyPayment: 2200,
        yearsAtResidence: 8,
        vehicleOfInterest: '2024 Ford F-150 Lariat',
        requestedAmount: 52000,
        downPayment: 10000,
        tradeInValue: 15000,
        creditScore: 740,
        status: 'Conditional',
        submittedTo: 'Ford Credit',
        submittedDate: '2025-11-10',
        approvalDate: '2025-11-11',
        approvedAmount: 50000,
        apr: 5.5,
        term: 72,
        monthlyPaymentApproved: 810.20,
        stipulations: 'Requires proof of income for last 2 years, business tax returns',
        applicationDate: '2025-11-10',
        salesPerson: 'Sarah Johnson',
        notes: 'Self-employed, needs additional documentation',
      },
      {
        id: 4,
        applicationNumber: 'CA-2025-1004',
        customerName: 'Jennifer Wilson',
        ssn: '***-**-3456',
        dateOfBirth: '1995-05-18',
        email: 'jennifer.wilson@email.com',
        phone: '(555) 456-7890',
        address: '321 Pine Road',
        city: 'Aurora',
        state: 'IL',
        zipCode: '60505',
        employmentStatus: 'Employed',
        employer: 'Retail Solutions',
        monthlyIncome: 4200,
        yearsEmployed: 2,
        residenceType: 'Rent',
        monthlyPayment: 950,
        yearsAtResidence: 1,
        vehicleOfInterest: '2025 Mazda CX-5 Touring',
        requestedAmount: 29800,
        downPayment: 3000,
        tradeInValue: 0,
        creditScore: 650,
        status: 'Submitted',
        submittedTo: 'Mazda Financial',
        submittedDate: '2025-11-11',
        applicationDate: '2025-11-11',
        salesPerson: 'Mike Wilson',
        notes: 'First-time buyer, may need co-signer',
      },
      {
        id: 5,
        applicationNumber: 'CA-2025-1005',
        customerName: 'Michael Brown',
        ssn: '***-**-7890',
        dateOfBirth: '1982-09-25',
        email: 'michael.brown@email.com',
        phone: '(555) 567-8901',
        address: '654 Maple Lane',
        city: 'Joliet',
        state: 'IL',
        zipCode: '60431',
        employmentStatus: 'Employed',
        employer: 'Construction Co',
        monthlyIncome: 5500,
        yearsEmployed: 7,
        residenceType: 'Own',
        monthlyPayment: 1800,
        yearsAtResidence: 5,
        vehicleOfInterest: '2024 Chevrolet Silverado 1500',
        requestedAmount: 48000,
        downPayment: 6000,
        tradeInValue: 16000,
        creditScore: 610,
        status: 'Denied',
        submittedTo: 'GM Financial',
        submittedDate: '2025-11-07',
        approvalDate: '2025-11-08',
        denialReason: 'High debt-to-income ratio, recent bankruptcy',
        applicationDate: '2025-11-07',
        salesPerson: 'Sarah Johnson',
        notes: 'Consider alternative lenders or larger down payment',
      },
    ];
    setApplications(mockApplications);
  }, []);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filteredApplications = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return applications;
    }

    const searchTerm = normalizeText(trimmedQuery);

    return applications.filter((app) => {
      if (normalizeText(app.applicationNumber).includes(searchTerm)) return true;
      if (normalizeText(app.customerName).includes(searchTerm)) return true;
      if (normalizeText(app.vehicleOfInterest).includes(searchTerm)) return true;
      if (normalizeText(app.status).includes(searchTerm)) return true;
      if (app.submittedTo && normalizeText(app.submittedTo).includes(searchTerm)) return true;
      if (normalizeText(app.salesPerson).includes(searchTerm)) return true;
      if (app.notes && normalizeText(app.notes).includes(searchTerm)) return true;

      return false;
    });
  }, [applications, searchQuery]);

  const handleOpen = (appMode: 'add' | 'edit' | 'view', application?: CreditApplication) => {
    setMode(appMode);
    setActiveStep(0);
    if (application) {
      setSelectedApplication(application);
      if (appMode === 'view') {
        setViewOpen(true);
      } else {
        setFormData(application);
        setOpen(true);
      }
    } else {
      setFormData({
        applicationNumber: `CA-2025-${(applications.length + 1001).toString()}`,
        customerName: '',
        ssn: '',
        dateOfBirth: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        employmentStatus: 'Employed',
        employer: '',
        monthlyIncome: 0,
        yearsEmployed: 0,
        residenceType: 'Own',
        monthlyPayment: 0,
        yearsAtResidence: 0,
        vehicleOfInterest: '',
        requestedAmount: 0,
        downPayment: 0,
        tradeInValue: 0,
        status: 'Draft',
        applicationDate: new Date().toISOString().split('T')[0],
        salesPerson: '',
        notes: '',
      });
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedApplication(null);
    setActiveStep(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, application: CreditApplication) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuApplication(application);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuApplication(null);
  };

  const handleMenuAction = (action: 'view' | 'edit' | 'submit' | 'delete') => {
    if (menuApplication) {
      switch (action) {
        case 'view':
          setSelectedApplication(menuApplication);
          setMode('view');
          setViewOpen(true);
          break;
        case 'edit':
          setSelectedApplication(menuApplication);
          setFormData(menuApplication);
          setMode('edit');
          setOpen(true);
          break;
        case 'submit':
          handleSubmitToLender(menuApplication);
          break;
        case 'delete':
          handleDelete(menuApplication.id);
          break;
      }
    }
    handleMenuClose();
  };

  const handleSubmit = () => {
    if (mode === 'add') {
      const newApplication: CreditApplication = {
        ...formData as CreditApplication,
        id: applications.length + 1,
      };
      setApplications([...applications, newApplication]);
    } else if (mode === 'edit' && selectedApplication) {
      const updatedApplications = applications.map(app =>
        app.id === selectedApplication.id ? { ...app, ...formData } : app
      );
      setApplications(updatedApplications);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this credit application?')) {
      setApplications(applications.filter(app => app.id !== id));
    }
  };

  const handleSubmitToLender = (application: CreditApplication) => {
    setSelectedApplication(application);
    setSelectedLender('');
    setSubmitDialogOpen(true);
  };

  const handleConfirmSubmit = () => {
    if (selectedApplication && selectedLender) {
      // Submit to F&I
      submitToFI(selectedApplication, selectedLender);
      
      // Remove from this page
      setApplications(applications.filter(app => app.id !== selectedApplication.id));
      
      setSubmitDialogOpen(false);
      alert(`Application ${selectedApplication.applicationNumber} has been submitted to ${selectedLender} and moved to Pending Credit Applications in F&I.`);
    }
  };

  const handleChange = (field: keyof CreditApplication, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'default';
      case 'Submitted': return 'info';
      case 'Under Review': return 'warning';
      case 'Approved': return 'success';
      case 'Denied': return 'error';
      case 'Conditional': return 'warning';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatSSN = (ssn: string) => {
    return ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
  };

  // Statistics
  const stats = {
    total: filteredApplications.length,
    approved: filteredApplications.filter(a => a.status === 'Approved').length,
    pending: filteredApplications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length,
    avgApprovedAmount: filteredApplications.filter(a => a.approvedAmount).length > 0
      ? filteredApplications.filter(a => a.approvedAmount).reduce((sum, a) => sum + (a.approvedAmount || 0), 0) / filteredApplications.filter(a => a.approvedAmount).length
      : 0,
  };

  const steps = ['Personal Information', 'Employment & Residence', 'Vehicle & Financing', 'Review & Submit'];

  const columns: GridColDef[] = [
    { field: 'applicationNumber', headerName: 'Application #', width: 140 },
    { field: 'customerName', headerName: 'Customer', width: 150 },
    { field: 'vehicleOfInterest', headerName: 'Vehicle', width: 180 },
    {
      field: 'requestedAmount',
      headerName: 'Requested',
      width: 120,
      renderCell: (params: GridRenderCellParams) => formatCurrency(params.value as number),
    },
    {
      field: 'creditScore',
      headerName: 'Credit Score',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        params.value ? (
          <Chip 
            label={params.value} 
            size="small" 
            color={params.value >= 700 ? 'success' : params.value >= 650 ? 'warning' : 'error'}
          />
        ) : '-'
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value as string} 
          color={getStatusColor(params.value as string)} 
          size="small"
          icon={
            params.value === 'Approved' ? <CheckCircleIcon /> :
            params.value === 'Denied' ? <CancelIcon /> :
            <PendingIcon />
          }
        />
      ),
    },
    { field: 'submittedTo', headerName: 'Lender', width: 150 },
    { field: 'applicationDate', headerName: 'Date', width: 110 },
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
              onClick={(e) => handleMenuOpen(e, params.row as CreditApplication)}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
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
                label="SSN"
                value={formData.ssn}
                onChange={(e) => handleChange('ssn', e.target.value)}
                placeholder="XXX-XX-XXXX"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Zip Code"
                value={formData.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Employment Status"
                value={formData.employmentStatus}
                onChange={(e) => handleChange('employmentStatus', e.target.value)}
                required
              >
                <MenuItem value="Employed">Employed</MenuItem>
                <MenuItem value="Self-Employed">Self-Employed</MenuItem>
                <MenuItem value="Retired">Retired</MenuItem>
                <MenuItem value="Unemployed">Unemployed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employer"
                value={formData.employer}
                onChange={(e) => handleChange('employer', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly Income"
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => handleChange('monthlyIncome', parseFloat(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Years Employed"
                type="number"
                value={formData.yearsEmployed}
                onChange={(e) => handleChange('yearsEmployed', parseFloat(e.target.value))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Residence Type"
                value={formData.residenceType}
                onChange={(e) => handleChange('residenceType', e.target.value)}
                required
              >
                <MenuItem value="Own">Own</MenuItem>
                <MenuItem value="Rent">Rent</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly Housing Payment"
                type="number"
                value={formData.monthlyPayment}
                onChange={(e) => handleChange('monthlyPayment', parseFloat(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Years at Residence"
                type="number"
                value={formData.yearsAtResidence}
                onChange={(e) => handleChange('yearsAtResidence', parseFloat(e.target.value))}
                required
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vehicle of Interest"
                value={formData.vehicleOfInterest}
                onChange={(e) => handleChange('vehicleOfInterest', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Requested Amount"
                type="number"
                value={formData.requestedAmount}
                onChange={(e) => handleChange('requestedAmount', parseFloat(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Down Payment"
                type="number"
                value={formData.downPayment}
                onChange={(e) => handleChange('downPayment', parseFloat(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trade-In Value"
                type="number"
                value={formData.tradeInValue}
                onChange={(e) => handleChange('tradeInValue', parseFloat(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sales Person"
                value={formData.salesPerson}
                onChange={(e) => handleChange('salesPerson', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Review Application</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Customer Name</Typography>
                <Typography variant="body1">{formData.customerName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                <Typography variant="body1">{formData.phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                <Typography variant="body1">{formData.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Employer</Typography>
                <Typography variant="body1">{formData.employer}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Monthly Income</Typography>
                <Typography variant="body1">{formatCurrency(formData.monthlyIncome || 0)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Vehicle</Typography>
                <Typography variant="body1">{formData.vehicleOfInterest}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Requested Amount</Typography>
                <Typography variant="body1">{formatCurrency(formData.requestedAmount || 0)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Down Payment</Typography>
                <Typography variant="body1">{formatCurrency(formData.downPayment || 0)}</Typography>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Credit Applications
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen('add')}
        >
          New Application
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Applications
                  </Typography>
                  <Typography variant="h4">{stats.total}</Typography>
                </Box>
                <CreditScoreIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Approved
                  </Typography>
                  <Typography variant="h4" color="success.main">{stats.approved}</Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Pending Review
                  </Typography>
                  <Typography variant="h4" color="warning.main">{stats.pending}</Typography>
                </Box>
                <PendingIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Avg Approved
                  </Typography>
                  <Typography variant="h4">{formatCurrency(stats.avgApprovedAmount)}</Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by application #, customer, vehicle, status, lender..."
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
          rows={filteredApplications}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          onRowClick={(params) => handleOpen('view', params.row as CreditApplication)}
          sx={{
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
            },
          }}
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {mode === 'add' ? 'New Credit Application' : 'Edit Credit Application'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {renderStepContent(activeStep)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {activeStep > 0 && (
            <Button onClick={handleBack}>Back</Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} variant="contained">Next</Button>
          ) : (
            <Button onClick={handleSubmit} variant="contained">
              {mode === 'add' ? 'Submit Application' : 'Save Changes'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Application Details - {selectedApplication?.applicationNumber}</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Personal Information</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Customer Name</Typography>
                  <Typography variant="body1">{selectedApplication.customerName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">SSN</Typography>
                  <Typography variant="body1">{selectedApplication.ssn}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                  <Typography variant="body1">{selectedApplication.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  <Typography variant="body1">{selectedApplication.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                  <Typography variant="body1">
                    {selectedApplication.address}, {selectedApplication.city}, {selectedApplication.state} {selectedApplication.zipCode}
                  </Typography>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Employment & Residence</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Employment Status</Typography>
                  <Typography variant="body1">{selectedApplication.employmentStatus}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Employer</Typography>
                  <Typography variant="body1">{selectedApplication.employer}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Monthly Income</Typography>
                  <Typography variant="body1">{formatCurrency(selectedApplication.monthlyIncome)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Years Employed</Typography>
                  <Typography variant="body1">{selectedApplication.yearsEmployed}</Typography>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Vehicle & Financing</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Vehicle of Interest</Typography>
                  <Typography variant="body1">{selectedApplication.vehicleOfInterest}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Requested Amount</Typography>
                  <Typography variant="body1">{formatCurrency(selectedApplication.requestedAmount)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Down Payment</Typography>
                  <Typography variant="body1">{formatCurrency(selectedApplication.downPayment)}</Typography>
                </Grid>
                {selectedApplication.creditScore && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Credit Score</Typography>
                    <Chip 
                      label={selectedApplication.creditScore} 
                      color={selectedApplication.creditScore >= 700 ? 'success' : selectedApplication.creditScore >= 650 ? 'warning' : 'error'}
                    />
                  </Grid>
                )}

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Status</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Application Status</Typography>
                  <Chip 
                    label={selectedApplication.status} 
                    color={getStatusColor(selectedApplication.status)} 
                    icon={
                      selectedApplication.status === 'Approved' ? <CheckCircleIcon /> :
                      selectedApplication.status === 'Denied' ? <CancelIcon /> :
                      <PendingIcon />
                    }
                  />
                </Grid>
                {selectedApplication.submittedTo && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Submitted To</Typography>
                    <Typography variant="body1">{selectedApplication.submittedTo}</Typography>
                  </Grid>
                )}
                {selectedApplication.approvedAmount && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="textSecondary">Approved Amount</Typography>
                      <Typography variant="body1">{formatCurrency(selectedApplication.approvedAmount)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="textSecondary">APR</Typography>
                      <Typography variant="body1">{selectedApplication.apr}%</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="textSecondary">Term</Typography>
                      <Typography variant="body1">{selectedApplication.term} months</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="textSecondary">Monthly Payment</Typography>
                      <Typography variant="body1">{formatCurrency(selectedApplication.monthlyPaymentApproved || 0)}</Typography>
                    </Grid>
                  </>
                )}
                {selectedApplication.stipulations && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Stipulations</Typography>
                    <Typography variant="body1" color="warning.main">{selectedApplication.stipulations}</Typography>
                  </Grid>
                )}
                {selectedApplication.denialReason && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Denial Reason</Typography>
                    <Typography variant="body1" color="error.main">{selectedApplication.denialReason}</Typography>
                  </Grid>
                )}
                {selectedApplication.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
                    <Typography variant="body1">{selectedApplication.notes}</Typography>
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

      {/* Submit to Lender Dialog */}
      <Dialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Application to Lender</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Submit application {selectedApplication?.applicationNumber} for {selectedApplication?.customerName} to a lender?
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              This will move the application to Pending Credit Applications in the F&I section.
            </Typography>
            <TextField
              fullWidth
              select
              label="Select Lender"
              value={selectedLender}
              onChange={(e) => setSelectedLender(e.target.value)}
              required
            >
              <MenuItem value="Honda Financial">Honda Financial</MenuItem>
              <MenuItem value="Toyota Financial Services">Toyota Financial Services</MenuItem>
              <MenuItem value="Ford Credit">Ford Credit</MenuItem>
              <MenuItem value="Mazda Financial">Mazda Financial</MenuItem>
              <MenuItem value="GM Financial">GM Financial</MenuItem>
              <MenuItem value="Nissan Motor Acceptance">Nissan Motor Acceptance</MenuItem>
              <MenuItem value="Subaru Motors Finance">Subaru Motors Finance</MenuItem>
              <MenuItem value="Chase Auto Finance">Chase Auto Finance</MenuItem>
              <MenuItem value="Capital One Auto Finance">Capital One Auto Finance</MenuItem>
              <MenuItem value="Wells Fargo Dealer Services">Wells Fargo Dealer Services</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmSubmit} 
            variant="contained"
            disabled={!selectedLender}
          >
            Submit to Lender
          </Button>
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
          Edit Application
        </MenuItem>
        {menuApplication?.status === 'Draft' && (
          <MenuItem onClick={() => handleMenuAction('submit')}>
            <ListItemIcon>
              <SendIcon fontSize="small" color="success" />
            </ListItemIcon>
            Submit to Lender
          </MenuItem>
        )}
        <MenuItem onClick={() => handleMenuAction('delete')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete Application
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CreditApplications;
