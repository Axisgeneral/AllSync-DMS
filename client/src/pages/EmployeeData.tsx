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
  Tab,
  Tabs,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import VerifiedIcon from '@mui/icons-material/Verified';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract';
  status: 'Active' | 'On Leave' | 'Terminated';
  address: string;
  city: string;
  state: string;
  zip: string;
  emergencyContact: string;
  emergencyPhone: string;
  certifications: string[];
  notes: string;
}

const EmployeeData: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Sales',
    position: '',
    hireDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-Time',
    status: 'Active',
    address: '',
    city: '',
    state: '',
    zip: '',
    emergencyContact: '',
    emergencyPhone: '',
    certifications: [],
    notes: '',
  });

  // Mock data
  useEffect(() => {
    const mockEmployees: Employee[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@allsyncdms.com',
        phone: '(555) 123-4567',
        department: 'Sales',
        position: 'Sales Manager',
        hireDate: '2020-01-15',
        employmentType: 'Full-Time',
        status: 'Active',
        address: '123 Main St',
        city: 'Columbus',
        state: 'OH',
        zip: '43215',
        emergencyContact: 'Jane Smith',
        emergencyPhone: '(555) 123-4568',
        certifications: ['Sales Certification', 'F&I Certified'],
        notes: 'Top performer, excellent customer reviews',
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@allsyncdms.com',
        phone: '(555) 234-5678',
        department: 'Service',
        position: 'Service Technician',
        hireDate: '2019-06-01',
        employmentType: 'Full-Time',
        status: 'Active',
        address: '456 Oak Ave',
        city: 'Columbus',
        state: 'OH',
        zip: '43220',
        emergencyContact: 'John Doe',
        emergencyPhone: '(555) 234-5679',
        certifications: ['ASE Master Technician', 'Hybrid Vehicle Certified'],
        notes: 'ASE certified, specializes in diagnostics',
      },
      {
        id: 3,
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@allsyncdms.com',
        phone: '(555) 345-6789',
        department: 'Sales',
        position: 'Sales Associate',
        hireDate: '2021-03-15',
        employmentType: 'Full-Time',
        status: 'Active',
        address: '789 Elm St',
        city: 'Columbus',
        state: 'OH',
        zip: '43230',
        emergencyContact: 'Sarah Johnson',
        emergencyPhone: '(555) 345-6790',
        certifications: ['Sales Training'],
        notes: 'Strong closer, good with financing options',
      },
      {
        id: 4,
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah.williams@allsyncdms.com',
        phone: '(555) 456-7890',
        department: 'F&I',
        position: 'F&I Manager',
        hireDate: '2018-09-01',
        employmentType: 'Full-Time',
        status: 'Active',
        address: '321 Pine Rd',
        city: 'Columbus',
        state: 'OH',
        zip: '43240',
        emergencyContact: 'Tom Williams',
        emergencyPhone: '(555) 456-7891',
        certifications: ['F&I Certification', 'Compliance Training'],
        notes: 'Excellent product knowledge, high penetration rates',
      },
      {
        id: 5,
        firstName: 'Tom',
        lastName: 'Brown',
        email: 'tom.brown@allsyncdms.com',
        phone: '(555) 567-8901',
        department: 'Service',
        position: 'Service Advisor',
        hireDate: '2022-01-10',
        employmentType: 'Full-Time',
        status: 'Active',
        address: '654 Maple Dr',
        city: 'Columbus',
        state: 'OH',
        zip: '43250',
        emergencyContact: 'Lisa Brown',
        emergencyPhone: '(555) 567-8902',
        certifications: ['Customer Service Excellence'],
        notes: 'Great communication skills, builds customer loyalty',
      },
    ];
    setEmployees(mockEmployees);
  }, []);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filteredEmployees = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return employees;
    }

    const searchTerm = normalizeText(trimmedQuery);

    return employees.filter((emp) => {
      if (normalizeText(`${emp.firstName} ${emp.lastName}`).includes(searchTerm)) return true;
      if (normalizeText(emp.email).includes(searchTerm)) return true;
      if (normalizeText(emp.department).includes(searchTerm)) return true;
      if (normalizeText(emp.position).includes(searchTerm)) return true;
      if (normalizeText(emp.status).includes(searchTerm)) return true;

      return false;
    });
  }, [employees, searchQuery]);

  const handleOpen = (employee?: Employee) => {
    if (employee) {
      setSelectedEmployee(employee);
      setFormData(employee);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: 'Sales',
        position: '',
        hireDate: new Date().toISOString().split('T')[0],
        employmentType: 'Full-Time',
        status: 'Active',
        address: '',
        city: '',
        state: '',
        zip: '',
        emergencyContact: '',
        emergencyPhone: '',
        certifications: [],
        notes: '',
      });
    }
    setOpen(true);
  };

  const handleViewOpen = (employee: Employee) => {
    setSelectedEmployee(employee);
    setViewOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedEmployee(null);
    setTabValue(0);
  };

  const handleSubmit = () => {
    if (selectedEmployee) {
      setEmployees(employees.map(e => 
        e.id === selectedEmployee.id ? { ...formData as Employee, id: e.id } : e
      ));
    } else {
      const newEmployee: Employee = {
        ...formData as Employee,
        id: employees.length + 1,
      };
      setEmployees([...employees, newEmployee]);
    }
    handleClose();
  };

  const handleChange = (field: keyof Employee, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'On Leave': return 'warning';
      case 'Terminated': return 'error';
      default: return 'default';
    }
  };

  // Statistics
  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'Active').length,
    departments: new Set(employees.map(e => e.department)).size,
    certifications: employees.reduce((sum, e) => sum + e.certifications.length, 0),
  };

  const columns: GridColDef[] = [
    {
      field: 'fullName',
      headerName: 'Name',
      width: 180,
      valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`,
    },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'phone', headerName: 'Phone', width: 140 },
    { field: 'department', headerName: 'Department', width: 120 },
    { field: 'position', headerName: 'Position', width: 160 },
    { field: 'hireDate', headerName: 'Hire Date', width: 120 },
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
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="info"
              onClick={(e) => {
                e.stopPropagation();
                handleViewOpen(params.row as Employee);
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
                handleOpen(params.row as Employee);
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
          Employee Data Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          New Employee
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
                    Total Employees
                  </Typography>
                  <Typography variant="h4">{stats.total}</Typography>
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
                    Active
                  </Typography>
                  <Typography variant="h4" color="success.main">{stats.active}</Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
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
                    Departments
                  </Typography>
                  <Typography variant="h4">{stats.departments}</Typography>
                </Box>
                <WorkIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
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
                    Certifications
                  </Typography>
                  <Typography variant="h4">{stats.certifications}</Typography>
                </Box>
                <VerifiedIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by name, email, department, position, status..."
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
          rows={filteredEmployees}
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
        <DialogTitle>{selectedEmployee ? 'Edit Employee' : 'New Employee'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
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
                  <MenuItem value="Parts">Parts</MenuItem>
                  <MenuItem value="F&I">F&I</MenuItem>
                  <MenuItem value="Management">Management</MenuItem>
                  <MenuItem value="Accounting">Accounting</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Position"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Hire Date"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => handleChange('hireDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Employment Type"
                  value={formData.employmentType}
                  onChange={(e) => handleChange('employmentType', e.target.value)}
                  required
                >
                  <MenuItem value="Full-Time">Full-Time</MenuItem>
                  <MenuItem value="Part-Time">Part-Time</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  required
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="On Leave">On Leave</MenuItem>
                  <MenuItem value="Terminated">Terminated</MenuItem>
                </TextField>
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
                  label="ZIP"
                  value={formData.zip}
                  onChange={(e) => handleChange('zip', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleChange('emergencyContact', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Emergency Phone"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleChange('emergencyPhone', e.target.value)}
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
            {selectedEmployee ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Employee Details - {selectedEmployee?.firstName} {selectedEmployee?.lastName}</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <Box sx={{ mt: 2 }}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                <Tab label="Personal Info" />
                <Tab label="Employment" />
                <Tab label="Emergency Contact" />
              </Tabs>

              {tabValue === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                    <Typography variant="body1">{selectedEmployee.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                    <Typography variant="body1">{selectedEmployee.phone}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                    <Typography variant="body1">
                      {selectedEmployee.address}<br />
                      {selectedEmployee.city}, {selectedEmployee.state} {selectedEmployee.zip}
                    </Typography>
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Department</Typography>
                    <Typography variant="body1">{selectedEmployee.department}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Position</Typography>
                    <Typography variant="body1">{selectedEmployee.position}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Hire Date</Typography>
                    <Typography variant="body1">{selectedEmployee.hireDate}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Employment Type</Typography>
                    <Typography variant="body1">{selectedEmployee.employmentType}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                    <Chip
                      label={selectedEmployee.status}
                      color={getStatusColor(selectedEmployee.status)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Certifications</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {selectedEmployee.certifications.map((cert, idx) => (
                        <Chip key={idx} label={cert} color="primary" size="small" />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
                    <Typography variant="body1">{selectedEmployee.notes}</Typography>
                  </Grid>
                </Grid>
              )}

              {tabValue === 2 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Emergency Contact</Typography>
                    <Typography variant="body1">{selectedEmployee.emergencyContact}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Emergency Phone</Typography>
                    <Typography variant="body1">{selectedEmployee.emergencyPhone}</Typography>
                  </Grid>
                </Grid>
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

export default EmployeeData;
