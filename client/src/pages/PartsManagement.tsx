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
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';

interface Part {
  id: number;
  partNumber: string;
  partName: string;
  category: 'Engine' | 'Transmission' | 'Brakes' | 'Suspension' | 'Electrical' | 'Body' | 'Interior' | 'Tires' | 'Fluids' | 'Filters' | 'Other';
  manufacturer: string;
  supplier: string;
  cost: number;
  retailPrice: number;
  quantityOnHand: number;
  minStockLevel: number;
  location: string;
  vehicleCompatibility: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Discontinued';
  lastOrderDate?: string;
  lastOrderQuantity?: number;
  notes: string;
}

const PartsManagement: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuPart, setMenuPart] = useState<Part | null>(null);
  const [formData, setFormData] = useState<Partial<Part>>({
    partNumber: '',
    partName: '',
    category: 'Other',
    manufacturer: '',
    supplier: '',
    cost: 0,
    retailPrice: 0,
    quantityOnHand: 0,
    minStockLevel: 5,
    location: '',
    vehicleCompatibility: '',
    status: 'In Stock',
    notes: '',
  });

  // Mock data
  useEffect(() => {
    const mockParts: Part[] = [
      {
        id: 1,
        partNumber: 'ENG-2024-001',
        partName: 'Oil Filter',
        category: 'Filters',
        manufacturer: 'OEM',
        supplier: 'AutoParts Wholesale',
        cost: 8.50,
        retailPrice: 15.99,
        quantityOnHand: 45,
        minStockLevel: 20,
        location: 'Shelf A-12',
        vehicleCompatibility: 'Honda Civic 2015-2024',
        status: 'In Stock',
        lastOrderDate: '2025-10-15',
        lastOrderQuantity: 50,
        notes: 'High turnover item',
      },
      {
        id: 2,
        partNumber: 'BRK-2024-005',
        partName: 'Brake Pads - Front',
        category: 'Brakes',
        manufacturer: 'Brembo',
        supplier: 'Parts Direct Inc',
        cost: 45.00,
        retailPrice: 89.99,
        quantityOnHand: 8,
        minStockLevel: 10,
        location: 'Cabinet B-3',
        vehicleCompatibility: 'Toyota Camry 2018-2024',
        status: 'Low Stock',
        lastOrderDate: '2025-11-01',
        lastOrderQuantity: 20,
        notes: 'Order more soon',
      },
      {
        id: 3,
        partNumber: 'TIRE-2024-012',
        partName: 'All-Season Tire 225/65R17',
        category: 'Tires',
        manufacturer: 'Michelin',
        supplier: 'Tire Distributors LLC',
        cost: 120.00,
        retailPrice: 199.99,
        quantityOnHand: 16,
        minStockLevel: 12,
        location: 'Tire Rack 1',
        vehicleCompatibility: 'Various SUVs',
        status: 'In Stock',
        lastOrderDate: '2025-10-20',
        lastOrderQuantity: 24,
        notes: 'Popular size',
      },
      {
        id: 4,
        partNumber: 'ELEC-2024-008',
        partName: 'Battery 12V 600CCA',
        category: 'Electrical',
        manufacturer: 'Interstate',
        supplier: 'Battery World',
        cost: 85.00,
        retailPrice: 149.99,
        quantityOnHand: 0,
        minStockLevel: 5,
        location: 'Battery Storage',
        vehicleCompatibility: 'Most sedans and small SUVs',
        status: 'Out of Stock',
        lastOrderDate: '2025-10-05',
        lastOrderQuantity: 10,
        notes: 'Need to reorder immediately',
      },
      {
        id: 5,
        partNumber: 'TRANS-2024-003',
        partName: 'Transmission Fluid ATF',
        category: 'Fluids',
        manufacturer: 'Valvoline',
        supplier: 'AutoParts Wholesale',
        cost: 6.50,
        retailPrice: 12.99,
        quantityOnHand: 72,
        minStockLevel: 30,
        location: 'Shelf C-5',
        vehicleCompatibility: 'Universal',
        status: 'In Stock',
        lastOrderDate: '2025-11-08',
        lastOrderQuantity: 100,
        notes: 'Bulk order discount available',
      },
      {
        id: 6,
        partNumber: 'SUSP-2024-007',
        partName: 'Shock Absorber - Rear',
        category: 'Suspension',
        manufacturer: 'Monroe',
        supplier: 'Parts Direct Inc',
        cost: 65.00,
        retailPrice: 129.99,
        quantityOnHand: 4,
        minStockLevel: 8,
        location: 'Cabinet D-2',
        vehicleCompatibility: 'Ford F-150 2015-2023',
        status: 'Low Stock',
        lastOrderDate: '2025-10-28',
        lastOrderQuantity: 12,
        notes: 'Sold in pairs',
      },
    ];
    setParts(mockParts);
  }, []);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filteredParts = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return parts;
    }

    const searchTerm = normalizeText(trimmedQuery);

    return parts.filter((part) => {
      if (normalizeText(part.partNumber).includes(searchTerm)) return true;
      if (normalizeText(part.partName).includes(searchTerm)) return true;
      if (normalizeText(part.category).includes(searchTerm)) return true;
      if (normalizeText(part.manufacturer).includes(searchTerm)) return true;
      if (normalizeText(part.supplier).includes(searchTerm)) return true;
      if (normalizeText(part.vehicleCompatibility).includes(searchTerm)) return true;
      if (normalizeText(part.status).includes(searchTerm)) return true;
      if (part.notes && normalizeText(part.notes).includes(searchTerm)) return true;

      return false;
    });
  }, [parts, searchQuery]);

  const handleOpen = (partMode: 'add' | 'edit' | 'view', part?: Part) => {
    setMode(partMode);
    if (part) {
      setSelectedPart(part);
      if (partMode === 'view') {
        setViewOpen(true);
      } else {
        setFormData(part);
        setOpen(true);
      }
    } else {
      setFormData({
        partNumber: '',
        partName: '',
        category: 'Other',
        manufacturer: '',
        supplier: '',
        cost: 0,
        retailPrice: 0,
        quantityOnHand: 0,
        minStockLevel: 5,
        location: '',
        vehicleCompatibility: '',
        status: 'In Stock',
        notes: '',
      });
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedPart(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, part: Part) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuPart(part);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPart(null);
  };

  const handleMenuAction = (action: 'view' | 'edit' | 'delete') => {
    if (menuPart) {
      switch (action) {
        case 'view':
          handleOpen('view', menuPart);
          break;
        case 'edit':
          handleOpen('edit', menuPart);
          break;
        case 'delete':
          handleDelete(menuPart.id);
          break;
      }
    }
    handleMenuClose();
  };

  const handleSubmit = () => {
    if (mode === 'add') {
      const newPart: Part = {
        ...formData as Part,
        id: parts.length + 1,
      };
      setParts([...parts, newPart]);
    } else if (mode === 'edit' && selectedPart) {
      const updatedParts = parts.map(part =>
        part.id === selectedPart.id ? { ...part, ...formData } : part
      );
      setParts(updatedParts);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      setParts(parts.filter(part => part.id !== id));
    }
  };

  const handleChange = (field: keyof Part, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'success';
      case 'Low Stock': return 'warning';
      case 'Out of Stock': return 'error';
      case 'Discontinued': return 'default';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateMargin = (cost: number, price: number) => {
    if (price === 0) return '0.0';
    return ((price - cost) / price * 100).toFixed(1);
  };

  // Statistics
  const stats = {
    totalParts: filteredParts.length,
    lowStock: filteredParts.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock').length,
    totalValue: filteredParts.reduce((sum, p) => sum + (p.cost * p.quantityOnHand), 0),
    avgMargin: filteredParts.length > 0
      ? filteredParts.reduce((sum, p) => sum + parseFloat(calculateMargin(p.cost, p.retailPrice)), 0) / filteredParts.length
      : 0,
  };

  const columns: GridColDef[] = [
    { field: 'partNumber', headerName: 'Part #', width: 130 },
    { field: 'partName', headerName: 'Part Name', width: 180 },
    { field: 'category', headerName: 'Category', width: 120 },
    { field: 'manufacturer', headerName: 'Manufacturer', width: 130 },
    {
      field: 'quantityOnHand',
      headerName: 'Qty',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.row.quantityOnHand === 0 ? 'error' :
            params.row.quantityOnHand <= params.row.minStockLevel ? 'warning' :
            'success'
          }
        />
      ),
    },
    {
      field: 'cost',
      headerName: 'Cost',
      width: 90,
      renderCell: (params: GridRenderCellParams) => formatCurrency(params.value as number),
    },
    {
      field: 'retailPrice',
      headerName: 'Retail',
      width: 90,
      renderCell: (params: GridRenderCellParams) => formatCurrency(params.value as number),
    },
    {
      field: 'margin',
      headerName: 'Margin',
      width: 90,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" color="success.main">
          {calculateMargin(params.row.cost, params.row.retailPrice)}%
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
          icon={params.value === 'Out of Stock' || params.value === 'Low Stock' ? <WarningIcon /> : undefined}
        />
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
              onClick={(e) => handleMenuOpen(e, params.row as Part)}
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
          Parts Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen('add')}
        >
          Add New Part
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
                    Total Parts
                  </Typography>
                  <Typography variant="h4">{stats.totalParts}</Typography>
                </Box>
                <InventoryIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
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
                    Low/Out of Stock
                  </Typography>
                  <Typography variant="h4" color="warning.main">{stats.lowStock}</Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
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
                    Inventory Value
                  </Typography>
                  <Typography variant="h4">{formatCurrency(stats.totalValue)}</Typography>
                </Box>
                <AttachMoneyIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
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
                    Avg Margin
                  </Typography>
                  <Typography variant="h4">{stats.avgMargin.toFixed(1)}%</Typography>
                </Box>
                <ShoppingCartIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by part #, name, category, manufacturer, supplier..."
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
          rows={filteredParts}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          onRowClick={(params) => handleOpen('view', params.row as Part)}
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
          {mode === 'add' ? 'Add New Part' : 'Edit Part'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Part Number"
                value={formData.partNumber}
                onChange={(e) => handleChange('partNumber', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Part Name"
                value={formData.partName}
                onChange={(e) => handleChange('partName', e.target.value)}
                required
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
                <MenuItem value="Engine">Engine</MenuItem>
                <MenuItem value="Transmission">Transmission</MenuItem>
                <MenuItem value="Brakes">Brakes</MenuItem>
                <MenuItem value="Suspension">Suspension</MenuItem>
                <MenuItem value="Electrical">Electrical</MenuItem>
                <MenuItem value="Body">Body</MenuItem>
                <MenuItem value="Interior">Interior</MenuItem>
                <MenuItem value="Tires">Tires</MenuItem>
                <MenuItem value="Fluids">Fluids</MenuItem>
                <MenuItem value="Filters">Filters</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Manufacturer"
                value={formData.manufacturer}
                onChange={(e) => handleChange('manufacturer', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Supplier"
                value={formData.supplier}
                onChange={(e) => handleChange('supplier', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Shelf A-12"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cost"
                type="number"
                value={formData.cost}
                onChange={(e) => handleChange('cost', parseFloat(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Retail Price"
                type="number"
                value={formData.retailPrice}
                onChange={(e) => handleChange('retailPrice', parseFloat(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity on Hand"
                type="number"
                value={formData.quantityOnHand}
                onChange={(e) => handleChange('quantityOnHand', parseInt(e.target.value))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Stock Level"
                type="number"
                value={formData.minStockLevel}
                onChange={(e) => handleChange('minStockLevel', parseInt(e.target.value))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vehicle Compatibility"
                value={formData.vehicleCompatibility}
                onChange={(e) => handleChange('vehicleCompatibility', e.target.value)}
                placeholder="e.g., Honda Civic 2015-2024"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {mode === 'add' ? 'Add Part' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Part Details - {selectedPart?.partNumber}</DialogTitle>
        <DialogContent>
          {selectedPart && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Part Number</Typography>
                <Typography variant="body1">{selectedPart.partNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Part Name</Typography>
                <Typography variant="body1">{selectedPart.partName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Category</Typography>
                <Typography variant="body1">{selectedPart.category}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Manufacturer</Typography>
                <Typography variant="body1">{selectedPart.manufacturer}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Supplier</Typography>
                <Typography variant="body1">{selectedPart.supplier}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Location</Typography>
                <Typography variant="body1">{selectedPart.location}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Cost</Typography>
                <Typography variant="body1">{formatCurrency(selectedPart.cost)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Retail Price</Typography>
                <Typography variant="body1">{formatCurrency(selectedPart.retailPrice)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Profit Margin</Typography>
                <Typography variant="body1" color="success.main">
                  {calculateMargin(selectedPart.cost, selectedPart.retailPrice)}%
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Quantity on Hand</Typography>
                <Chip
                  label={selectedPart.quantityOnHand}
                  color={
                    selectedPart.quantityOnHand === 0 ? 'error' :
                    selectedPart.quantityOnHand <= selectedPart.minStockLevel ? 'warning' :
                    'success'
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Minimum Stock Level</Typography>
                <Typography variant="body1">{selectedPart.minStockLevel}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                <Chip
                  label={selectedPart.status}
                  color={getStatusColor(selectedPart.status)}
                  icon={selectedPart.status === 'Out of Stock' || selectedPart.status === 'Low Stock' ? <WarningIcon /> : undefined}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Vehicle Compatibility</Typography>
                <Typography variant="body1">{selectedPart.vehicleCompatibility || 'Not specified'}</Typography>
              </Grid>
              {selectedPart.lastOrderDate && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Last Order Date</Typography>
                    <Typography variant="body1">{selectedPart.lastOrderDate}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Last Order Quantity</Typography>
                    <Typography variant="body1">{selectedPart.lastOrderQuantity}</Typography>
                  </Grid>
                </>
              )}
              {selectedPart.notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
                  <Typography variant="body1">{selectedPart.notes}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={() => { handleClose(); handleOpen('edit', selectedPart!); }} startIcon={<EditIcon />}>
            Edit
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
          Edit Part
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete Part
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PartsManagement;
