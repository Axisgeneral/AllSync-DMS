import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  InputAdornment,
  Tooltip,
  Card,
  CardContent,
  Slider,
  FormControl,
  InputLabel,
  Select,
  Collapse,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Tabs,
  Tab,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  Add, 
  Edit, 
  Delete, 
  Visibility, 
  VisibilityOff,
  Search as SearchIcon, 
  FilterList, 
  ExpandMore, 
  ExpandLess,
  CloudUpload,
  Link as LinkIcon,
  ContentPaste,
  Close as CloseIcon,
  Photo,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import axios from 'axios';

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [vinDecoding, setVinDecoding] = useState(false);
  const [vinError, setVinError] = useState<string>('');
  const [showFilters, setShowFilters] = useState(true);
  const [showCost, setShowCost] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuVehicle, setMenuVehicle] = useState<any>(null);
  
  // Photo management states
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoTab, setPhotoTab] = useState(0);
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    condition: '',
    type: '',
    transmission: '',
    fuelType: '',
    status: '',
    location: '',
  });
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [yearRange, setYearRange] = useState<number[]>([2000, new Date().getFullYear()]);
  
  const [formData, setFormData] = useState<any>({
    stockNumber: '',
    vin: '',
    year: new Date().getFullYear(),
    make: '',
    model: '',
    trim: '',
    type: 'Sedan',
    condition: 'New',
    mileage: 0,
    exteriorColor: '',
    interiorColor: '',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    price: 0,
    cost: 0,
    status: 'Available',
    location: 'Main Lot',
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Update price and year ranges when vehicles load
  useEffect(() => {
    if (vehicles.length > 0) {
      const prices = vehicles.map(v => v.price || 0);
      const years = vehicles.map(v => v.year || new Date().getFullYear());
      
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      
      setPriceRange([minPrice, maxPrice]);
      setYearRange([minYear, maxYear]);
    }
  }, [vehicles]);

  // Get unique values for filter dropdowns
  const uniqueValues = useMemo(() => {
    return {
      makes: Array.from(new Set(vehicles.map(v => v.make).filter(Boolean))).sort(),
      models: Array.from(new Set(vehicles.map(v => v.model).filter(Boolean))).sort(),
      conditions: Array.from(new Set(vehicles.map(v => v.condition).filter(Boolean))).sort(),
      types: Array.from(new Set(vehicles.map(v => v.type).filter(Boolean))).sort(),
      transmissions: Array.from(new Set(vehicles.map(v => v.transmission).filter(Boolean))).sort(),
      fuelTypes: Array.from(new Set(vehicles.map(v => v.fuelType).filter(Boolean))).sort(),
      statuses: Array.from(new Set(vehicles.map(v => v.status).filter(Boolean))).sort(),
      locations: Array.from(new Set(vehicles.map(v => v.location).filter(Boolean))).sort(),
    };
  }, [vehicles]);

  // Filter vehicles based on search and filters
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      // Search term filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        vehicle.stockNumber?.toLowerCase().includes(searchLower) ||
        vehicle.vin?.toLowerCase().includes(searchLower) ||
        vehicle.make?.toLowerCase().includes(searchLower) ||
        vehicle.model?.toLowerCase().includes(searchLower) ||
        vehicle.trim?.toLowerCase().includes(searchLower) ||
        vehicle.year?.toString().includes(searchLower);

      // Dropdown filters
      const matchesMake = !filters.make || vehicle.make === filters.make;
      const matchesModel = !filters.model || vehicle.model === filters.model;
      const matchesCondition = !filters.condition || vehicle.condition === filters.condition;
      const matchesType = !filters.type || vehicle.type === filters.type;
      const matchesTransmission = !filters.transmission || vehicle.transmission === filters.transmission;
      const matchesFuelType = !filters.fuelType || vehicle.fuelType === filters.fuelType;
      const matchesStatus = !filters.status || vehicle.status === filters.status;
      const matchesLocation = !filters.location || vehicle.location === filters.location;

      // Price range filter
      const matchesPrice = vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];

      // Year range filter
      const matchesYear = vehicle.year >= yearRange[0] && vehicle.year <= yearRange[1];

      return matchesSearch && matchesMake && matchesModel && matchesCondition && 
             matchesType && matchesTransmission && matchesFuelType && matchesStatus && 
             matchesLocation && matchesPrice && matchesYear;
    });
  }, [vehicles, searchTerm, filters, priceRange, yearRange]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      make: '',
      model: '',
      condition: '',
      type: '',
      transmission: '',
      fuelType: '',
      status: '',
      location: '',
    });
    if (vehicles.length > 0) {
      const prices = vehicles.map(v => v.price || 0);
      const years = vehicles.map(v => v.year || new Date().getFullYear());
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
      setYearRange([Math.min(...years), Math.max(...years)]);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('/api/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  // Generate stock number based on make, year, and sequential number
  const generateStockNumber = (make: string, year: number) => {
    if (!make || !year) return '';
    
    // Generate unique prefix from make name
    const generateMakePrefix = (makeName: string): string => {
      // Clean up the make name
      const cleaned = makeName.trim().toUpperCase();
      
      // Special handling for common makes to ensure uniqueness
      const prefixMap: { [key: string]: string } = {
        'MERCEDES': 'MER',
        'MERCEDES-BENZ': 'MER',
        'MAZDA': 'MAZ',
        'MITSUBISHI': 'MIT',
        'MASERATI': 'MAS',
        'MINI': 'MIN',
        'MCLAREN': 'MCL',
        'CHRYSLER': 'CHR',
        'CHEVROLET': 'CHV',
        'CADILLAC': 'CAD',
        'FORD': 'FOR',
        'FIAT': 'FIA',
        'FERRARI': 'FER',
        'TOYOTA': 'TOY',
        'TESLA': 'TES',
        'HONDA': 'HON',
        'HYUNDAI': 'HYU',
        'BMW': 'BMW',
        'AUDI': 'AUD',
        'ACURA': 'ACU',
        'VOLKSWAGEN': 'VW',
        'VOLVO': 'VOL',
        'NISSAN': 'NIS',
        'INFINITI': 'INF',
        'JEEP': 'JEP',
        'JAGUAR': 'JAG',
        'KIA': 'KIA',
        'LEXUS': 'LEX',
        'LINCOLN': 'LIN',
        'LAND ROVER': 'LR',
        'PORSCHE': 'POR',
        'RAM': 'RAM',
        'SUBARU': 'SUB',
        'GMC': 'GMC',
        'BUICK': 'BUI',
        'DODGE': 'DOD',
        'GENESIS': 'GEN',
        'ALFA ROMEO': 'ALF',
      };
      
      // Check if we have a predefined prefix
      if (prefixMap[cleaned]) {
        return prefixMap[cleaned];
      }
      
      // For other makes, use first 3 letters (or available length)
      return cleaned.substring(0, Math.min(3, cleaned.length));
    };
    
    const makePrefix = generateMakePrefix(make);
    
    // Filter vehicles with same make and year
    const sameVehicles = vehicles.filter(
      v => v.make === make && v.year === year
    );
    
    // Get the next sequential number (count + 1)
    const nextNumber = sameVehicles.length + 1;
    
    // Format: MER2024-001 (Make prefix + Year + dash + 3-digit number)
    return `${makePrefix}${year}-${String(nextNumber).padStart(3, '0')}`;
  };

  const handleOpen = (mode: 'add' | 'edit' | 'view', vehicle?: any) => {
    setViewMode(mode);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setFormData(vehicle);
      setPhotos(vehicle.photos || []);
    } else {
      setSelectedVehicle(null);
      setPhotos([]);
      setFormData({
        stockNumber: '',
        vin: '',
        year: new Date().getFullYear(),
        make: '',
        model: '',
        trim: '',
        type: 'Sedan',
        condition: 'New',
        mileage: 0,
        exteriorColor: '',
        interiorColor: '',
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        price: 0,
        cost: 0,
        status: 'Available',
        location: 'Main Lot',
      });
    }
    setPhotoTab(0);
    setPhotoUrl('');
    setUploadError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVehicle(null);
    setVinError('');
    setPhotos([]);
    setPhotoUrl('');
    setUploadError('');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, vehicle: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuVehicle(vehicle);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuVehicle(null);
  };

  const handleMenuAction = (action: 'view' | 'edit' | 'delete') => {
    if (menuVehicle) {
      if (action === 'view') {
        handleOpen('view', menuVehicle);
      } else if (action === 'edit') {
        handleOpen('edit', menuVehicle);
      } else if (action === 'delete') {
        handleDelete(menuVehicle.id);
      }
    }
    handleMenuClose();
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploadError('');
    const newPhotos: string[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please upload only image files');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPhotos.push(e.target.result as string);
          if (newPhotos.length === files.length) {
            setPhotos([...photos, ...newPhotos]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle URL input
  const handleAddPhotoUrl = () => {
    if (!photoUrl.trim()) {
      setUploadError('Please enter a valid URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(photoUrl);
      setPhotos([...photos, photoUrl]);
      setPhotoUrl('');
      setUploadError('');
    } catch {
      setUploadError('Please enter a valid URL');
    }
  };

  // Handle paste from clipboard
  const handlePaste = async () => {
    try {
      const items = await navigator.clipboard.read();
      
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                setPhotos([...photos, e.target.result as string]);
                setUploadError('');
              }
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
      
      // Try text/plain for URLs
      const text = await navigator.clipboard.readText();
      if (text) {
        try {
          new URL(text);
          setPhotos([...photos, text]);
          setUploadError('');
        } catch {
          setUploadError('No image found in clipboard');
        }
      }
    } catch (error) {
      console.error('Paste error:', error);
      setUploadError('Failed to paste from clipboard. Please try uploading or using a URL.');
    }
  };

  // Remove photo
  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const decodeVIN = async () => {
    const vin = formData.vin.trim().toUpperCase();
    
    // Validate VIN format (17 characters, alphanumeric except I, O, Q)
    if (vin.length !== 17) {
      setVinError('VIN must be exactly 17 characters');
      return;
    }
    
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
      setVinError('Invalid VIN format. VIN cannot contain I, O, or Q');
      return;
    }

    setVinDecoding(true);
    setVinError('');

    try {
      // Use NHTSA VIN Decoder API
      const response = await axios.get(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`
      );

      if (response.data.Results) {
        const results = response.data.Results;
        
        // Helper function to find value by variable name
        const findValue = (variableName: string) => {
          const item = results.find((r: any) => r.Variable === variableName);
          return item?.Value || '';
        };

        // Extract vehicle information
        const year = findValue('Model Year');
        const make = findValue('Make');
        const model = findValue('Model');
        const trim = findValue('Trim');
        const vehicleType = findValue('Body Class');
        const transmission = findValue('Transmission Style');
        const fuelType = findValue('Fuel Type - Primary');

        const decodedYear = year ? parseInt(year) : formData.year;
        const decodedMake = make || formData.make;

        // Generate stock number with decoded make and year
        const stockNumber = generateStockNumber(decodedMake, decodedYear);

        // Update form data with decoded information
        setFormData((prev: any) => ({
          ...prev,
          stockNumber: stockNumber,
          vin: vin,
          year: decodedYear,
          make: decodedMake,
          model: model || prev.model,
          trim: trim || prev.trim,
          type: vehicleType || prev.type,
          transmission: transmission || prev.transmission,
          fuelType: fuelType || prev.fuelType,
        }));

        setVinError('');
      } else {
        setVinError('Unable to decode VIN. Please enter vehicle details manually.');
      }
    } catch (error) {
      console.error('Error decoding VIN:', error);
      setVinError('Error connecting to VIN decoder service. Please try again.');
    } finally {
      setVinDecoding(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const vehicleData = { ...formData, photos };
      if (viewMode === 'add') {
        await axios.post('/api/vehicles', vehicleData);
      } else if (viewMode === 'edit') {
        await axios.put(`/api/vehicles/${selectedVehicle.id}`, vehicleData);
      }
      fetchVehicles();
      handleClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await axios.delete(`/api/vehicles/${id}`);
        fetchVehicles();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'stockNumber', headerName: 'Stock #', width: 120 },
    { field: 'year', headerName: 'Year', width: 80 },
    { field: 'make', headerName: 'Make', width: 120 },
    { field: 'model', headerName: 'Model', width: 150 },
    { field: 'trim', headerName: 'Trim', width: 100 },
    { field: 'condition', headerName: 'Condition', width: 100 },
    { field: 'mileage', headerName: 'Mileage', width: 100 },
    ...(showCost ? [{
      field: 'cost',
      headerName: 'Dealer Cost',
      width: 120,
      renderCell: (params: any) => {
        const cost = params.row.cost || 0;
        return (
          <Typography sx={{ color: 'warning.main', fontWeight: 'bold' }}>
            ${cost.toLocaleString()}
          </Typography>
        );
      },
    }] : []),
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      renderCell: (params) => {
        const price = params.row.price || 0;
        return `$${price.toLocaleString()}`;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Available' ? 'success' :
            params.value === 'Sold' ? 'default' : 'warning'
          }
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Actions">
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, params.row)}
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Vehicle Inventory
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant={showCost ? 'contained' : 'outlined'}
            color={showCost ? 'warning' : 'inherit'}
            startIcon={showCost ? <Visibility /> : <VisibilityOff />}
            onClick={() => setShowCost(!showCost)}
          >
            {showCost ? 'Hide Cost' : 'Show Cost'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen('add')}
          >
            Add Vehicle
          </Button>
        </Box>
      </Box>

      {/* Search and Filter Section */}
      <Collapse in={showFilters}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              {/* Search Bar */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  placeholder="Search by Stock #, VIN, Make, Model, Trim, or Year..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Filter Dropdowns */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Make</InputLabel>
                  <Select
                    value={filters.make}
                    label="Make"
                    onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                  >
                    <MenuItem value="">All Makes</MenuItem>
                    {uniqueValues.makes.map((make) => (
                      <MenuItem key={make} value={make}>{make}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Model</InputLabel>
                  <Select
                    value={filters.model}
                    label="Model"
                    onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                  >
                    <MenuItem value="">All Models</MenuItem>
                    {uniqueValues.models.map((model) => (
                      <MenuItem key={model} value={model}>{model}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    value={filters.condition}
                    label="Condition"
                    onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  >
                    <MenuItem value="">All Conditions</MenuItem>
                    {uniqueValues.conditions.map((condition) => (
                      <MenuItem key={condition} value={condition}>{condition}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filters.type}
                    label="Type"
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {uniqueValues.types.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Transmission</InputLabel>
                  <Select
                    value={filters.transmission}
                    label="Transmission"
                    onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                  >
                    <MenuItem value="">All Transmissions</MenuItem>
                    {uniqueValues.transmissions.map((transmission) => (
                      <MenuItem key={transmission} value={transmission}>{transmission}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Fuel Type</InputLabel>
                  <Select
                    value={filters.fuelType}
                    label="Fuel Type"
                    onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                  >
                    <MenuItem value="">All Fuel Types</MenuItem>
                    {uniqueValues.fuelTypes.map((fuelType) => (
                      <MenuItem key={fuelType} value={fuelType}>{fuelType}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {uniqueValues.statuses.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={filters.location}
                    label="Location"
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  >
                    <MenuItem value="">All Locations</MenuItem>
                    {uniqueValues.locations.map((location) => (
                      <MenuItem key={location} value={location}>{location}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Price Range Slider */}
              <Grid item xs={12} md={6}>
                <Box sx={{ px: 2 }}>
                  <Typography gutterBottom>
                    Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue as number[])}
                    valueLabelDisplay="auto"
                    min={vehicles.length > 0 ? Math.min(...vehicles.map(v => v.price || 0)) : 0}
                    max={vehicles.length > 0 ? Math.max(...vehicles.map(v => v.price || 0)) : 100000}
                    step={1000}
                    valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                  />
                </Box>
              </Grid>

              {/* Year Range Slider */}
              <Grid item xs={12} md={6}>
                <Box sx={{ px: 2 }}>
                  <Typography gutterBottom>
                    Year Range: {yearRange[0]} - {yearRange[1]}
                  </Typography>
                  <Slider
                    value={yearRange}
                    onChange={(e, newValue) => setYearRange(newValue as number[])}
                    valueLabelDisplay="auto"
                    min={vehicles.length > 0 ? Math.min(...vehicles.map(v => v.year || 2000)) : 2000}
                    max={vehicles.length > 0 ? Math.max(...vehicles.map(v => v.year || new Date().getFullYear())) : new Date().getFullYear()}
                    step={1}
                  />
                </Box>
              </Grid>

              {/* Clear Filters Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {filteredVehicles.length} of {vehicles.length} vehicles
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    startIcon={<FilterList />}
                  >
                    Clear All Filters
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Collapse>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredVehicles}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode === 'add' ? 'Add Vehicle' : viewMode === 'edit' ? 'Edit Vehicle' : 'View Vehicle'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Number"
                value={formData.stockNumber}
                onChange={(e) => setFormData({ ...formData, stockNumber: e.target.value })}
                disabled={viewMode === 'view'}
                helperText={viewMode === 'add' ? 'Auto-generated based on Make and Year' : ''}
                InputProps={{
                  readOnly: viewMode === 'add',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="VIN"
                value={formData.vin}
                onChange={(e) => {
                  setFormData({ ...formData, vin: e.target.value });
                  setVinError('');
                }}
                disabled={viewMode === 'view'}
                error={!!vinError}
                helperText={vinError}
                InputProps={{
                  endAdornment: viewMode !== 'view' && (
                    <InputAdornment position="end">
                      <Tooltip title="Decode VIN to auto-fill vehicle details">
                        <span>
                          <Button
                            size="small"
                            onClick={decodeVIN}
                            disabled={vinDecoding || formData.vin.length !== 17}
                            startIcon={vinDecoding ? <CircularProgress size={16} /> : <SearchIcon />}
                          >
                            {vinDecoding ? 'Decoding...' : 'Decode'}
                          </Button>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {vinDecoding && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Decoding VIN from NHTSA database...
                </Alert>
              </Grid>
            )}
            {!vinDecoding && formData.vin && formData.make && viewMode === 'add' && (
              <Grid item xs={12}>
                <Alert severity="success">
                  Vehicle information decoded successfully!
                </Alert>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) => {
                  const newYear = parseInt(e.target.value);
                  setFormData({ ...formData, year: newYear });
                  // Auto-generate stock number if in add mode and make is set
                  if (viewMode === 'add' && formData.make) {
                    const stockNumber = generateStockNumber(formData.make, newYear);
                    setFormData((prev: any) => ({ ...prev, year: newYear, stockNumber }));
                  }
                }}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Make"
                value={formData.make}
                onChange={(e) => {
                  const newMake = e.target.value;
                  setFormData({ ...formData, make: newMake });
                  // Auto-generate stock number if in add mode and year is set
                  if (viewMode === 'add' && formData.year) {
                    const stockNumber = generateStockNumber(newMake, formData.year);
                    setFormData((prev: any) => ({ ...prev, make: newMake, stockNumber }));
                  }
                }}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trim"
                value={formData.trim}
                onChange={(e) => setFormData({ ...formData, trim: e.target.value })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={viewMode === 'view'}
              >
                {['Sedan', 'SUV', 'Truck', 'Coupe', 'Van', 'Convertible'].map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Condition"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                disabled={viewMode === 'view'}
              >
                {['New', 'Used', 'Certified'].map((condition) => (
                  <MenuItem key={condition} value={condition}>{condition}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                disabled={viewMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                disabled={viewMode === 'view'}
              >
                {['Available', 'Sold', 'Pending', 'On Hold'].map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Photo Management Section */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Photo sx={{ mr: 1 }} />
                    <Typography variant="h6">Vehicle Photos</Typography>
                    <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                      ({photos.length} photo{photos.length !== 1 ? 's' : ''})
                    </Typography>
                  </Box>

                  {viewMode !== 'view' && (
                    <>
                      <Tabs value={photoTab} onChange={(e, val) => setPhotoTab(val)} sx={{ mb: 2 }}>
                        <Tab icon={<CloudUpload />} label="Upload" />
                        <Tab icon={<LinkIcon />} label="URL" />
                        <Tab icon={<ContentPaste />} label="Paste" />
                      </Tabs>

                      {/* Upload Tab */}
                      {photoTab === 0 && (
                        <Box>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                          />
                          <Button
                            variant="outlined"
                            startIcon={<CloudUpload />}
                            onClick={() => fileInputRef.current?.click()}
                            fullWidth
                          >
                            Choose Files to Upload
                          </Button>
                          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                            Supports: JPG, PNG, GIF. Multiple files allowed.
                          </Typography>
                        </Box>
                      )}

                      {/* URL Tab */}
                      {photoTab === 1 && (
                        <Box>
                          <TextField
                            fullWidth
                            label="Image URL"
                            placeholder="https://example.com/image.jpg"
                            value={photoUrl}
                            onChange={(e) => setPhotoUrl(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddPhotoUrl()}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Button onClick={handleAddPhotoUrl}>Add</Button>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      )}

                      {/* Paste Tab */}
                      {photoTab === 2 && (
                        <Box>
                          <Button
                            variant="outlined"
                            startIcon={<ContentPaste />}
                            onClick={handlePaste}
                            fullWidth
                          >
                            Paste from Clipboard
                          </Button>
                          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                            Copy an image (Ctrl+C) and click to paste it here.
                          </Typography>
                        </Box>
                      )}

                      {uploadError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                          {uploadError}
                        </Alert>
                      )}
                    </>
                  )}

                  {/* Photo Gallery */}
                  {photos.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <ImageList cols={3} gap={8} sx={{ maxHeight: 400 }}>
                        {photos.map((photo, index) => (
                          <ImageListItem key={index}>
                            <img
                              src={photo}
                              alt={`Vehicle photo ${index + 1}`}
                              loading="lazy"
                              style={{ 
                                height: 140, 
                                objectFit: 'cover',
                                borderRadius: 4,
                              }}
                            />
                            {viewMode !== 'view' && (
                              <ImageListItemBar
                                position="top"
                                actionIcon={
                                  <IconButton
                                    sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}
                                    onClick={() => handleRemovePhoto(index)}
                                    size="small"
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                }
                                sx={{ background: 'transparent' }}
                              />
                            )}
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  )}

                  {photos.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                      <Photo sx={{ fontSize: 48, opacity: 0.3 }} />
                      <Typography variant="body2">No photos added yet</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {viewMode !== 'view' && (
            <Button onClick={handleSubmit} variant="contained">
              {viewMode === 'add' ? 'Add' : 'Save'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>
          <ListItemIcon>
            <Visibility fontSize="small" color="info" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <Edit fontSize="small" color="primary" />
          </ListItemIcon>
          Edit Vehicle
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          Delete Vehicle
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Vehicles;
