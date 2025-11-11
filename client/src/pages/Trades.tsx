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
  Alert,
  LinearProgress,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BuildIcon from '@mui/icons-material/Build';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import WarningIcon from '@mui/icons-material/Warning';

interface TradeIn {
  id: number;
  tradeNumber: string;
  customerName: string;
  vehicleInfo: string;
  year: number;
  make: string;
  model: string;
  vin: string;
  mileage: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  appraisalValue: number;
  offerAmount: number;
  actualCashValue: number;
  bookValue: number;
  tradeInDate: string;
  status: 'Appraised' | 'Accepted' | 'In Reconditioning' | 'Ready for Sale' | 'Sold' | 'Wholesaled';
  reconditioningNeeds: ReconditioningItem[];
  reconditioningCost: number;
  estimatedRetailValue: number;
  potentialProfit: number;
  assignedTo: string;
  dealNumber: string;
  notes: string;
}

interface ReconditioningItem {
  id: number;
  category: 'Mechanical' | 'Body Work' | 'Interior' | 'Detail' | 'Tires' | 'Other';
  description: string;
  estimatedCost: number;
  actualCost: number;
  status: 'Needed' | 'In Progress' | 'Completed';
  completedDate: string;
}

const Trades: React.FC = () => {
  const [trades, setTrades] = useState<TradeIn[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedTrade, setSelectedTrade] = useState<TradeIn | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState<Partial<TradeIn>>({
    tradeNumber: '',
    customerName: '',
    vehicleInfo: '',
    year: new Date().getFullYear(),
    make: '',
    model: '',
    vin: '',
    mileage: 0,
    condition: 'Good',
    appraisalValue: 0,
    offerAmount: 0,
    actualCashValue: 0,
    bookValue: 0,
    tradeInDate: new Date().toISOString().split('T')[0],
    status: 'Appraised',
    reconditioningNeeds: [],
    reconditioningCost: 0,
    estimatedRetailValue: 0,
    potentialProfit: 0,
    assignedTo: '',
    dealNumber: '',
    notes: '',
  });

  // Mock data
  useEffect(() => {
    const mockTrades: TradeIn[] = [
      {
        id: 1,
        tradeNumber: 'TR-2025-1001',
        customerName: 'John Smith',
        vehicleInfo: '2020 Honda Accord Sport',
        year: 2020,
        make: 'Honda',
        model: 'Accord Sport',
        vin: '1HGCV1F30LA000001',
        mileage: 45000,
        condition: 'Good',
        appraisalValue: 18000,
        offerAmount: 17500,
        actualCashValue: 17500,
        bookValue: 19000,
        tradeInDate: '2025-11-05',
        status: 'Ready for Sale',
        reconditioningNeeds: [
          { id: 1, category: 'Detail', description: 'Full interior/exterior detail', estimatedCost: 200, actualCost: 200, status: 'Completed', completedDate: '2025-11-06' },
          { id: 2, category: 'Mechanical', description: 'Oil change and inspection', estimatedCost: 100, actualCost: 95, status: 'Completed', completedDate: '2025-11-06' },
          { id: 3, category: 'Tires', description: 'Replace front tires', estimatedCost: 400, actualCost: 380, status: 'Completed', completedDate: '2025-11-07' },
        ],
        reconditioningCost: 675,
        estimatedRetailValue: 21000,
        potentialProfit: 2825,
        assignedTo: 'Mike Wilson',
        dealNumber: 'DL-2025-1001',
        notes: 'Clean CarFax, one owner, well maintained',
      },
      {
        id: 2,
        tradeNumber: 'TR-2025-1002',
        customerName: 'Robert Taylor',
        vehicleInfo: '2018 Ford Explorer XLT',
        year: 2018,
        make: 'Ford',
        model: 'Explorer XLT',
        vin: '1FM5K8D82JGA00002',
        mileage: 72000,
        condition: 'Fair',
        appraisalValue: 14000,
        offerAmount: 15000,
        actualCashValue: 15000,
        bookValue: 16500,
        tradeInDate: '2025-11-10',
        status: 'In Reconditioning',
        reconditioningNeeds: [
          { id: 1, category: 'Body Work', description: 'Repair front bumper scratches', estimatedCost: 500, actualCost: 0, status: 'In Progress', completedDate: '' },
          { id: 2, category: 'Interior', description: 'Repair driver seat leather', estimatedCost: 300, actualCost: 0, status: 'Needed', completedDate: '' },
          { id: 3, category: 'Mechanical', description: 'Replace brake pads', estimatedCost: 350, actualCost: 350, status: 'Completed', completedDate: '2025-11-11' },
          { id: 4, category: 'Detail', description: 'Deep clean and detail', estimatedCost: 250, actualCost: 0, status: 'Needed', completedDate: '' },
        ],
        reconditioningCost: 1400,
        estimatedRetailValue: 19500,
        potentialProfit: 3100,
        assignedTo: 'Sarah Johnson',
        dealNumber: 'DL-2025-1003',
        notes: 'Minor cosmetic issues, mechanically sound',
      },
      {
        id: 3,
        tradeNumber: 'TR-2025-1003',
        customerName: 'Jennifer Wilson',
        vehicleInfo: '2019 Mazda CX-5 Grand Touring',
        year: 2019,
        make: 'Mazda',
        model: 'CX-5 Grand Touring',
        vin: 'JM3KFBDM5K0000003',
        mileage: 38000,
        condition: 'Excellent',
        appraisalValue: 19500,
        offerAmount: 20000,
        actualCashValue: 20000,
        bookValue: 21500,
        tradeInDate: '2025-11-11',
        status: 'Accepted',
        reconditioningNeeds: [
          { id: 1, category: 'Detail', description: 'Light detail', estimatedCost: 150, actualCost: 0, status: 'Needed', completedDate: '' },
          { id: 2, category: 'Mechanical', description: 'Pre-sale inspection', estimatedCost: 75, actualCost: 0, status: 'Needed', completedDate: '' },
        ],
        reconditioningCost: 225,
        estimatedRetailValue: 24500,
        potentialProfit: 4275,
        assignedTo: 'Mike Wilson',
        dealNumber: 'DL-2025-1004',
        notes: 'Excellent condition, certified pre-owned candidate',
      },
      {
        id: 4,
        tradeNumber: 'TR-2025-1004',
        customerName: 'Lisa Anderson',
        vehicleInfo: '2017 Subaru Outback 2.5i',
        year: 2017,
        make: 'Subaru',
        model: 'Outback 2.5i',
        vin: '4S4BSAFC5H3000004',
        mileage: 95000,
        condition: 'Good',
        appraisalValue: 11000,
        offerAmount: 11500,
        actualCashValue: 11500,
        bookValue: 13000,
        tradeInDate: '2025-11-07',
        status: 'Sold',
        reconditioningNeeds: [
          { id: 1, category: 'Detail', description: 'Full detail', estimatedCost: 200, actualCost: 200, status: 'Completed', completedDate: '2025-11-08' },
          { id: 2, category: 'Mechanical', description: 'Replace timing belt', estimatedCost: 600, actualCost: 575, status: 'Completed', completedDate: '2025-11-08' },
          { id: 3, category: 'Tires', description: 'Replace all four tires', estimatedCost: 700, actualCost: 680, status: 'Completed', completedDate: '2025-11-09' },
        ],
        reconditioningCost: 1455,
        estimatedRetailValue: 15500,
        potentialProfit: 2545,
        assignedTo: 'Sarah Johnson',
        dealNumber: 'DL-2025-1006',
        notes: 'Sold to wholesaler, quick turnaround',
      },
      {
        id: 5,
        tradeNumber: 'TR-2025-1005',
        customerName: 'Michael Brown',
        vehicleInfo: '2016 Chevrolet Silverado 1500',
        year: 2016,
        make: 'Chevrolet',
        model: 'Silverado 1500',
        vin: '1GCVKREC5GZ000005',
        mileage: 110000,
        condition: 'Fair',
        appraisalValue: 15000,
        offerAmount: 16000,
        actualCashValue: 16000,
        bookValue: 18000,
        tradeInDate: '2025-11-11',
        status: 'Appraised',
        reconditioningNeeds: [
          { id: 1, category: 'Body Work', description: 'Repair bed dents', estimatedCost: 800, actualCost: 0, status: 'Needed', completedDate: '' },
          { id: 2, category: 'Mechanical', description: 'Transmission service', estimatedCost: 250, actualCost: 0, status: 'Needed', completedDate: '' },
          { id: 3, category: 'Interior', description: 'Replace floor mats', estimatedCost: 100, actualCost: 0, status: 'Needed', completedDate: '' },
          { id: 4, category: 'Detail', description: 'Full detail', estimatedCost: 200, actualCost: 0, status: 'Needed', completedDate: '' },
        ],
        reconditioningCost: 1350,
        estimatedRetailValue: 21000,
        potentialProfit: 3650,
        assignedTo: '',
        dealNumber: 'DL-2025-1005',
        notes: 'High mileage but solid work truck potential',
      },
    ];
    setTrades(mockTrades);
  }, []);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filteredTrades = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return trades;
    }

    const searchTerm = normalizeText(trimmedQuery);

    return trades.filter((trade) => {
      if (normalizeText(trade.tradeNumber).includes(searchTerm)) return true;
      if (normalizeText(trade.customerName).includes(searchTerm)) return true;
      if (normalizeText(trade.vehicleInfo).includes(searchTerm)) return true;
      if (normalizeText(trade.vin).includes(searchTerm)) return true;
      if (normalizeText(trade.make).includes(searchTerm)) return true;
      if (normalizeText(trade.model).includes(searchTerm)) return true;
      if (normalizeText(trade.status).includes(searchTerm)) return true;
      if (normalizeText(trade.condition).includes(searchTerm)) return true;
      if (trade.assignedTo && normalizeText(trade.assignedTo).includes(searchTerm)) return true;
      if (trade.notes && normalizeText(trade.notes).includes(searchTerm)) return true;

      return false;
    });
  }, [trades, searchQuery]);

  const handleOpen = (tradeMode: 'add' | 'edit' | 'view', trade?: TradeIn) => {
    setMode(tradeMode);
    if (trade) {
      setSelectedTrade(trade);
      if (tradeMode === 'edit') {
        setFormData(trade);
      }
    } else {
      setFormData({
        tradeNumber: `TR-2025-${(trades.length + 1001).toString()}`,
        customerName: '',
        vehicleInfo: '',
        year: new Date().getFullYear(),
        make: '',
        model: '',
        vin: '',
        mileage: 0,
        condition: 'Good',
        appraisalValue: 0,
        offerAmount: 0,
        actualCashValue: 0,
        bookValue: 0,
        tradeInDate: new Date().toISOString().split('T')[0],
        status: 'Appraised',
        reconditioningNeeds: [],
        reconditioningCost: 0,
        estimatedRetailValue: 0,
        potentialProfit: 0,
        assignedTo: '',
        dealNumber: '',
        notes: '',
      });
    }
    if (tradeMode === 'view') {
      setViewOpen(true);
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedTrade(null);
    setTabValue(0);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSubmit = () => {
    if (mode === 'add') {
      const newTrade: TradeIn = {
        ...formData as TradeIn,
        id: trades.length + 1,
        vehicleInfo: `${formData.year} ${formData.make} ${formData.model}`,
      };
      setTrades([...trades, newTrade]);
    } else if (mode === 'edit' && selectedTrade) {
      const updatedTrades = trades.map(trade =>
        trade.id === selectedTrade.id ? { 
          ...trade, 
          ...formData,
          vehicleInfo: `${formData.year} ${formData.make} ${formData.model}`,
        } : trade
      );
      setTrades(updatedTrades);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this trade-in?')) {
      setTrades(trades.filter(trade => trade.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Appraised': return 'info';
      case 'Accepted': return 'primary';
      case 'In Reconditioning': return 'warning';
      case 'Ready for Sale': return 'success';
      case 'Sold': return 'default';
      case 'Wholesaled': return 'default';
      default: return 'default';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'success';
      case 'Good': return 'primary';
      case 'Fair': return 'warning';
      case 'Poor': return 'error';
      default: return 'default';
    }
  };

  const getReconditioningStatusColor = (status: string) => {
    switch (status) {
      case 'Needed': return 'default';
      case 'In Progress': return 'warning';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateReconditioningProgress = (items: ReconditioningItem[]): number => {
    if (items.length === 0) return 100;
    const completed = items.filter(item => item.status === 'Completed').length;
    return (completed / items.length) * 100;
  };

  // Statistics
  const stats = {
    total: filteredTrades.length,
    inReconditioning: filteredTrades.filter(t => t.status === 'In Reconditioning').length,
    readyForSale: filteredTrades.filter(t => t.status === 'Ready for Sale').length,
    totalValue: filteredTrades.reduce((sum, t) => sum + t.actualCashValue, 0),
    potentialProfit: filteredTrades.reduce((sum, t) => sum + t.potentialProfit, 0),
  };

  const columns: GridColDef[] = [
    { field: 'tradeNumber', headerName: 'Trade #', width: 120 },
    { field: 'vehicleInfo', headerName: 'Vehicle', width: 200 },
    { field: 'year', headerName: 'Year', width: 80 },
    {
      field: 'mileage',
      headerName: 'Mileage',
      width: 100,
      renderCell: (params: GridRenderCellParams) => 
        `${params.value.toLocaleString()} mi`,
    },
    {
      field: 'condition',
      headerName: 'Condition',
      width: 110,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value as string}
          color={getConditionColor(params.value as string) as any}
          size="small"
        />
      ),
    },
    {
      field: 'actualCashValue',
      headerName: 'ACV',
      width: 110,
      renderCell: (params: GridRenderCellParams) => formatCurrency(params.value as number),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value as string}
          color={getStatusColor(params.value as string) as any}
          size="small"
        />
      ),
    },
    {
      field: 'potentialProfit',
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
                handleOpen('view', params.row as TradeIn);
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
                handleOpen('edit', params.row as TradeIn);
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
          Trade-In Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen('add')}
        >
          Add Trade-In
        </Button>
      </Box>

      {/* Search Box */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search trade-ins by number, customer, vehicle, VIN, make, model, status, or notes..."
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
            Found {filteredTrades.length} of {trades.length} trade-ins
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
                    Total Trade-Ins
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
                    In Reconditioning
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {stats.inReconditioning}
                  </Typography>
                </Box>
                <BuildIcon sx={{ fontSize: 48, color: 'warning.main', opacity: 0.3 }} />
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
                    Ready for Sale
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {stats.readyForSale}
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
                    Potential Profit
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {formatCurrency(stats.potentialProfit)}
                  </Typography>
                </Box>
                <AttachMoneyIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Trade-Ins Data Grid */}
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredTrades}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          onRowClick={(params) => handleOpen('view', params.row as TradeIn)}
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
          {mode === 'add' ? 'Add Trade-In' : 'Edit Trade-In'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trade Number"
                value={formData.tradeNumber}
                onChange={(e) => setFormData({ ...formData, tradeNumber: e.target.value })}
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
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Make"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="VIN"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Condition"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
              >
                <MenuItem value="Excellent">Excellent</MenuItem>
                <MenuItem value="Good">Good</MenuItem>
                <MenuItem value="Fair">Fair</MenuItem>
                <MenuItem value="Poor">Poor</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <MenuItem value="Appraised">Appraised</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="In Reconditioning">In Reconditioning</MenuItem>
                <MenuItem value="Ready for Sale">Ready for Sale</MenuItem>
                <MenuItem value="Sold">Sold</MenuItem>
                <MenuItem value="Wholesaled">Wholesaled</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Appraisal Value"
                type="number"
                value={formData.appraisalValue}
                onChange={(e) => setFormData({ ...formData, appraisalValue: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Offer Amount"
                type="number"
                value={formData.offerAmount}
                onChange={(e) => setFormData({ ...formData, offerAmount: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Actual Cash Value (ACV)"
                type="number"
                value={formData.actualCashValue}
                onChange={(e) => setFormData({ ...formData, actualCashValue: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Book Value"
                type="number"
                value={formData.bookValue}
                onChange={(e) => setFormData({ ...formData, bookValue: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reconditioning Cost"
                type="number"
                value={formData.reconditioningCost}
                onChange={(e) => setFormData({ ...formData, reconditioningCost: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Retail Value"
                type="number"
                value={formData.estimatedRetailValue}
                onChange={(e) => setFormData({ ...formData, estimatedRetailValue: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trade-In Date"
                type="date"
                value={formData.tradeInDate}
                onChange={(e) => setFormData({ ...formData, tradeInDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Assigned To"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deal Number"
                value={formData.dealNumber}
                onChange={(e) => setFormData({ ...formData, dealNumber: e.target.value })}
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
            {mode === 'add' ? 'Add Trade-In' : 'Update Trade-In'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Trade-In Details</DialogTitle>
        <DialogContent>
          {selectedTrade && (
            <Box sx={{ mt: 1 }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
                <Tab label="Vehicle Information" />
                <Tab label="Appraisal & Value" />
                <Tab label="Reconditioning" />
              </Tabs>

              {/* Vehicle Information Tab */}
              {tabValue === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      {selectedTrade.tradeNumber} - {selectedTrade.vehicleInfo}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="primary">
                      Customer: {selectedTrade.customerName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">VIN</Typography>
                    <Typography>{selectedTrade.vin}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Mileage</Typography>
                    <Typography>{selectedTrade.mileage.toLocaleString()} miles</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Condition</Typography>
                    <Chip
                      label={selectedTrade.condition}
                      color={getConditionColor(selectedTrade.condition) as any}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Status</Typography>
                    <Chip
                      label={selectedTrade.status}
                      color={getStatusColor(selectedTrade.status) as any}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Trade-In Date</Typography>
                    <Typography>{selectedTrade.tradeInDate}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" variant="body2">Deal Number</Typography>
                    <Typography>{selectedTrade.dealNumber}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography color="textSecondary" variant="body2">Assigned To</Typography>
                    <Typography>{selectedTrade.assignedTo || 'Not assigned'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography color="textSecondary" variant="body2">Notes</Typography>
                    <Typography>{selectedTrade.notes || 'No notes'}</Typography>
                  </Grid>
                </Grid>
              )}

              {/* Appraisal & Value Tab */}
              {tabValue === 1 && (
                <Box>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell><strong>Book Value</strong></TableCell>
                          <TableCell align="right">{formatCurrency(selectedTrade.bookValue)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Appraisal Value</strong></TableCell>
                          <TableCell align="right">{formatCurrency(selectedTrade.appraisalValue)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Offer Amount</strong></TableCell>
                          <TableCell align="right">{formatCurrency(selectedTrade.offerAmount)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                          <TableCell><strong>Actual Cash Value (ACV)</strong></TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="bold" variant="h6">
                              {formatCurrency(selectedTrade.actualCashValue)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Reconditioning Cost</strong></TableCell>
                          <TableCell align="right" sx={{ color: 'error.main' }}>
                            ({formatCurrency(selectedTrade.reconditioningCost)})
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Estimated Retail Value</strong></TableCell>
                          <TableCell align="right">{formatCurrency(selectedTrade.estimatedRetailValue)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'success.light' }}>
                          <TableCell><strong>Potential Profit</strong></TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="bold" variant="h6" color="success.dark">
                              {formatCurrency(selectedTrade.potentialProfit)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {selectedTrade.potentialProfit < 1000 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Low profit margin - consider wholesaling this vehicle
                    </Alert>
                  )}
                  {selectedTrade.potentialProfit > 3000 && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      Excellent profit potential!
                    </Alert>
                  )}
                </Box>
              )}

              {/* Reconditioning Tab */}
              {tabValue === 2 && (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <BuildIcon sx={{ mr: 1 }} />
                      Reconditioning Progress
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={calculateReconditioningProgress(selectedTrade.reconditioningNeeds)}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                      {selectedTrade.reconditioningNeeds.filter(item => item.status === 'Completed').length} of{' '}
                      {selectedTrade.reconditioningNeeds.length} items completed (
                      {Math.round(calculateReconditioningProgress(selectedTrade.reconditioningNeeds))}%)
                    </Typography>
                  </Box>
                  {selectedTrade.reconditioningNeeds.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                            <TableCell align="right"><strong>Est. Cost</strong></TableCell>
                            <TableCell align="right"><strong>Actual Cost</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedTrade.reconditioningNeeds.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell align="right">{formatCurrency(item.estimatedCost)}</TableCell>
                              <TableCell align="right">
                                {item.actualCost > 0 ? formatCurrency(item.actualCost) : '-'}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={item.status}
                                  color={getReconditioningStatusColor(item.status) as any}
                                  size="small"
                                  icon={
                                    item.status === 'Completed' ? <CheckCircleIcon /> :
                                    item.status === 'In Progress' ? <PendingIcon /> :
                                    <WarningIcon />
                                  }
                                />
                                {item.completedDate && (
                                  <Typography variant="caption" display="block" color="textSecondary">
                                    {item.completedDate}
                                  </Typography>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell colSpan={2}><strong>Total Reconditioning Cost</strong></TableCell>
                            <TableCell align="right">
                              <strong>
                                {formatCurrency(selectedTrade.reconditioningNeeds.reduce((sum, item) => sum + item.estimatedCost, 0))}
                              </strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>
                                {formatCurrency(selectedTrade.reconditioningNeeds.reduce((sum, item) => sum + item.actualCost, 0))}
                              </strong>
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="info">No reconditioning items needed</Alert>
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
              if (selectedTrade) handleOpen('edit', selectedTrade);
            }}
            variant="contained"
          >
            Edit Trade-In
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Trades;
