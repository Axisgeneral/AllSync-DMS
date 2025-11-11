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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  LinearProgress,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PercentIcon from '@mui/icons-material/Percent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface LendingProgram {
  id: number;
  name: string;
  minCreditScore: number;
  maxCreditScore: number;
  minAPR: number;
  maxAPR: number;
  maxTerm: number;
  maxLTV: number;
  description: string;
}

interface Lender {
  id: number;
  lenderName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'Active' | 'Inactive' | 'Pending';
  tierRating: 'A' | 'B' | 'C' | 'D';
  avgApprovalRate: number;
  avgFundingTime: number; // days
  totalApplications: number;
  approvedApplications: number;
  avgAPR: number;
  specialties: string[];
  lendingPrograms: LendingProgram[];
  notes: string;
  lastContactDate: string;
  partnerSince: string;
}

const LenderManagement: React.FC = () => {
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedLender, setSelectedLender] = useState<Lender | null>(null);
  const [formData, setFormData] = useState<Partial<Lender>>({
    lenderName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    status: 'Active',
    tierRating: 'A',
    avgApprovalRate: 0,
    avgFundingTime: 0,
    totalApplications: 0,
    approvedApplications: 0,
    avgAPR: 0,
    specialties: [],
    lendingPrograms: [],
    notes: '',
    lastContactDate: new Date().toISOString().split('T')[0],
    partnerSince: new Date().toISOString().split('T')[0],
  });

  // Mock data
  useEffect(() => {
    const mockLenders: Lender[] = [
      {
        id: 1,
        lenderName: 'Honda Financial Services',
        contactPerson: 'Sarah Mitchell',
        email: 'sarah.mitchell@hondafinancial.com',
        phone: '(800) 555-0101',
        website: 'www.hondafinancialservices.com',
        address: '200 Honda Plaza',
        city: 'Torrance',
        state: 'CA',
        zipCode: '90501',
        status: 'Active',
        tierRating: 'A',
        avgApprovalRate: 78,
        avgFundingTime: 3,
        totalApplications: 156,
        approvedApplications: 122,
        avgAPR: 4.8,
        specialties: ['New Honda Vehicles', 'Certified Pre-Owned', 'Prime Credit'],
        lendingPrograms: [
          {
            id: 1,
            name: 'Prime Rate Program',
            minCreditScore: 720,
            maxCreditScore: 850,
            minAPR: 3.9,
            maxAPR: 5.9,
            maxTerm: 72,
            maxLTV: 120,
            description: 'Best rates for excellent credit customers',
          },
          {
            id: 2,
            name: 'Standard Rate Program',
            minCreditScore: 650,
            maxCreditScore: 719,
            minAPR: 5.9,
            maxAPR: 8.9,
            maxTerm: 72,
            maxLTV: 110,
            description: 'Competitive rates for good credit',
          },
        ],
        notes: 'Excellent partner, fast approvals, great for Honda and Acura vehicles',
        lastContactDate: '2025-11-08',
        partnerSince: '2020-03-15',
      },
      {
        id: 2,
        lenderName: 'Toyota Financial Services',
        contactPerson: 'Michael Chen',
        email: 'michael.chen@toyotafinancial.com',
        phone: '(800) 555-0102',
        website: 'www.toyotafinancial.com',
        address: '19001 S Western Ave',
        city: 'Torrance',
        state: 'CA',
        zipCode: '90501',
        status: 'Active',
        tierRating: 'A',
        avgApprovalRate: 82,
        avgFundingTime: 2,
        totalApplications: 203,
        approvedApplications: 167,
        avgAPR: 4.5,
        specialties: ['New Toyota/Lexus', 'Certified Pre-Owned', 'Lease Buyouts'],
        lendingPrograms: [
          {
            id: 3,
            name: 'Premier Credit',
            minCreditScore: 720,
            maxCreditScore: 850,
            minAPR: 3.5,
            maxAPR: 5.5,
            maxTerm: 75,
            maxLTV: 125,
            description: 'Premium program for top-tier credit',
          },
          {
            id: 4,
            name: 'Select Credit',
            minCreditScore: 680,
            maxCreditScore: 719,
            minAPR: 5.5,
            maxAPR: 7.9,
            maxTerm: 72,
            maxLTV: 115,
            description: 'Great rates for strong credit profiles',
          },
        ],
        notes: 'Top-tier lender, excellent approval rates, very competitive APRs',
        lastContactDate: '2025-11-10',
        partnerSince: '2019-08-20',
      },
      {
        id: 3,
        lenderName: 'Chase Auto Finance',
        contactPerson: 'Jennifer Rodriguez',
        email: 'jennifer.rodriguez@chase.com',
        phone: '(800) 555-0103',
        website: 'www.chase.com/auto',
        address: '270 Park Avenue',
        city: 'New York',
        state: 'NY',
        zipCode: '10017',
        status: 'Active',
        tierRating: 'A',
        avgApprovalRate: 71,
        avgFundingTime: 4,
        totalApplications: 189,
        approvedApplications: 134,
        avgAPR: 5.9,
        specialties: ['All Makes & Models', 'Refinancing', 'Near-Prime Credit'],
        lendingPrograms: [
          {
            id: 5,
            name: 'Preferred Auto',
            minCreditScore: 700,
            maxCreditScore: 850,
            minAPR: 4.9,
            maxAPR: 6.9,
            maxTerm: 84,
            maxLTV: 120,
            description: 'Flexible terms for qualified buyers',
          },
          {
            id: 6,
            name: 'Standard Auto',
            minCreditScore: 620,
            maxCreditScore: 699,
            minAPR: 6.9,
            maxAPR: 11.9,
            maxTerm: 72,
            maxLTV: 110,
            description: 'Accessible financing for broader credit range',
          },
        ],
        notes: 'Good for various credit tiers, slower funding than captive lenders',
        lastContactDate: '2025-11-05',
        partnerSince: '2021-01-10',
      },
      {
        id: 4,
        lenderName: 'Capital One Auto Finance',
        contactPerson: 'David Thompson',
        email: 'david.thompson@capitalone.com',
        phone: '(800) 555-0104',
        website: 'www.capitalone.com/auto',
        address: '1680 Capital One Drive',
        city: 'McLean',
        state: 'VA',
        zipCode: '22102',
        status: 'Active',
        tierRating: 'B',
        avgApprovalRate: 65,
        avgFundingTime: 5,
        totalApplications: 145,
        approvedApplications: 94,
        avgAPR: 7.2,
        specialties: ['Subprime', 'Used Vehicles', 'Rebuild Credit'],
        lendingPrograms: [
          {
            id: 7,
            name: 'Prime Auto',
            minCreditScore: 660,
            maxCreditScore: 850,
            minAPR: 5.9,
            maxAPR: 8.9,
            maxTerm: 75,
            maxLTV: 115,
            description: 'Competitive rates for good credit',
          },
          {
            id: 8,
            name: 'Second Chance Auto',
            minCreditScore: 550,
            maxCreditScore: 659,
            minAPR: 9.9,
            maxAPR: 17.9,
            maxTerm: 60,
            maxLTV: 100,
            description: 'Help customers rebuild credit',
          },
        ],
        notes: 'Great for customers with credit challenges, slower approvals',
        lastContactDate: '2025-11-03',
        partnerSince: '2022-06-15',
      },
      {
        id: 5,
        lenderName: 'Wells Fargo Dealer Services',
        contactPerson: 'Amanda Wilson',
        email: 'amanda.wilson@wellsfargo.com',
        phone: '(800) 555-0105',
        website: 'www.wellsfargo.com/dealerservices',
        address: '1 Wells Fargo Center',
        city: 'Charlotte',
        state: 'NC',
        zipCode: '28202',
        status: 'Active',
        tierRating: 'A',
        avgApprovalRate: 74,
        avgFundingTime: 3,
        totalApplications: 178,
        approvedApplications: 132,
        avgAPR: 5.5,
        specialties: ['All Credit Tiers', 'Commercial Vehicles', 'Fleet Financing'],
        lendingPrograms: [
          {
            id: 9,
            name: 'Platinum Plus',
            minCreditScore: 720,
            maxCreditScore: 850,
            minAPR: 4.5,
            maxAPR: 6.5,
            maxTerm: 84,
            maxLTV: 125,
            description: 'Premium financing for excellent credit',
          },
          {
            id: 10,
            name: 'Gold Select',
            minCreditScore: 640,
            maxCreditScore: 719,
            minAPR: 6.5,
            maxAPR: 9.9,
            maxTerm: 75,
            maxLTV: 110,
            description: 'Flexible options for good credit',
          },
        ],
        notes: 'Reliable partner with diverse programs, good commercial vehicle financing',
        lastContactDate: '2025-11-09',
        partnerSince: '2020-11-01',
      },
    ];
    setLenders(mockLenders);
  }, []);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filteredLenders = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return lenders;
    }

    const searchTerm = normalizeText(trimmedQuery);

    return lenders.filter((lender) => {
      if (normalizeText(lender.lenderName).includes(searchTerm)) return true;
      if (normalizeText(lender.contactPerson).includes(searchTerm)) return true;
      if (normalizeText(lender.status).includes(searchTerm)) return true;
      if (normalizeText(lender.tierRating).includes(searchTerm)) return true;
      if (lender.specialties.some(s => normalizeText(s).includes(searchTerm))) return true;
      if (lender.notes && normalizeText(lender.notes).includes(searchTerm)) return true;

      return false;
    });
  }, [lenders, searchQuery]);

  const handleOpen = (lenderMode: 'add' | 'edit' | 'view', lender?: Lender) => {
    setMode(lenderMode);
    if (lender) {
      setSelectedLender(lender);
      if (lenderMode === 'view') {
        setViewOpen(true);
      } else {
        setFormData(lender);
        setOpen(true);
      }
    } else {
      setFormData({
        lenderName: '',
        contactPerson: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        status: 'Active',
        tierRating: 'A',
        avgApprovalRate: 0,
        avgFundingTime: 0,
        totalApplications: 0,
        approvedApplications: 0,
        avgAPR: 0,
        specialties: [],
        lendingPrograms: [],
        notes: '',
        lastContactDate: new Date().toISOString().split('T')[0],
        partnerSince: new Date().toISOString().split('T')[0],
      });
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedLender(null);
  };

  const handleSubmit = () => {
    if (mode === 'add') {
      const newLender: Lender = {
        ...formData as Lender,
        id: lenders.length + 1,
      };
      setLenders([...lenders, newLender]);
    } else if (mode === 'edit' && selectedLender) {
      const updatedLenders = lenders.map(lender =>
        lender.id === selectedLender.id ? { ...lender, ...formData } : lender
      );
      setLenders(updatedLenders);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this lender?')) {
      setLenders(lenders.filter(lender => lender.id !== id));
    }
  };

  const handleChange = (field: keyof Lender, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'error';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'A': return 'success';
      case 'B': return 'info';
      case 'C': return 'warning';
      case 'D': return 'error';
      default: return 'default';
    }
  };

  // Statistics
  const stats = {
    total: filteredLenders.length,
    active: filteredLenders.filter(l => l.status === 'Active').length,
    avgApprovalRate: filteredLenders.length > 0
      ? filteredLenders.reduce((sum, l) => sum + l.avgApprovalRate, 0) / filteredLenders.length
      : 0,
    avgFundingTime: filteredLenders.length > 0
      ? filteredLenders.reduce((sum, l) => sum + l.avgFundingTime, 0) / filteredLenders.length
      : 0,
  };

  const columns: GridColDef[] = [
    { field: 'lenderName', headerName: 'Lender Name', width: 220 },
    { field: 'contactPerson', headerName: 'Contact', width: 150 },
    { field: 'phone', headerName: 'Phone', width: 140 },
    {
      field: 'tierRating',
      headerName: 'Tier',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={`Tier ${params.value}`} 
          color={getTierColor(params.value as string)} 
          size="small"
        />
      ),
    },
    {
      field: 'avgApprovalRate',
      headerName: 'Approval Rate',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={params.value as number} 
            sx={{ width: 60 }}
            color={params.value >= 75 ? 'success' : params.value >= 60 ? 'warning' : 'error'}
          />
          <Typography variant="body2">{params.value}%</Typography>
        </Box>
      ),
    },
    {
      field: 'avgFundingTime',
      headerName: 'Avg Funding',
      width: 120,
      renderCell: (params: GridRenderCellParams) => `${params.value} days`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value as string} 
          color={getStatusColor(params.value as string)} 
          size="small"
          icon={params.value === 'Active' ? <CheckCircleIcon /> : undefined}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="info"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen('view', params.row as Lender);
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen('edit', params.row as Lender);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(params.row.id);
              }}
            >
              <DeleteIcon fontSize="small" />
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
          Lender Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen('add')}
        >
          Add New Lender
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
                    Total Lenders
                  </Typography>
                  <Typography variant="h4">{stats.total}</Typography>
                </Box>
                <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
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
                    Active Lenders
                  </Typography>
                  <Typography variant="h4" color="success.main">{stats.active}</Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
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
                    Avg Approval Rate
                  </Typography>
                  <Typography variant="h4">{stats.avgApprovalRate.toFixed(1)}%</Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
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
                    Avg Funding Time
                  </Typography>
                  <Typography variant="h4">{stats.avgFundingTime.toFixed(1)} days</Typography>
                </Box>
                <PercentIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by lender name, contact, tier, status, specialties..."
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
          rows={filteredLenders}
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
          {mode === 'add' ? 'Add New Lender' : 'Edit Lender'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Lender Name"
                  value={formData.lenderName}
                  onChange={(e) => handleChange('lenderName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Person"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange('contactPerson', e.target.value)}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="State"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Zip Code"
                  value={formData.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                />
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
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Tier Rating"
                  value={formData.tierRating}
                  onChange={(e) => handleChange('tierRating', e.target.value)}
                  required
                >
                  <MenuItem value="A">Tier A (Prime)</MenuItem>
                  <MenuItem value="B">Tier B (Near-Prime)</MenuItem>
                  <MenuItem value="C">Tier C (Subprime)</MenuItem>
                  <MenuItem value="D">Tier D (Deep Subprime)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Partner Since"
                  type="date"
                  value={formData.partnerSince}
                  onChange={(e) => handleChange('partnerSince', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Contact Date"
                  type="date"
                  value={formData.lastContactDate}
                  onChange={(e) => handleChange('lastContactDate', e.target.value)}
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
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {mode === 'add' ? 'Add Lender' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedLender?.lenderName}</DialogTitle>
        <DialogContent>
          {selectedLender && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Contact Information</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Contact Person</Typography>
                  <Typography variant="body1">{selectedLender.contactPerson}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                  <Typography variant="body1">{selectedLender.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  <Typography variant="body1">{selectedLender.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Website</Typography>
                  <Typography variant="body1">{selectedLender.website}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                  <Typography variant="body1">
                    {selectedLender.address}, {selectedLender.city}, {selectedLender.state} {selectedLender.zipCode}
                  </Typography>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Tier Rating</Typography>
                  <Chip 
                    label={`Tier ${selectedLender.tierRating}`} 
                    color={getTierColor(selectedLender.tierRating)} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip 
                    label={selectedLender.status} 
                    color={getStatusColor(selectedLender.status)} 
                    icon={selectedLender.status === 'Active' ? <CheckCircleIcon /> : undefined}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Approval Rate</Typography>
                  <Typography variant="body1">{selectedLender.avgApprovalRate}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Average Funding Time</Typography>
                  <Typography variant="body1">{selectedLender.avgFundingTime} days</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Total Applications</Typography>
                  <Typography variant="body1">{selectedLender.totalApplications}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Approved Applications</Typography>
                  <Typography variant="body1">{selectedLender.approvedApplications}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Average APR</Typography>
                  <Typography variant="body1">{selectedLender.avgAPR}%</Typography>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Specialties</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedLender.specialties.map((specialty, index) => (
                      <Chip key={index} label={specialty} color="primary" variant="outlined" />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Lending Programs</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Program</strong></TableCell>
                          <TableCell><strong>Credit Score</strong></TableCell>
                          <TableCell><strong>APR Range</strong></TableCell>
                          <TableCell><strong>Max Term</strong></TableCell>
                          <TableCell><strong>Max LTV</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedLender.lendingPrograms.map((program) => (
                          <TableRow key={program.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">{program.name}</Typography>
                              <Typography variant="caption" color="textSecondary">{program.description}</Typography>
                            </TableCell>
                            <TableCell>{program.minCreditScore} - {program.maxCreditScore}</TableCell>
                            <TableCell>{program.minAPR}% - {program.maxAPR}%</TableCell>
                            <TableCell>{program.maxTerm} months</TableCell>
                            <TableCell>{program.maxLTV}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {selectedLender.notes && (
                  <>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="h6" gutterBottom>Notes</Typography>
                      <Divider sx={{ mb: 2 }} />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">{selectedLender.notes}</Typography>
                    </Grid>
                  </>
                )}

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Partnership Details</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Partner Since</Typography>
                  <Typography variant="body1">{selectedLender.partnerSince}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Last Contact</Typography>
                  <Typography variant="body1">{selectedLender.lastContactDate}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LenderManagement;
