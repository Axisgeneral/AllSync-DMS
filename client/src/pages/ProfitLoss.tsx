import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Chip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

interface PLLineItem {
  category: string;
  subcategory?: string;
  amount: number;
  isSubtotal?: boolean;
  isTotal?: boolean;
  indent?: number;
}

const ProfitLoss: React.FC = () => {
  const [dateRange, setDateRange] = useState('current-month');
  const [department, setDepartment] = useState('all');

  // Mock P&L data
  const plData: PLLineItem[] = useMemo(() => {
    const baseData = [
      // Revenue Section
      { category: 'Revenue', amount: 0, isSubtotal: true, indent: 0 },
      { category: 'Revenue', subcategory: 'Vehicle Sales', amount: 245000, indent: 1 },
      { category: 'Revenue', subcategory: 'Service Revenue', amount: 85000, indent: 1 },
      { category: 'Revenue', subcategory: 'Parts Sales', amount: 42000, indent: 1 },
      { category: 'Revenue', subcategory: 'F&I Income', amount: 28000, indent: 1 },
      { category: 'Total Revenue', amount: 400000, isSubtotal: true, indent: 0 },
      
      // Cost of Sales
      { category: 'Cost of Sales', amount: 0, isSubtotal: true, indent: 0 },
      { category: 'Cost of Sales', subcategory: 'Vehicle Cost', amount: 195000, indent: 1 },
      { category: 'Cost of Sales', subcategory: 'Parts Cost', amount: 25000, indent: 1 },
      { category: 'Total Cost of Sales', amount: 220000, isSubtotal: true, indent: 0 },
      
      // Gross Profit
      { category: 'Gross Profit', amount: 180000, isTotal: true, indent: 0 },
      
      // Operating Expenses
      { category: 'Operating Expenses', amount: 0, isSubtotal: true, indent: 0 },
      { category: 'Operating Expenses', subcategory: 'Salaries & Wages', amount: 65000, indent: 1 },
      { category: 'Operating Expenses', subcategory: 'Rent & Utilities', amount: 12000, indent: 1 },
      { category: 'Operating Expenses', subcategory: 'Advertising', amount: 8000, indent: 1 },
      { category: 'Operating Expenses', subcategory: 'Insurance', amount: 5000, indent: 1 },
      { category: 'Operating Expenses', subcategory: 'Office Supplies', amount: 2500, indent: 1 },
      { category: 'Operating Expenses', subcategory: 'Depreciation', amount: 6000, indent: 1 },
      { category: 'Operating Expenses', subcategory: 'Floor Plan Interest', amount: 4500, indent: 1 },
      { category: 'Operating Expenses', subcategory: 'Other Expenses', amount: 3000, indent: 1 },
      { category: 'Total Operating Expenses', amount: 106000, isSubtotal: true, indent: 0 },
      
      // Net Income
      { category: 'Net Income', amount: 74000, isTotal: true, indent: 0 },
    ];

    // Filter by department if needed
    if (department !== 'all') {
      // In a real app, we'd filter based on department
      // For now, return all data
    }

    return baseData;
  }, [department]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = 400000;
  const totalExpenses = 326000; // Cost of Sales + Operating Expenses
  const netProfit = 74000;
  const grossProfit = 180000;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  const getRowStyle = (item: PLLineItem) => {
    if (item.isTotal) {
      return {
        backgroundColor: 'primary.main',
        color: 'white',
        fontWeight: 'bold',
        '& td': { color: 'white', fontWeight: 'bold', fontSize: '1.1rem' },
      };
    }
    if (item.isSubtotal) {
      return {
        backgroundColor: 'grey.100',
        fontWeight: 'bold',
        '& td': { fontWeight: 'bold' },
      };
    }
    return {};
  };

  const getCellPadding = (indent: number = 0) => {
    return `${8 + indent * 24}px`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Profit and Loss Statement
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            select
            size="small"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="current-month">Current Month</MenuItem>
            <MenuItem value="last-month">Last Month</MenuItem>
            <MenuItem value="current-quarter">Current Quarter</MenuItem>
            <MenuItem value="last-quarter">Last Quarter</MenuItem>
            <MenuItem value="ytd">Year to Date</MenuItem>
            <MenuItem value="last-year">Last Year</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Departments</MenuItem>
            <MenuItem value="sales">Sales</MenuItem>
            <MenuItem value="service">Service</MenuItem>
            <MenuItem value="parts">Parts</MenuItem>
            <MenuItem value="fi">F&I</MenuItem>
          </TextField>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Revenue
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    {formatCurrency(totalRevenue)}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
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
                    Gross Profit
                  </Typography>
                  <Typography variant="h5" color="info.main">
                    {formatCurrency(grossProfit)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {((grossProfit / totalRevenue) * 100).toFixed(1)}% margin
                  </Typography>
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
                    Total Expenses
                  </Typography>
                  <Typography variant="h5" color="error.main">
                    {formatCurrency(totalExpenses)}
                  </Typography>
                </Box>
                <TrendingDownIcon sx={{ fontSize: 40, color: 'error.main', opacity: 0.3 }} />
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
                    Net Profit
                  </Typography>
                  <Typography variant="h5" color={netProfit >= 0 ? 'success.main' : 'error.main'}>
                    {formatCurrency(netProfit)}
                  </Typography>
                  <Chip
                    label={`${profitMargin}% margin`}
                    size="small"
                    color={netProfit >= 0 ? 'success' : 'error'}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* P&L Statement Table */}
      <Paper sx={{ width: '100%' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.200' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Account</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plData.map((item, index) => (
                <TableRow key={index} sx={getRowStyle(item)}>
                  <TableCell sx={{ pl: getCellPadding(item.indent) }}>
                    {item.subcategory || item.category}
                  </TableCell>
                  <TableCell align="right">
                    {item.amount !== 0 && formatCurrency(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Financial Ratios */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Key Financial Ratios
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary">Gross Profit Margin</Typography>
                  <Typography variant="h6">{((grossProfit / totalRevenue) * 100).toFixed(1)}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary">Net Profit Margin</Typography>
                  <Typography variant="h6">{profitMargin}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary">Operating Expense Ratio</Typography>
                  <Typography variant="h6">{((106000 / totalRevenue) * 100).toFixed(1)}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary">Cost of Sales Ratio</Typography>
                  <Typography variant="h6">{((220000 / totalRevenue) * 100).toFixed(1)}%</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfitLoss;
