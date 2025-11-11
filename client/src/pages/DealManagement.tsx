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
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShieldIcon from '@mui/icons-material/Shield';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ReplyIcon from '@mui/icons-material/Reply';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useDeals } from '../contexts/DealsContext';

interface FIProduct {
  id: number;
  dealNumber: string;
  customerName: string;
  vehicleInfo: string;
  financeAmount: number;
  apr: number;
  term: number;
  monthlyPayment: number;
  warranty: WarrantyProduct | null;
  gapInsurance: boolean;
  gapCost: number;
  aftermarketProducts: AftermarketProduct[];
  lender: string;
  dealDate: string;
  status: 'Pending' | 'Approved' | 'Funded' | 'Delivered';
  salesPerson: string;
  fiManager: string;
  totalProfit: number;
  notes: string;
  // Optional fields from original deal
  vehicleType?: 'New' | 'Used';
  salePrice?: number;
  tradeInValue?: number;
  tradeInVehicle?: string;
  downPayment?: number;
}

interface WarrantyProduct {
  type: string;
  provider: string;
  term: string;
  mileage: string;
  cost: number;
  retailPrice: number;
}

interface AftermarketProduct {
  id: number;
  name: string;
  category: string;
  cost: number;
  retailPrice: number;
}

const DealManagement: React.FC = () => {
  const { fiDeals, updateFIDeal, deleteFIDeal, returnDealToSales } = useDeals();
  const [deals, setDeals] = useState<FIProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedDeal, setSelectedDeal] = useState<FIProduct | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuDeal, setMenuDeal] = useState<FIProduct | null>(null);
  const [formData, setFormData] = useState<Partial<FIProduct>>({
    dealNumber: '',
    customerName: '',
    vehicleInfo: '',
    financeAmount: 0,
    apr: 0,
    term: 60,
    monthlyPayment: 0,
    warranty: null,
    gapInsurance: false,
    gapCost: 0,
    aftermarketProducts: [],
    lender: '',
    dealDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    salesPerson: '',
    fiManager: '',
    totalProfit: 0,
    notes: '',
  });

  // Mock data + context deals
  useEffect(() => {
    const mockDeals: FIProduct[] = [
      {
        id: 101,
        dealNumber: 'D-2025-1001',
        customerName: 'John Smith',
        vehicleInfo: '2024 Honda CR-V EX',
        financeAmount: 32000,
        apr: 4.9,
        term: 60,
        monthlyPayment: 601.85,
        warranty: {
          type: 'Extended Warranty',
          provider: 'Honda Care',
          term: '7 years',
          mileage: '100,000 miles',
          cost: 1200,
          retailPrice: 2400,
        },
        gapInsurance: true,
        gapCost: 595,
        aftermarketProducts: [
          { id: 1, name: 'Paint Protection', category: 'Protection', cost: 300, retailPrice: 899 },
          { id: 2, name: 'Window Tinting', category: 'Accessories', cost: 200, retailPrice: 499 },
        ],
        lender: 'Honda Financial',
        dealDate: '2025-11-08',
        status: 'Funded',
        salesPerson: 'Sarah Johnson',
        fiManager: 'Mike Wilson',
        totalProfit: 2503,
        notes: 'Customer very satisfied with F&I products',
      },
      {
        id: 102,
        dealNumber: 'D-2025-1002',
        customerName: 'Emily Davis',
        vehicleInfo: '2025 Toyota Camry XLE',
        financeAmount: 28500,
        apr: 3.9,
        term: 72,
        monthlyPayment: 446.32,
        warranty: {
          type: 'Platinum Coverage',
          provider: 'Toyota Extra Care',
          term: '8 years',
          mileage: '125,000 miles',
          cost: 1500,
          retailPrice: 3200,
        },
        gapInsurance: true,
        gapCost: 695,
        aftermarketProducts: [
          { id: 3, name: 'Ceramic Coating', category: 'Protection', cost: 400, retailPrice: 1299 },
        ],
        lender: 'Toyota Financial Services',
        dealDate: '2025-11-09',
        status: 'Approved',
        salesPerson: 'Mike Wilson',
        fiManager: 'Mike Wilson',
        totalProfit: 2604,
        notes: 'Ceramic coating applied before delivery',
      },
      {
        id: 103,
        dealNumber: 'D-2025-1003',
        customerName: 'Robert Taylor',
        vehicleInfo: '2024 Ford F-150 Lariat',
        financeAmount: 52000,
        apr: 5.5,
        term: 72,
        monthlyPayment: 842.21,
        warranty: null,
        gapInsurance: false,
        gapCost: 0,
        aftermarketProducts: [
          { id: 4, name: 'Bed Liner', category: 'Accessories', cost: 250, retailPrice: 699 },
          { id: 5, name: 'Tonneau Cover', category: 'Accessories', cost: 400, retailPrice: 1199 },
        ],
        lender: 'Ford Credit',
        dealDate: '2025-11-10',
        status: 'Pending',
        salesPerson: 'Sarah Johnson',
        fiManager: 'Mike Wilson',
        totalProfit: 1248,
        notes: 'Customer declined warranty and GAP',
      },
      {
        id: 104,
        dealNumber: 'D-2025-1004',
        customerName: 'Jennifer Wilson',
        vehicleInfo: '2025 Mazda CX-5 Touring',
        financeAmount: 29800,
        apr: 4.5,
        term: 60,
        monthlyPayment: 556.12,
        warranty: {
          type: 'Premium Protection',
          provider: 'Mazda Extended Warranty',
          term: '6 years',
          mileage: '75,000 miles',
          cost: 1100,
          retailPrice: 2100,
        },
        gapInsurance: true,
        gapCost: 595,
        aftermarketProducts: [],
        lender: 'Mazda Financial',
        dealDate: '2025-11-11',
        status: 'Delivered',
        salesPerson: 'Mike Wilson',
        fiManager: 'Mike Wilson',
        totalProfit: 1600,
        notes: 'Quick approval, delivered same day',
      },
      {
        id: 105,
        dealNumber: 'D-2025-1005',
        customerName: 'Michael Brown',
        vehicleInfo: '2024 Chevrolet Silverado 1500',
        financeAmount: 48000,
        apr: 6.2,
        term: 84,
        monthlyPayment: 710.45,
        warranty: {
          type: 'Gold Protection',
          provider: 'GM Protection Plan',
          term: '5 years',
          mileage: '60,000 miles',
          cost: 900,
          retailPrice: 1800,
        },
        gapInsurance: true,
        gapCost: 695,
        aftermarketProducts: [
          { id: 6, name: 'Running Boards', category: 'Accessories', cost: 350, retailPrice: 999 },
          { id: 7, name: 'Remote Start', category: 'Electronics', cost: 200, retailPrice: 599 },
        ],
        lender: 'GM Financial',
        dealDate: '2025-11-07',
        status: 'Funded',
        salesPerson: 'Sarah Johnson',
        fiManager: 'Mike Wilson',
        totalProfit: 2343,
        notes: 'Excellent F&I penetration',
      },
    ];
    // Merge mock deals with submitted deals from context
    const combinedDeals = [...mockDeals, ...fiDeals];
    setDeals(combinedDeals);
  }, [fiDeals]);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filteredDeals = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return deals;
    }

    const searchTerm = normalizeText(trimmedQuery);

    return deals.filter((deal) => {
      if (normalizeText(deal.dealNumber).includes(searchTerm)) return true;
      if (normalizeText(deal.customerName).includes(searchTerm)) return true;
      if (normalizeText(deal.vehicleInfo).includes(searchTerm)) return true;
      if (normalizeText(deal.lender).includes(searchTerm)) return true;
      if (normalizeText(deal.status).includes(searchTerm)) return true;
      if (normalizeText(deal.salesPerson).includes(searchTerm)) return true;
      if (normalizeText(deal.fiManager).includes(searchTerm)) return true;
      if (deal.notes && normalizeText(deal.notes).includes(searchTerm)) return true;

      return false;
    });
  }, [deals, searchQuery]);

  const handleOpen = (dealMode: 'add' | 'edit' | 'view', deal?: FIProduct) => {
    setMode(dealMode);
    if (deal) {
      setSelectedDeal(deal);
      if (dealMode === 'edit') {
        setFormData(deal);
      }
    } else {
      setFormData({
        dealNumber: `D-2025-${(deals.length + 1001).toString()}`,
        customerName: '',
        vehicleInfo: '',
        financeAmount: 0,
        apr: 0,
        term: 60,
        monthlyPayment: 0,
        warranty: null,
        gapInsurance: false,
        gapCost: 0,
        aftermarketProducts: [],
        lender: '',
        dealDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        salesPerson: '',
        fiManager: '',
        totalProfit: 0,
        notes: '',
      });
    }
    if (dealMode === 'view') {
      setViewOpen(true);
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedDeal(null);
    setTabValue(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, deal: FIProduct) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuDeal(deal);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuDeal(null);
  };

  const handleMenuAction = (action: 'view' | 'edit' | 'return' | 'delete') => {
    if (menuDeal) {
      switch (action) {
        case 'view':
          setSelectedDeal(menuDeal);
          setMode('view');
          setViewOpen(true);
          break;
        case 'edit':
          setSelectedDeal(menuDeal);
          setFormData(menuDeal);
          setMode('edit');
          setOpen(true);
          break;
        case 'return':
          handleReturnToSales(menuDeal.id);
          break;
        case 'delete':
          handleDelete(menuDeal.id);
          break;
      }
    }
    handleMenuClose();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const calculateMonthlyPayment = (amount: number, apr: number, term: number): number => {
    if (amount <= 0 || apr <= 0 || term <= 0) return 0;
    const monthlyRate = apr / 100 / 12;
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    return Math.round(payment * 100) / 100;
  };

  const handleFinanceChange = () => {
    const payment = calculateMonthlyPayment(
      formData.financeAmount || 0,
      formData.apr || 0,
      formData.term || 60
    );
    setFormData({ ...formData, monthlyPayment: payment });
  };

  const handleSubmit = () => {
    if (mode === 'add') {
      const newDeal: FIProduct = {
        ...formData as FIProduct,
        id: deals.length + 1,
      };
      setDeals([...deals, newDeal]);
      // Also add to context if it's a new F&I deal
      // Note: We don't add to context here since this is for manually created F&I deals
      // Context is only for deals submitted from the Deals page
    } else if (mode === 'edit' && selectedDeal) {
      const updatedDeal = { ...selectedDeal, ...formData };
      const updatedDeals = deals.map(deal =>
        deal.id === selectedDeal.id ? updatedDeal : deal
      );
      setDeals(updatedDeals);
      // Update in context if this deal was submitted from Deals page
      // Check if deal exists in fiDeals (submitted deals have lower IDs)
      if (fiDeals.some(d => d.id === selectedDeal.id)) {
        updateFIDeal(updatedDeal as FIProduct);
      }
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this F&I deal?')) {
      setDeals(deals.filter(deal => deal.id !== id));
      // Delete from context if this deal was submitted from Deals page
      if (fiDeals.some(d => d.id === id)) {
        deleteFIDeal(id);
      }
    }
  };

  const handleReturnToSales = (deal: FIProduct) => {
    if (window.confirm(`Return deal ${deal.dealNumber} to Sales?\n\nThis will move the deal back to the Deals page under Road to Sale.`)) {
      // Convert and add to returned deals
      returnDealToSales(deal);
      
      // Remove from F&I deals
      setDeals(deals.filter(d => d.id !== deal.id));
      
      // Remove from context if it was submitted
      if (fiDeals.some(d => d.id === deal.id)) {
        deleteFIDeal(deal.id);
      }
      
      alert(`Deal ${deal.dealNumber} has been returned to Sales. It will appear in the Deals page.`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Approved': return 'info';
      case 'Funded': return 'success';
      case 'Delivered': return 'default';
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
    total: filteredDeals.length,
    totalVolume: filteredDeals.reduce((sum, d) => sum + d.financeAmount, 0),
    totalProfit: filteredDeals.reduce((sum, d) => sum + d.totalProfit, 0),
    avgDeal: filteredDeals.length > 0 ? filteredDeals.reduce((sum, d) => sum + d.financeAmount, 0) / filteredDeals.length : 0,
  };

  const columns: GridColDef[] = [
    { field: 'dealNumber', headerName: 'Deal #', width: 130 },
    { field: 'customerName', headerName: 'Customer', width: 150 },
    { field: 'vehicleInfo', headerName: 'Vehicle', width: 180 },
    {
      field: 'financeAmount',
      headerName: 'Finance Amount',
      width: 140,
      renderCell: (params: GridRenderCellParams) => formatCurrency(params.value as number),
    },
    {
      field: 'monthlyPayment',
      headerName: 'Payment',
      width: 110,
      renderCell: (params: GridRenderCellParams) => formatCurrency(params.value as number),
    },
    { field: 'lender', headerName: 'Lender', width: 150 },
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
    {
      field: 'totalProfit',
      headerName: 'Profit',
      width: 110,
      renderCell: (params: GridRenderCellParams) => (
        <Typography color="success.main" fontWeight="bold">
          {formatCurrency(params.value as number)}
        </Typography>
      ),
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
              onClick={(e) => handleMenuOpen(e, params.row as FIProduct)}
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
          F&I Deal Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen('add')}
        >
          Add New F&I Deal
        </Button>
      </Box>

      {/* Search Box */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search F&I deals by deal number, customer, vehicle, lender, status, or notes..."
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
            Found {filteredDeals.length} of {deals.length} deals
          </Typography>
        )}
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Deals
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.total}
                  </Typography>
                </Box>
                <DirectionsCarIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
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
                    Total Volume
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                    {formatCurrency(stats.totalVolume)}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, color: 'info.main', opacity: 0.3 }} />
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
                    Total Profit
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {formatCurrency(stats.totalProfit)}
                  </Typography>
                </Box>
                <AttachMoneyIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
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
                    Avg Deal Size
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {formatCurrency(stats.avgDeal)}
                  </Typography>
                </Box>
                <ShieldIcon sx={{ fontSize: 48, color: 'warning.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Deals Data Grid */}
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredDeals}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          onRowClick={(params) => handleOpen('view', params.row as FIProduct)}
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
          {mode === 'add' ? 'Add New F&I Deal' : 'Edit F&I Deal'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deal Number"
                value={formData.dealNumber}
                onChange={(e) => setFormData({ ...formData, dealNumber: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vehicle Information"
                value={formData.vehicleInfo}
                onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Finance Amount"
                type="number"
                value={formData.financeAmount}
                onChange={(e) => {
                  setFormData({ ...formData, financeAmount: parseFloat(e.target.value) });
                }}
                onBlur={handleFinanceChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="APR"
                type="number"
                value={formData.apr}
                onChange={(e) => setFormData({ ...formData, apr: parseFloat(e.target.value) })}
                onBlur={handleFinanceChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Term (Months)"
                value={formData.term}
                onChange={(e) => {
                  setFormData({ ...formData, term: parseInt(e.target.value) });
                }}
                onBlur={handleFinanceChange}
              >
                <MenuItem value={36}>36 months</MenuItem>
                <MenuItem value={48}>48 months</MenuItem>
                <MenuItem value={60}>60 months</MenuItem>
                <MenuItem value={72}>72 months</MenuItem>
                <MenuItem value={84}>84 months</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly Payment"
                type="number"
                value={formData.monthlyPayment}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lender"
                value={formData.lender}
                onChange={(e) => setFormData({ ...formData, lender: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sales Person"
                value={formData.salesPerson}
                onChange={(e) => setFormData({ ...formData, salesPerson: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="F&I Manager"
                value={formData.fiManager}
                onChange={(e) => setFormData({ ...formData, fiManager: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Funded">Funded</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deal Date"
                type="date"
                value={formData.dealDate}
                onChange={(e) => setFormData({ ...formData, dealDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {mode === 'add' ? 'Add Deal' : 'Update Deal'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>F&I Deal Details</DialogTitle>
        <DialogContent>
          {selectedDeal && (
            <Box sx={{ mt: 1 }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
                <Tab label="Deal Information" />
                <Tab label="F&I Products" />
              </Tabs>

              {/* Deal Information Tab */}
              {tabValue === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      {selectedDeal.dealNumber} - {selectedDeal.customerName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="primary">
                      {selectedDeal.vehicleInfo}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Finance Amount</Typography>
                    <Typography variant="h6">{formatCurrency(selectedDeal.financeAmount)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Monthly Payment</Typography>
                    <Typography variant="h6">{formatCurrency(selectedDeal.monthlyPayment)}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="textSecondary" variant="body2">APR</Typography>
                    <Typography>{selectedDeal.apr}%</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="textSecondary" variant="body2">Term</Typography>
                    <Typography>{selectedDeal.term} months</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="textSecondary" variant="body2">Lender</Typography>
                    <Typography>{selectedDeal.lender}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Status</Typography>
                    <Chip
                      label={selectedDeal.status}
                      color={getStatusColor(selectedDeal.status) as any}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Total Profit</Typography>
                    <Typography variant="h6" color="success.main">
                      {formatCurrency(selectedDeal.totalProfit)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Sales Person</Typography>
                    <Typography>{selectedDeal.salesPerson}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">F&I Manager</Typography>
                    <Typography>{selectedDeal.fiManager}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography color="textSecondary" variant="body2">Notes</Typography>
                    <Typography>{selectedDeal.notes || 'No notes'}</Typography>
                  </Grid>
                </Grid>
              )}

              {/* F&I Products Tab */}
              {tabValue === 1 && (
                <Box>
                  {/* Warranty */}
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    <ShieldIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Warranty Coverage
                  </Typography>
                  {selectedDeal.warranty ? (
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell>{selectedDeal.warranty.type}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Provider</strong></TableCell>
                            <TableCell>{selectedDeal.warranty.provider}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Coverage</strong></TableCell>
                            <TableCell>{selectedDeal.warranty.term} / {selectedDeal.warranty.mileage}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Cost</strong></TableCell>
                            <TableCell>{formatCurrency(selectedDeal.warranty.cost)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Retail Price</strong></TableCell>
                            <TableCell>{formatCurrency(selectedDeal.warranty.retailPrice)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Profit</strong></TableCell>
                            <TableCell>
                              <Typography color="success.main" fontWeight="bold">
                                {formatCurrency(selectedDeal.warranty.retailPrice - selectedDeal.warranty.cost)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="textSecondary" sx={{ mb: 3 }}>No warranty purchased</Typography>
                  )}

                  {/* GAP Insurance */}
                  <Typography variant="h6" gutterBottom>
                    <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    GAP Insurance
                  </Typography>
                  {selectedDeal.gapInsurance ? (
                    <Box sx={{ mb: 3 }}>
                      <Chip label="Included" color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2" display="inline">
                        Cost: {formatCurrency(selectedDeal.gapCost)}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography color="textSecondary" sx={{ mb: 3 }}>Not purchased</Typography>
                  )}

                  {/* Aftermarket Products */}
                  <Typography variant="h6" gutterBottom>
                    <DirectionsCarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Aftermarket Products
                  </Typography>
                  {selectedDeal.aftermarketProducts && selectedDeal.aftermarketProducts.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Product</strong></TableCell>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell align="right"><strong>Cost</strong></TableCell>
                            <TableCell align="right"><strong>Retail</strong></TableCell>
                            <TableCell align="right"><strong>Profit</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedDeal.aftermarketProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell align="right">{formatCurrency(product.cost)}</TableCell>
                              <TableCell align="right">{formatCurrency(product.retailPrice)}</TableCell>
                              <TableCell align="right">
                                <Typography color="success.main" fontWeight="bold">
                                  {formatCurrency(product.retailPrice - product.cost)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="textSecondary">No aftermarket products</Typography>
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
              if (selectedDeal) handleOpen('edit', selectedDeal);
            }}
            variant="contained"
          >
            Edit Deal
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
          Edit Deal
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('return')}>
          <ListItemIcon>
            <ReplyIcon fontSize="small" color="warning" />
          </ListItemIcon>
          Return to Sales
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete Deal
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DealManagement;
