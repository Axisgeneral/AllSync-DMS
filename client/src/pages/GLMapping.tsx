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
  Divider,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CategoryIcon from '@mui/icons-material/Category';

interface GLAccount {
  id: number;
  accountNumber: string;
  accountName: string;
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense' | 'Cost of Sales';
  normalBalance: 'Debit' | 'Credit';
  isActive: boolean;
  description: string;
}

interface GLMapping {
  id: number;
  transactionType: string;
  category: string;
  glAccount: string;
  glAccountNumber: string;
  department: string;
  description: string;
  isActive: boolean;
}

const GLMapping: React.FC = () => {
  const [mappings, setMappings] = useState<GLMapping[]>([]);
  const [glAccounts, setGLAccounts] = useState<GLAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'add' | 'edit'>('add');
  const [selectedMapping, setSelectedMapping] = useState<GLMapping | null>(null);
  const [formData, setFormData] = useState<Partial<GLMapping>>({
    transactionType: '',
    category: '',
    glAccount: '',
    glAccountNumber: '',
    department: '',
    description: '',
    isActive: true,
  });

  // Mock GL Accounts
  useEffect(() => {
    const mockGLAccounts: GLAccount[] = [
      { id: 1, accountNumber: '1000', accountName: 'Cash - Operating', accountType: 'Asset', normalBalance: 'Debit', isActive: true, description: 'Main operating cash account' },
      { id: 2, accountNumber: '1200', accountName: 'Accounts Receivable', accountType: 'Asset', normalBalance: 'Debit', isActive: true, description: 'Customer receivables' },
      { id: 3, accountNumber: '1300', accountName: 'Inventory - New Vehicles', accountType: 'Asset', normalBalance: 'Debit', isActive: true, description: 'New vehicle inventory' },
      { id: 4, accountNumber: '1310', accountName: 'Inventory - Used Vehicles', accountType: 'Asset', normalBalance: 'Debit', isActive: true, description: 'Used vehicle inventory' },
      { id: 5, accountNumber: '1320', accountName: 'Inventory - Parts', accountType: 'Asset', normalBalance: 'Debit', isActive: true, description: 'Parts inventory' },
      { id: 6, accountNumber: '2000', accountName: 'Accounts Payable', accountType: 'Liability', normalBalance: 'Credit', isActive: true, description: 'Vendor payables' },
      { id: 7, accountNumber: '2100', accountName: 'Floor Plan Payable', accountType: 'Liability', normalBalance: 'Credit', isActive: true, description: 'Vehicle financing payable' },
      { id: 8, accountNumber: '4000', accountName: 'Vehicle Sales Revenue', accountType: 'Revenue', normalBalance: 'Credit', isActive: true, description: 'Revenue from vehicle sales' },
      { id: 9, accountNumber: '4100', accountName: 'Service Revenue', accountType: 'Revenue', normalBalance: 'Credit', isActive: true, description: 'Revenue from service department' },
      { id: 10, accountNumber: '4200', accountName: 'Parts Revenue', accountType: 'Revenue', normalBalance: 'Credit', isActive: true, description: 'Revenue from parts sales' },
      { id: 11, accountNumber: '4300', accountName: 'F&I Income', accountType: 'Revenue', normalBalance: 'Credit', isActive: true, description: 'Finance and insurance income' },
      { id: 12, accountNumber: '5000', accountName: 'Cost of Vehicles Sold', accountType: 'Cost of Sales', normalBalance: 'Debit', isActive: true, description: 'Cost of vehicles sold' },
      { id: 13, accountNumber: '5100', accountName: 'Cost of Parts Sold', accountType: 'Cost of Sales', normalBalance: 'Debit', isActive: true, description: 'Cost of parts sold' },
      { id: 14, accountNumber: '6000', accountName: 'Salaries & Wages', accountType: 'Expense', normalBalance: 'Debit', isActive: true, description: 'Employee compensation' },
      { id: 15, accountNumber: '6100', accountName: 'Advertising', accountType: 'Expense', normalBalance: 'Debit', isActive: true, description: 'Marketing and advertising costs' },
    ];
    setGLAccounts(mockGLAccounts);

    // Mock GL Mappings
    const mockMappings: GLMapping[] = [
      {
        id: 1,
        transactionType: 'Vehicle Sale',
        category: 'Sales',
        glAccount: 'Vehicle Sales Revenue',
        glAccountNumber: '4000',
        department: 'Sales',
        description: 'Revenue from new and used vehicle sales',
        isActive: true,
      },
      {
        id: 2,
        transactionType: 'Vehicle Sale - Cost',
        category: 'Cost of Sales',
        glAccount: 'Cost of Vehicles Sold',
        glAccountNumber: '5000',
        department: 'Sales',
        description: 'Cost of vehicles sold',
        isActive: true,
      },
      {
        id: 3,
        transactionType: 'Service Order',
        category: 'Sales',
        glAccount: 'Service Revenue',
        glAccountNumber: '4100',
        department: 'Service',
        description: 'Revenue from service department labor and services',
        isActive: true,
      },
      {
        id: 4,
        transactionType: 'Parts Sale',
        category: 'Sales',
        glAccount: 'Parts Revenue',
        glAccountNumber: '4200',
        department: 'Service',
        description: 'Revenue from parts sales',
        isActive: true,
      },
      {
        id: 5,
        transactionType: 'Parts Sale - Cost',
        category: 'Cost of Sales',
        glAccount: 'Cost of Parts Sold',
        glAccountNumber: '5100',
        department: 'Service',
        description: 'Cost of parts sold',
        isActive: true,
      },
      {
        id: 6,
        transactionType: 'Finance & Insurance',
        category: 'Sales',
        glAccount: 'F&I Income',
        glAccountNumber: '4300',
        department: 'F&I',
        description: 'Finance, warranty, and insurance product income',
        isActive: true,
      },
      {
        id: 7,
        transactionType: 'Customer Payment',
        category: 'Asset',
        glAccount: 'Cash - Operating',
        glAccountNumber: '1000',
        department: 'Accounting',
        description: 'Cash receipts from customers',
        isActive: true,
      },
      {
        id: 8,
        transactionType: 'Customer Receivable',
        category: 'Asset',
        glAccount: 'Accounts Receivable',
        glAccountNumber: '1200',
        department: 'Accounting',
        description: 'Amounts owed by customers',
        isActive: true,
      },
      {
        id: 9,
        transactionType: 'Vendor Payment',
        category: 'Liability',
        glAccount: 'Accounts Payable',
        glAccountNumber: '2000',
        department: 'Accounting',
        description: 'Payments to vendors',
        isActive: true,
      },
      {
        id: 10,
        transactionType: 'Payroll',
        category: 'Expense',
        glAccount: 'Salaries & Wages',
        glAccountNumber: '6000',
        department: 'HR',
        description: 'Employee payroll expenses',
        isActive: true,
      },
    ];
    setMappings(mockMappings);
  }, []);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filteredMappings = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return mappings;
    }

    const searchTerm = normalizeText(trimmedQuery);

    return mappings.filter((mapping) => {
      if (normalizeText(mapping.transactionType).includes(searchTerm)) return true;
      if (normalizeText(mapping.category).includes(searchTerm)) return true;
      if (normalizeText(mapping.glAccount).includes(searchTerm)) return true;
      if (normalizeText(mapping.glAccountNumber).includes(searchTerm)) return true;
      if (normalizeText(mapping.department).includes(searchTerm)) return true;

      return false;
    });
  }, [mappings, searchQuery]);

  const handleOpen = (mode: 'add' | 'edit', mapping?: GLMapping) => {
    setViewMode(mode);
    if (mapping) {
      setSelectedMapping(mapping);
      setFormData(mapping);
    } else {
      setFormData({
        transactionType: '',
        category: '',
        glAccount: '',
        glAccountNumber: '',
        department: '',
        description: '',
        isActive: true,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMapping(null);
  };

  const handleSubmit = () => {
    if (viewMode === 'add') {
      const newMapping: GLMapping = {
        ...formData as GLMapping,
        id: mappings.length + 1,
      };
      setMappings([...mappings, newMapping]);
    } else if (viewMode === 'edit' && selectedMapping) {
      const updatedMappings = mappings.map(mapping =>
        mapping.id === selectedMapping.id ? { ...mapping, ...formData } : mapping
      );
      setMappings(updatedMappings);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this GL mapping?')) {
      setMappings(mappings.filter(mapping => mapping.id !== id));
    }
  };

  const handleChange = (field: keyof GLMapping, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-populate account number when account is selected
    if (field === 'glAccount') {
      const account = glAccounts.find(acc => acc.accountName === value);
      if (account) {
        setFormData(prev => ({ ...prev, glAccountNumber: account.accountNumber }));
      }
    }
  };

  // Statistics
  const stats = {
    total: filteredMappings.length,
    active: filteredMappings.filter(m => m.isActive).length,
    revenue: filteredMappings.filter(m => m.category === 'Sales').length,
    expense: filteredMappings.filter(m => m.category === 'Expense').length,
  };

  const columns: GridColDef[] = [
    { field: 'transactionType', headerName: 'Transaction Type', width: 200 },
    { field: 'category', headerName: 'Category', width: 140 },
    { field: 'glAccountNumber', headerName: 'Account #', width: 110 },
    { field: 'glAccount', headerName: 'GL Account', width: 220 },
    { field: 'department', headerName: 'Department', width: 130 },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'default'}
          size="small"
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
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen('edit', params.row as GLMapping);
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
          General Ledger Mapping
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen('add')}
        >
          New Mapping
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
                    Total Mappings
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
                    Active
                  </Typography>
                  <Typography variant="h4" color="success.main">{stats.active}</Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
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
                    Revenue Accounts
                  </Typography>
                  <Typography variant="h4" color="info.main">{stats.revenue}</Typography>
                </Box>
                <AccountBalanceIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
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
                    Expense Accounts
                  </Typography>
                  <Typography variant="h4" color="warning.main">{stats.expense}</Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by transaction type, category, account number, GL account, department..."
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
          rows={filteredMappings}
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
          {viewMode === 'add' ? 'New GL Mapping' : 'Edit GL Mapping'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Transaction Type"
                  value={formData.transactionType}
                  onChange={(e) => handleChange('transactionType', e.target.value)}
                  required
                  helperText="e.g., Vehicle Sale, Service Order, Parts Sale"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  required
                >
                  <MenuItem value="Asset">Asset</MenuItem>
                  <MenuItem value="Liability">Liability</MenuItem>
                  <MenuItem value="Equity">Equity</MenuItem>
                  <MenuItem value="Sales">Revenue/Sales</MenuItem>
                  <MenuItem value="Cost of Sales">Cost of Sales</MenuItem>
                  <MenuItem value="Expense">Expense</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="GL Account"
                  value={formData.glAccount}
                  onChange={(e) => handleChange('glAccount', e.target.value)}
                  required
                >
                  {glAccounts
                    .filter(acc => acc.isActive)
                    .map((account) => (
                      <MenuItem key={account.id} value={account.accountName}>
                        {account.accountNumber} - {account.accountName}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Number"
                  value={formData.glAccountNumber}
                  onChange={(e) => handleChange('glAccountNumber', e.target.value)}
                  disabled
                  helperText="Auto-populated from GL Account selection"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Department"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  required
                >
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Service">Service</MenuItem>
                  <MenuItem value="F&I">F&I</MenuItem>
                  <MenuItem value="Accounting">Accounting</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Management">Management</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.isActive ? 'Active' : 'Inactive'}
                  onChange={(e) => handleChange('isActive', e.target.value === 'Active')}
                  required
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {viewMode === 'add' ? 'Create Mapping' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GLMapping;
