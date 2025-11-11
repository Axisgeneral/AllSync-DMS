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
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';

interface PayrollEntry {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  grossPay: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  deductions: number;
  netPay: number;
  status: 'Draft' | 'Processed' | 'Paid';
  payDate: string;
}

const Payroll: React.FC = () => {
  const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);

  // Mock data
  useEffect(() => {
    const mockEntries: PayrollEntry[] = [
      {
        id: 1,
        employeeId: 1,
        employeeName: 'John Smith',
        department: 'Sales',
        payPeriodStart: '2025-10-16',
        payPeriodEnd: '2025-10-31',
        regularHours: 80,
        overtimeHours: 5,
        hourlyRate: 25.00,
        grossPay: 2187.50,
        federalTax: 328.13,
        stateTax: 131.25,
        socialSecurity: 135.63,
        medicare: 31.72,
        deductions: 150.00,
        netPay: 1410.77,
        status: 'Paid',
        payDate: '2025-11-05',
      },
      {
        id: 2,
        employeeId: 2,
        employeeName: 'Jane Doe',
        department: 'Service',
        payPeriodStart: '2025-10-16',
        payPeriodEnd: '2025-10-31',
        regularHours: 80,
        overtimeHours: 8,
        hourlyRate: 28.00,
        grossPay: 2576.00,
        federalTax: 386.40,
        stateTax: 154.56,
        socialSecurity: 159.71,
        medicare: 37.35,
        deductions: 175.00,
        netPay: 1662.98,
        status: 'Paid',
        payDate: '2025-11-05',
      },
      {
        id: 3,
        employeeId: 3,
        employeeName: 'Mike Johnson',
        department: 'Sales',
        payPeriodStart: '2025-11-01',
        payPeriodEnd: '2025-11-15',
        regularHours: 80,
        overtimeHours: 0,
        hourlyRate: 24.00,
        grossPay: 1920.00,
        federalTax: 288.00,
        stateTax: 115.20,
        socialSecurity: 119.04,
        medicare: 27.84,
        deductions: 150.00,
        netPay: 1219.92,
        status: 'Processed',
        payDate: '2025-11-20',
      },
      {
        id: 4,
        employeeId: 4,
        employeeName: 'Sarah Williams',
        department: 'F&I',
        payPeriodStart: '2025-11-01',
        payPeriodEnd: '2025-11-15',
        regularHours: 80,
        overtimeHours: 3,
        hourlyRate: 30.00,
        grossPay: 2535.00,
        federalTax: 380.25,
        stateTax: 152.10,
        socialSecurity: 157.17,
        medicare: 36.76,
        deductions: 200.00,
        netPay: 1608.72,
        status: 'Draft',
        payDate: '2025-11-20',
      },
    ];
    setPayrollEntries(mockEntries);
  }, []);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filteredEntries = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return payrollEntries;
    }

    const searchTerm = normalizeText(trimmedQuery);

    return payrollEntries.filter((entry) => {
      if (normalizeText(entry.employeeName).includes(searchTerm)) return true;
      if (normalizeText(entry.department).includes(searchTerm)) return true;
      if (normalizeText(entry.status).includes(searchTerm)) return true;

      return false;
    });
  }, [payrollEntries, searchQuery]);

  const handleViewOpen = (entry: PayrollEntry) => {
    setSelectedEntry(entry);
    setViewOpen(true);
  };

  const handleClose = () => {
    setViewOpen(false);
    setSelectedEntry(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Processed': return 'info';
      case 'Draft': return 'warning';
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
    totalEntries: filteredEntries.length,
    totalGrossPay: filteredEntries.reduce((sum, e) => sum + e.grossPay, 0),
    totalNetPay: filteredEntries.reduce((sum, e) => sum + e.netPay, 0),
    totalDeductions: filteredEntries.reduce((sum, e) => sum + (e.federalTax + e.stateTax + e.socialSecurity + e.medicare + e.deductions), 0),
  };

  const columns: GridColDef[] = [
    { field: 'employeeName', headerName: 'Employee', width: 180 },
    { field: 'department', headerName: 'Department', width: 120 },
    { field: 'payPeriodStart', headerName: 'Period Start', width: 120 },
    { field: 'payPeriodEnd', headerName: 'Period End', width: 120 },
    {
      field: 'regularHours',
      headerName: 'Reg Hours',
      width: 100,
      align: 'right',
    },
    {
      field: 'overtimeHours',
      headerName: 'OT Hours',
      width: 90,
      align: 'right',
    },
    {
      field: 'grossPay',
      headerName: 'Gross Pay',
      width: 120,
      renderCell: (params: GridRenderCellParams) => formatCurrency(params.value as number),
    },
    {
      field: 'netPay',
      headerName: 'Net Pay',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography fontWeight="bold" color="success.main">
          {formatCurrency(params.value as number)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value as string}
          color={getStatusColor(params.value as string)}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title="View Details">
          <IconButton
            size="small"
            color="info"
            onClick={(e) => {
              e.stopPropagation();
              handleViewOpen(params.row as PayrollEntry);
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Payroll Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
        >
          New Payroll Run
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
                    Total Entries
                  </Typography>
                  <Typography variant="h4">{stats.totalEntries}</Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
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
                    Total Gross Pay
                  </Typography>
                  <Typography variant="h5">{formatCurrency(stats.totalGrossPay)}</Typography>
                </Box>
                <AttachMoneyIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
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
                    Total Deductions
                  </Typography>
                  <Typography variant="h5" color="error.main">
                    {formatCurrency(stats.totalDeductions)}
                  </Typography>
                </Box>
                <AccountBalanceIcon sx={{ fontSize: 40, color: 'error.main', opacity: 0.3 }} />
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
                    Total Net Pay
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    {formatCurrency(stats.totalNetPay)}
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
          placeholder="Search by employee, department, status..."
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
          rows={filteredEntries}
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

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Payroll Details - {selectedEntry?.employeeName}</DialogTitle>
        <DialogContent>
          {selectedEntry && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Employee</Typography>
                  <Typography variant="body1">{selectedEntry.employeeName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Department</Typography>
                  <Typography variant="body1">{selectedEntry.department}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Pay Period</Typography>
                  <Typography variant="body1">
                    {selectedEntry.payPeriodStart} to {selectedEntry.payPeriodEnd}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Pay Date</Typography>
                  <Typography variant="body1">{selectedEntry.payDate}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip
                    label={selectedEntry.status}
                    color={getStatusColor(selectedEntry.status)}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Earnings & Deductions
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Regular Hours ({selectedEntry.regularHours} hrs @ {formatCurrency(selectedEntry.hourlyRate)}/hr)</strong></TableCell>
                      <TableCell align="right">{formatCurrency(selectedEntry.regularHours * selectedEntry.hourlyRate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Overtime Hours ({selectedEntry.overtimeHours} hrs @ {formatCurrency(selectedEntry.hourlyRate * 1.5)}/hr)</strong></TableCell>
                      <TableCell align="right">{formatCurrency(selectedEntry.overtimeHours * selectedEntry.hourlyRate * 1.5)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: 'grey.100' }}>
                      <TableCell><strong>Gross Pay</strong></TableCell>
                      <TableCell align="right"><strong>{formatCurrency(selectedEntry.grossPay)}</strong></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>Federal Tax</TableCell>
                      <TableCell align="right" color="error.main">-{formatCurrency(selectedEntry.federalTax)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>State Tax</TableCell>
                      <TableCell align="right">-{formatCurrency(selectedEntry.stateTax)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>Social Security</TableCell>
                      <TableCell align="right">-{formatCurrency(selectedEntry.socialSecurity)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>Medicare</TableCell>
                      <TableCell align="right">-{formatCurrency(selectedEntry.medicare)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>Other Deductions</TableCell>
                      <TableCell align="right">-{formatCurrency(selectedEntry.deductions)}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: 'success.light' }}>
                      <TableCell><strong>Net Pay</strong></TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" color="success.dark" fontWeight="bold">
                          {formatCurrency(selectedEntry.netPay)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button variant="contained" color="primary">
            Generate Pay Stub
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payroll;
