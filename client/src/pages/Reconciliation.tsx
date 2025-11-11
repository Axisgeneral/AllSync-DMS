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
  IconButton,
  Chip,
  Card,
  CardContent,
  InputAdornment,
  Tooltip,
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';

interface Transaction {
  id: number;
  date: string;
  description: string;
  type: 'Debit' | 'Credit';
  amount: number;
  matched: boolean;
  matchedTransactionId?: number;
}

interface Reconciliation {
  id: number;
  accountName: string;
  accountNumber: string;
  accountType: 'Bank' | 'Credit Card' | 'Loan';
  statementDate: string;
  statementEndingBalance: number;
  bookBalance: number;
  difference: number;
  status: 'Not Started' | 'In Progress' | 'Reconciled' | 'Discrepancy';
  reconciledBy?: string;
  reconciledDate?: string;
  transactions: Transaction[];
  notes: string;
}

const Reconciliation: React.FC = () => {
  const [reconciliations, setReconciliations] = useState<Reconciliation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRecon, setSelectedRecon] = useState<Reconciliation | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState<Partial<Reconciliation>>({
    accountName: '',
    accountNumber: '',
    accountType: 'Bank',
    statementDate: new Date().toISOString().split('T')[0],
    statementEndingBalance: 0,
    bookBalance: 0,
    difference: 0,
    status: 'Not Started',
    notes: '',
  });

  // Mock data
  useEffect(() => {
    const mockReconciliations: Reconciliation[] = [
      {
        id: 1,
        accountName: 'Operating Account',
        accountNumber: '****1234',
        accountType: 'Bank',
        statementDate: '2025-10-31',
        statementEndingBalance: 125450.75,
        bookBalance: 125450.75,
        difference: 0,
        status: 'Reconciled',
        reconciledBy: 'Jane Smith',
        reconciledDate: '2025-11-01',
        transactions: [
          { id: 1, date: '2025-10-28', description: 'Customer Payment - Invoice #1001', type: 'Credit', amount: 5000, matched: true },
          { id: 2, date: '2025-10-29', description: 'Vendor Payment - Parts Supplier', type: 'Debit', amount: 2500, matched: true },
          { id: 3, date: '2025-10-30', description: 'Payroll Deposit', type: 'Debit', amount: 15000, matched: true },
        ],
        notes: 'All transactions matched. Account reconciled successfully.',
      },
      {
        id: 2,
        accountName: 'Payroll Account',
        accountNumber: '****5678',
        accountType: 'Bank',
        statementDate: '2025-11-10',
        statementEndingBalance: 45200.00,
        bookBalance: 45350.00,
        difference: -150.00,
        status: 'Discrepancy',
        transactions: [
          { id: 4, date: '2025-11-01', description: 'Payroll Transfer', type: 'Credit', amount: 50000, matched: true },
          { id: 5, date: '2025-11-05', description: 'Payroll Processing', type: 'Debit', amount: 4800, matched: true },
          { id: 6, date: '2025-11-08', description: 'Service Fee', type: 'Debit', amount: 50, matched: false },
        ],
        notes: 'Investigating $150 discrepancy. Likely bank fee not recorded.',
      },
      {
        id: 3,
        accountName: 'Business Credit Card',
        accountNumber: '****9012',
        accountType: 'Credit Card',
        statementDate: '2025-11-10',
        statementEndingBalance: 8450.50,
        bookBalance: 8450.50,
        difference: 0,
        status: 'Reconciled',
        reconciledBy: 'John Doe',
        reconciledDate: '2025-11-11',
        transactions: [
          { id: 7, date: '2025-11-02', description: 'Office Supplies', type: 'Debit', amount: 250.50, matched: true },
          { id: 8, date: '2025-11-05', description: 'Advertising Expense', type: 'Debit', amount: 1200, matched: true },
          { id: 9, date: '2025-11-09', description: 'Payment Received', type: 'Credit', amount: 5000, matched: true },
        ],
        notes: 'All credit card transactions reconciled.',
      },
      {
        id: 4,
        accountName: 'Floor Plan Account',
        accountNumber: '****3456',
        accountType: 'Loan',
        statementDate: '2025-11-05',
        statementEndingBalance: 350000.00,
        bookBalance: 350000.00,
        difference: 0,
        status: 'In Progress',
        transactions: [
          { id: 10, date: '2025-11-01', description: 'Vehicle Purchase', type: 'Debit', amount: 35000, matched: true },
          { id: 11, date: '2025-11-03', description: 'Vehicle Sale - Payoff', type: 'Credit', amount: 28000, matched: true },
        ],
        notes: 'Awaiting final statement from lender.',
      },
    ];
    setReconciliations(mockReconciliations);
  }, []);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filteredReconciliations = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return reconciliations;
    }

    const searchTerm = normalizeText(trimmedQuery);

    return reconciliations.filter((recon) => {
      if (normalizeText(recon.accountName).includes(searchTerm)) return true;
      if (normalizeText(recon.accountNumber).includes(searchTerm)) return true;
      if (normalizeText(recon.accountType).includes(searchTerm)) return true;
      if (normalizeText(recon.status).includes(searchTerm)) return true;

      return false;
    });
  }, [reconciliations, searchQuery]);

  const handleOpen = (recon?: Reconciliation) => {
    if (recon) {
      setSelectedRecon(recon);
      setFormData(recon);
    } else {
      setFormData({
        accountName: '',
        accountNumber: '',
        accountType: 'Bank',
        statementDate: new Date().toISOString().split('T')[0],
        statementEndingBalance: 0,
        bookBalance: 0,
        difference: 0,
        status: 'Not Started',
        notes: '',
      });
    }
    setOpen(true);
  };

  const handleViewOpen = (recon: Reconciliation) => {
    setSelectedRecon(recon);
    setViewOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedRecon(null);
    setTabValue(0);
  };

  const handleSubmit = () => {
    const difference = formData.bookBalance! - formData.statementEndingBalance!;
    const newRecon: Reconciliation = {
      ...formData as Reconciliation,
      id: reconciliations.length + 1,
      difference: difference,
      transactions: [],
    };
    setReconciliations([...reconciliations, newRecon]);
    handleClose();
  };

  const handleChange = (field: keyof Reconciliation, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalculate difference when balances change
      if (field === 'bookBalance' || field === 'statementEndingBalance') {
        const book = field === 'bookBalance' ? value : (prev.bookBalance || 0);
        const statement = field === 'statementEndingBalance' ? value : (prev.statementEndingBalance || 0);
        updated.difference = book - statement;
      }
      
      return updated;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reconciled': return 'success';
      case 'In Progress': return 'info';
      case 'Discrepancy': return 'error';
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
    total: filteredReconciliations.length,
    reconciled: filteredReconciliations.filter(r => r.status === 'Reconciled').length,
    inProgress: filteredReconciliations.filter(r => r.status === 'In Progress').length,
    discrepancies: filteredReconciliations.filter(r => r.status === 'Discrepancy').length,
  };

  const columns: GridColDef[] = [
    { field: 'accountName', headerName: 'Account Name', width: 200 },
    { field: 'accountNumber', headerName: 'Account #', width: 130 },
    { field: 'accountType', headerName: 'Type', width: 120 },
    { field: 'statementDate', headerName: 'Statement Date', width: 140 },
    {
      field: 'statementEndingBalance',
      headerName: 'Statement Balance',
      width: 160,
      renderCell: (params: GridRenderCellParams) => formatCurrency(params.value as number),
    },
    {
      field: 'bookBalance',
      headerName: 'Book Balance',
      width: 140,
      renderCell: (params: GridRenderCellParams) => formatCurrency(params.value as number),
    },
    {
      field: 'difference',
      headerName: 'Difference',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant="body2"
          color={params.value === 0 ? 'success.main' : 'error.main'}
          fontWeight="bold"
        >
          {formatCurrency(params.value as number)}
        </Typography>
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
          icon={params.value === 'Reconciled' ? <CheckCircleIcon /> : params.value === 'Discrepancy' ? <WarningIcon /> : undefined}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="info"
              onClick={(e) => {
                e.stopPropagation();
                handleViewOpen(params.row as Reconciliation);
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
                handleOpen(params.row as Reconciliation);
              }}
            >
              <EditIcon fontSize="small" />
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
          Account Reconciliation
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          New Reconciliation
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
                    Total Accounts
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
                    Reconciled
                  </Typography>
                  <Typography variant="h4" color="success.main">{stats.reconciled}</Typography>
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
                    In Progress
                  </Typography>
                  <Typography variant="h4" color="info.main">{stats.inProgress}</Typography>
                </Box>
                <EditIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
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
                    Discrepancies
                  </Typography>
                  <Typography variant="h4" color="error.main">{stats.discrepancies}</Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40, color: 'error.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by account name, number, type, status..."
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
          rows={filteredReconciliations}
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
        <DialogTitle>New Account Reconciliation</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Name"
                  value={formData.accountName}
                  onChange={(e) => handleChange('accountName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Number"
                  value={formData.accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Account Type"
                  value={formData.accountType}
                  onChange={(e) => handleChange('accountType', e.target.value)}
                  required
                >
                  <MenuItem value="Bank">Bank Account</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Loan">Loan Account</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Statement Date"
                  type="date"
                  value={formData.statementDate}
                  onChange={(e) => handleChange('statementDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Statement Ending Balance"
                  type="number"
                  value={formData.statementEndingBalance}
                  onChange={(e) => handleChange('statementEndingBalance', parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Book Balance"
                  type="number"
                  value={formData.bookBalance}
                  onChange={(e) => handleChange('bookBalance', parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Difference"
                  value={formatCurrency(formData.difference || 0)}
                  disabled
                  helperText="Auto-calculated: Book Balance - Statement Balance"
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
                  <MenuItem value="Not Started">Not Started</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Reconciled">Reconciled</MenuItem>
                  <MenuItem value="Discrepancy">Discrepancy</MenuItem>
                </TextField>
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
            Create Reconciliation
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Reconciliation Details - {selectedRecon?.accountName}</DialogTitle>
        <DialogContent>
          {selectedRecon && (
            <Box sx={{ mt: 2 }}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                <Tab label="Summary" />
                <Tab label="Transactions" />
              </Tabs>

              {tabValue === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Account Name</Typography>
                    <Typography variant="body1">{selectedRecon.accountName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Account Number</Typography>
                    <Typography variant="body1">{selectedRecon.accountNumber}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Account Type</Typography>
                    <Typography variant="body1">{selectedRecon.accountType}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Statement Date</Typography>
                    <Typography variant="body1">{selectedRecon.statementDate}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Statement Ending Balance</Typography>
                    <Typography variant="h6">{formatCurrency(selectedRecon.statementEndingBalance)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Book Balance</Typography>
                    <Typography variant="h6">{formatCurrency(selectedRecon.bookBalance)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Difference</Typography>
                    <Typography 
                      variant="h6" 
                      color={selectedRecon.difference === 0 ? 'success.main' : 'error.main'}
                      fontWeight="bold"
                    >
                      {formatCurrency(selectedRecon.difference)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                    <Chip
                      label={selectedRecon.status}
                      color={getStatusColor(selectedRecon.status)}
                      icon={selectedRecon.status === 'Reconciled' ? <CheckCircleIcon /> : undefined}
                    />
                  </Grid>
                  {selectedRecon.reconciledBy && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">Reconciled By</Typography>
                        <Typography variant="body1">{selectedRecon.reconciledBy}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">Reconciled Date</Typography>
                        <Typography variant="body1">{selectedRecon.reconciledDate}</Typography>
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
                    <Typography variant="body1">{selectedRecon.notes}</Typography>
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell align="right"><strong>Amount</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedRecon.transactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell>{txn.date}</TableCell>
                          <TableCell>{txn.description}</TableCell>
                          <TableCell>
                            <Chip
                              label={txn.type}
                              size="small"
                              color={txn.type === 'Credit' ? 'success' : 'primary'}
                            />
                          </TableCell>
                          <TableCell align="right">{formatCurrency(txn.amount)}</TableCell>
                          <TableCell>
                            <Chip
                              label={txn.matched ? 'Matched' : 'Unmatched'}
                              size="small"
                              color={txn.matched ? 'success' : 'warning'}
                              icon={txn.matched ? <CheckCircleIcon /> : <WarningIcon />}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
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

export default Reconciliation;
