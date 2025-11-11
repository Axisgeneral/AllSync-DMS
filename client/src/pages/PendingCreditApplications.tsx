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
  Divider,
  Tab,
  Tabs,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useCreditApplications } from '../contexts/CreditApplicationsContext';

interface PendingCreditApplication {
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
  fiManagerAssigned?: string;
  lenderNotes?: string;
  documentsReceived?: string[];
  followUpDate?: string;
}

const PendingCreditApplications: React.FC = () => {
  const { pendingApplications, updatePendingApplication, approveApplication, denyApplication } = useCreditApplications();
  const [applications, setApplications] = useState<PendingCreditApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewOpen, setViewOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [assignLenderOpen, setAssignLenderOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'deny' | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<PendingCreditApplication | null>(null);
  const [selectedLender, setSelectedLender] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [approvalData, setApprovalData] = useState({
    approvedAmount: 0,
    apr: 0,
    term: 60,
    monthlyPaymentApproved: 0,
    stipulations: '',
  });
  const [denialReason, setDenialReason] = useState('');

  // Mock data + context applications
  useEffect(() => {
    const mockApplications: PendingCreditApplication[] = [
      {
        id: 101,
        applicationNumber: 'CA-2025-1006',
        customerName: 'David Martinez',
        ssn: '***-**-4321',
        dateOfBirth: '1988-04-12',
        email: 'david.martinez@email.com',
        phone: '(555) 678-9012',
        address: '987 Cedar Street',
        city: 'Rockford',
        state: 'IL',
        zipCode: '61101',
        employmentStatus: 'Employed',
        employer: 'Manufacturing Inc',
        monthlyIncome: 5200,
        yearsEmployed: 4,
        residenceType: 'Rent',
        monthlyPayment: 1100,
        yearsAtResidence: 2,
        vehicleOfInterest: '2025 Nissan Altima SV',
        requestedAmount: 27000,
        downPayment: 4000,
        tradeInValue: 5000,
        creditScore: 680,
        status: 'Under Review',
        submittedTo: 'Nissan Motor Acceptance',
        submittedDate: '2025-11-10',
        applicationDate: '2025-11-09',
        salesPerson: 'Sarah Johnson',
        fiManagerAssigned: 'Mike Wilson',
        lenderNotes: 'Waiting for employment verification',
        documentsReceived: ['Pay stubs', 'Bank statements'],
        followUpDate: '2025-11-13',
        notes: 'Customer needs vehicle by end of month',
      },
      {
        id: 102,
        applicationNumber: 'CA-2025-1007',
        customerName: 'Lisa Anderson',
        ssn: '***-**-8765',
        dateOfBirth: '1992-08-30',
        email: 'lisa.anderson@email.com',
        phone: '(555) 789-0123',
        address: '456 Birch Avenue',
        city: 'Peoria',
        state: 'IL',
        zipCode: '61602',
        employmentStatus: 'Employed',
        employer: 'Healthcare System',
        monthlyIncome: 6200,
        yearsEmployed: 6,
        residenceType: 'Own',
        monthlyPayment: 1600,
        yearsAtResidence: 4,
        vehicleOfInterest: '2024 Subaru Outback 2.5i',
        requestedAmount: 32000,
        downPayment: 7000,
        tradeInValue: 11500,
        creditScore: 715,
        status: 'Submitted',
        submittedTo: 'Subaru Motors Finance',
        submittedDate: '2025-11-11',
        applicationDate: '2025-11-11',
        salesPerson: 'Mike Wilson',
        fiManagerAssigned: 'Mike Wilson',
        lenderNotes: '',
        documentsReceived: [],
        followUpDate: '',
        notes: 'Strong credit profile, expecting quick approval',
      },
    ];
    
    // Merge mock with context applications
    const allApplications = [...mockApplications, ...pendingApplications];
    setApplications(allApplications);
  }, [pendingApplications]);

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
      if (app.fiManagerAssigned && normalizeText(app.fiManagerAssigned).includes(searchTerm)) return true;

      return false;
    });
  }, [applications, searchQuery]);

  const handleViewOpen = (application: PendingCreditApplication) => {
    setSelectedApplication(application);
    setViewOpen(true);
  };

  const handleActionOpen = (application: PendingCreditApplication, type: 'approve' | 'deny') => {
    setSelectedApplication(application);
    setActionType(type);
    if (type === 'approve') {
      setApprovalData({
        approvedAmount: application.requestedAmount,
        apr: 0,
        term: 60,
        monthlyPaymentApproved: 0,
        stipulations: '',
      });
    } else {
      setDenialReason('');
    }
    setActionOpen(true);
  };

  const handleClose = () => {
    setViewOpen(false);
    setActionOpen(false);
    setAssignLenderOpen(false);
    setSelectedApplication(null);
    setActionType(null);
    setSelectedLender('');
  };

  const handleAssignLenderOpen = (application: PendingCreditApplication) => {
    setSelectedApplication(application);
    setSelectedLender(application.submittedTo || '');
    setAssignLenderOpen(true);
  };

  const handleAssignLender = () => {
    if (selectedApplication && selectedLender) {
      const updatedApp = {
        ...selectedApplication,
        submittedTo: selectedLender,
        status: 'Under Review' as const,
      };
      updatePendingApplication(updatedApp);
      
      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === selectedApplication.id ? updatedApp : app
        )
      );
      
      handleClose();
    }
  };

  const availableLenders = [
    'Honda Financial Services',
    'Toyota Financial Services',
    'Chase Auto Finance',
    'Capital One Auto Finance',
    'Wells Fargo Dealer Services',
    'Bank of America Auto Loans',
    'Ally Financial',
    'CarMax Auto Finance',
    'Credit Union Direct Lending',
    'Westlake Financial',
  ];

  const handleApprove = () => {
    if (selectedApplication) {
      approveApplication(selectedApplication.id, approvalData);
      handleClose();
    }
  };

  const handleDeny = () => {
    if (selectedApplication) {
      denyApplication(selectedApplication.id, denialReason);
      handleClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  // Statistics
  const stats = {
    total: filteredApplications.length,
    submitted: filteredApplications.filter(a => a.status === 'Submitted').length,
    underReview: filteredApplications.filter(a => a.status === 'Under Review').length,
    approved: filteredApplications.filter(a => a.status === 'Approved' || a.status === 'Conditional').length,
  };

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
    { field: 'submittedTo', headerName: 'Lender', width: 180 },
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
            params.value === 'Approved' || params.value === 'Conditional' ? <CheckCircleIcon /> :
            params.value === 'Denied' ? <CancelIcon /> :
            <PendingIcon />
          }
        />
      ),
    },
    { field: 'submittedDate', headerName: 'Submitted', width: 110 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="info"
              onClick={(e) => {
                e.stopPropagation();
                handleViewOpen(params.row as PendingCreditApplication);
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Assign/Change Lender">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleAssignLenderOpen(params.row as PendingCreditApplication);
              }}
            >
              <AccountBalanceIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {(params.row.status === 'Submitted' || params.row.status === 'Under Review') && (
            <>
              <Tooltip title="Approve">
                <IconButton
                  size="small"
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionOpen(params.row as PendingCreditApplication, 'approve');
                  }}
                >
                  <ThumbUpIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Deny">
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionOpen(params.row as PendingCreditApplication, 'deny');
                  }}
                >
                  <ThumbDownIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Pending Credit Applications
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Pending
                  </Typography>
                  <Typography variant="h4">{stats.total}</Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
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
                    Submitted
                  </Typography>
                  <Typography variant="h4" color="info.main">{stats.submitted}</Typography>
                </Box>
                <PendingIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
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
                    Under Review
                  </Typography>
                  <Typography variant="h4" color="warning.main">{stats.underReview}</Typography>
                </Box>
                <EditIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
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
          onRowClick={(params) => handleViewOpen(params.row as PendingCreditApplication)}
          sx={{
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
            },
          }}
        />
      </Paper>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Application Details - {selectedApplication?.applicationNumber}</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box sx={{ mt: 2 }}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                <Tab label="Customer Info" />
                <Tab label="Financial Details" />
                <Tab label="F&I Notes" />
              </Tabs>

              {tabValue === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Customer Name</Typography>
                    <Typography variant="body1">{selectedApplication.customerName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                    <Typography variant="body1">{selectedApplication.phone}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                    <Typography variant="body1">{selectedApplication.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">SSN</Typography>
                    <Typography variant="body1">{selectedApplication.ssn}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                    <Typography variant="body1">
                      {selectedApplication.address}, {selectedApplication.city}, {selectedApplication.state} {selectedApplication.zipCode}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Employer</Typography>
                    <Typography variant="body1">{selectedApplication.employer}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Monthly Income</Typography>
                    <Typography variant="body1">{formatCurrency(selectedApplication.monthlyIncome)}</Typography>
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <Grid container spacing={2}>
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
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Trade-In Value</Typography>
                    <Typography variant="body1">{formatCurrency(selectedApplication.tradeInValue)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Credit Score</Typography>
                    {selectedApplication.creditScore && (
                      <Chip 
                        label={selectedApplication.creditScore} 
                        color={selectedApplication.creditScore >= 700 ? 'success' : selectedApplication.creditScore >= 650 ? 'warning' : 'error'}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                    <Chip 
                      label={selectedApplication.status} 
                      color={getStatusColor(selectedApplication.status)} 
                      icon={
                        selectedApplication.status === 'Approved' || selectedApplication.status === 'Conditional' ? <CheckCircleIcon /> :
                        selectedApplication.status === 'Denied' ? <CancelIcon /> :
                        <PendingIcon />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Lender</Typography>
                    <Typography variant="body1">{selectedApplication.submittedTo}</Typography>
                  </Grid>
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
                </Grid>
              )}

              {tabValue === 2 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">F&I Manager</Typography>
                    <Typography variant="body1">{selectedApplication.fiManagerAssigned || 'Not assigned'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Follow-Up Date</Typography>
                    <Typography variant="body1">{selectedApplication.followUpDate || 'Not set'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Documents Received</Typography>
                    <Typography variant="body1">
                      {selectedApplication.documentsReceived && selectedApplication.documentsReceived.length > 0
                        ? selectedApplication.documentsReceived.join(', ')
                        : 'No documents uploaded yet'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Lender Notes</Typography>
                    <Typography variant="body1">{selectedApplication.lenderNotes || 'No notes'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Application Notes</Typography>
                    <Typography variant="body1">{selectedApplication.notes}</Typography>
                  </Grid>
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
                </Grid>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Approve/Deny Dialog */}
      <Dialog open={actionOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'approve' ? 'Approve Application' : 'Deny Application'}
        </DialogTitle>
        <DialogContent>
          {actionType === 'approve' ? (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Approved Amount"
                    type="number"
                    value={approvalData.approvedAmount}
                    onChange={(e) => setApprovalData({ ...approvalData, approvedAmount: parseFloat(e.target.value) })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="APR (%)"
                    type="number"
                    value={approvalData.apr}
                    onChange={(e) => setApprovalData({ ...approvalData, apr: parseFloat(e.target.value) })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Term (Months)"
                    value={approvalData.term}
                    onChange={(e) => setApprovalData({ ...approvalData, term: parseInt(e.target.value) })}
                    required
                  >
                    <MenuItem value={36}>36 months</MenuItem>
                    <MenuItem value={48}>48 months</MenuItem>
                    <MenuItem value={60}>60 months</MenuItem>
                    <MenuItem value={72}>72 months</MenuItem>
                    <MenuItem value={84}>84 months</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Monthly Payment"
                    type="number"
                    value={approvalData.monthlyPaymentApproved}
                    onChange={(e) => setApprovalData({ ...approvalData, monthlyPaymentApproved: parseFloat(e.target.value) })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Stipulations (if conditional approval)"
                    value={approvalData.stipulations}
                    onChange={(e) => setApprovalData({ ...approvalData, stipulations: e.target.value })}
                    multiline
                    rows={3}
                    helperText="Leave blank for full approval. Add requirements for conditional approval."
                  />
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Denial Reason"
                value={denialReason}
                onChange={(e) => setDenialReason(e.target.value)}
                multiline
                rows={4}
                required
                helperText="Provide a clear reason for the denial"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={actionType === 'approve' ? handleApprove : handleDeny} 
            variant="contained"
            color={actionType === 'approve' ? 'success' : 'error'}
          >
            {actionType === 'approve' ? 'Approve' : 'Deny'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Lender Dialog */}
      <Dialog open={assignLenderOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Assign Lender - {selectedApplication?.applicationNumber}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {selectedApplication?.submittedTo 
                ? `Currently assigned to: ${selectedApplication.submittedTo}` 
                : 'No lender currently assigned'}
            </Typography>
            <TextField
              fullWidth
              select
              label="Select Lender"
              value={selectedLender}
              onChange={(e) => setSelectedLender(e.target.value)}
              required
              helperText="Choose a lender to submit this application to"
            >
              {availableLenders.map((lender) => (
                <MenuItem key={lender} value={lender}>
                  {lender}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleAssignLender} 
            variant="contained"
            color="primary"
            disabled={!selectedLender}
          >
            Assign Lender
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingCreditApplications;
