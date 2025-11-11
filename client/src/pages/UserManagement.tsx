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
  FormControlLabel,
  Switch,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockIcon from '@mui/icons-material/Lock';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'Manager' | 'Sales' | 'Service' | 'Accountant' | 'User';
  department: string;
  isActive: boolean;
  lastLogin: string;
  createdDate: string;
  permissions: string[];
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuUser, setMenuUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'User',
    department: 'Sales',
    isActive: true,
    permissions: [],
  });

  // Available permissions
  const allPermissions = [
    'View Dashboard',
    'Manage Customers',
    'Manage Leads',
    'Manage Vehicles',
    'Manage Deals',
    'View Reports',
    'Manage Service',
    'Manage Parts',
    'Manage F&I',
    'Manage Accounting',
    'Manage Payroll',
    'Manage Users',
    'System Settings',
  ];

  // Mock data
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@allsyncdms.com',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'Admin',
        department: 'Management',
        isActive: true,
        lastLogin: '2025-11-11T09:30:00',
        createdDate: '2023-01-01',
        permissions: allPermissions,
      },
      {
        id: 2,
        username: 'jsmith',
        email: 'john.smith@allsyncdms.com',
        firstName: 'John',
        lastName: 'Smith',
        role: 'Manager',
        department: 'Sales',
        isActive: true,
        lastLogin: '2025-11-11T08:15:00',
        createdDate: '2023-03-15',
        permissions: ['View Dashboard', 'Manage Customers', 'Manage Leads', 'Manage Vehicles', 'Manage Deals', 'View Reports'],
      },
      {
        id: 3,
        username: 'jdoe',
        email: 'jane.doe@allsyncdms.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'Service',
        department: 'Service',
        isActive: true,
        lastLogin: '2025-11-10T17:45:00',
        createdDate: '2023-06-01',
        permissions: ['View Dashboard', 'Manage Service', 'Manage Parts'],
      },
      {
        id: 4,
        username: 'swilliams',
        email: 'sarah.williams@allsyncdms.com',
        firstName: 'Sarah',
        lastName: 'Williams',
        role: 'Manager',
        department: 'F&I',
        isActive: true,
        lastLogin: '2025-11-11T07:00:00',
        createdDate: '2023-09-01',
        permissions: ['View Dashboard', 'Manage Deals', 'Manage F&I', 'View Reports'],
      },
      {
        id: 5,
        username: 'mjohnson',
        email: 'mike.johnson@allsyncdms.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        role: 'Sales',
        department: 'Sales',
        isActive: true,
        lastLogin: '2025-11-09T15:30:00',
        createdDate: '2024-03-15',
        permissions: ['View Dashboard', 'Manage Customers', 'Manage Leads', 'Manage Vehicles'],
      },
      {
        id: 6,
        username: 'tsmith',
        email: 'tom.smith@allsyncdms.com',
        firstName: 'Tom',
        lastName: 'Smith',
        role: 'Accountant',
        department: 'Accounting',
        isActive: false,
        lastLogin: '2025-10-15T12:00:00',
        createdDate: '2024-01-10',
        permissions: ['View Dashboard', 'Manage Accounting', 'Manage Payroll', 'View Reports'],
      },
    ];
    setUsers(mockUsers);
  }, []);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filteredUsers = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return users;
    }

    const searchTerm = normalizeText(trimmedQuery);

    return users.filter((user) => {
      if (normalizeText(user.username).includes(searchTerm)) return true;
      if (normalizeText(`${user.firstName} ${user.lastName}`).includes(searchTerm)) return true;
      if (normalizeText(user.email).includes(searchTerm)) return true;
      if (normalizeText(user.role).includes(searchTerm)) return true;
      if (normalizeText(user.department).includes(searchTerm)) return true;

      return false;
    });
  }, [users, searchQuery]);

  const handleOpen = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData(user);
    } else {
      setFormData({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        role: 'User',
        department: 'Sales',
        isActive: true,
        permissions: [],
      });
    }
    setOpen(true);
  };

  const handleViewOpen = (user: User) => {
    setSelectedUser(user);
    setViewOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedUser(null);
    setTabValue(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuUser(null);
  };

  const handleMenuAction = (action: 'view' | 'edit' | 'delete') => {
    if (menuUser) {
      if (action === 'view') {
        handleViewOpen(menuUser);
      } else if (action === 'edit') {
        handleOpen(menuUser);
      } else if (action === 'delete') {
        handleDelete(menuUser.id);
      }
    }
    handleMenuClose();
  };

  const handleSubmit = () => {
    if (selectedUser) {
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...formData as User, id: u.id } : u
      ));
    } else {
      const newUser: User = {
        ...formData as User,
        id: users.length + 1,
        lastLogin: '',
        createdDate: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleChange = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionToggle = (permission: string) => {
    const currentPermissions = formData.permissions || [];
    const newPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter(p => p !== permission)
      : [...currentPermissions, permission];
    setFormData(prev => ({ ...prev, permissions: newPermissions }));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'error';
      case 'Manager': return 'warning';
      case 'Accountant': return 'info';
      default: return 'default';
    }
  };

  const formatDateTime = (datetime: string) => {
    if (!datetime) return 'Never';
    const date = new Date(datetime);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Statistics
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    admins: users.filter(u => u.role === 'Admin').length,
    locked: users.filter(u => !u.isActive).length,
  };

  const columns: GridColDef[] = [
    { field: 'username', headerName: 'Username', width: 140 },
    {
      field: 'fullName',
      headerName: 'Name',
      width: 180,
      valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`,
    },
    { field: 'email', headerName: 'Email', width: 220 },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value as string}
          color={getRoleColor(params.value as string)}
          size="small"
        />
      ),
    },
    { field: 'department', headerName: 'Department', width: 130 },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? 'Active' : 'Locked'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      width: 160,
      renderCell: (params: GridRenderCellParams) => formatDateTime(params.value as string),
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
              onClick={(e) => handleMenuOpen(e, params.row as User)}
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
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          New User
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
                    Total Users
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
                    Active Users
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
                    Administrators
                  </Typography>
                  <Typography variant="h4" color="error.main">{stats.admins}</Typography>
                </Box>
                <AdminPanelSettingsIcon sx={{ fontSize: 40, color: 'error.main', opacity: 0.3 }} />
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
                    Locked Accounts
                  </Typography>
                  <Typography variant="h4">{stats.locked}</Typography>
                </Box>
                <LockIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by username, name, email, role, department..."
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
          rows={filteredUsers}
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
        <DialogTitle>{selectedUser ? 'Edit User' : 'New User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
              <Tab label="User Info" />
              <Tab label="Permissions" />
            </Tabs>

            {tabValue === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
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
                    select
                    label="Role"
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    required
                  >
                    <MenuItem value="Admin">Administrator</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Sales">Sales User</MenuItem>
                    <MenuItem value="Service">Service User</MenuItem>
                    <MenuItem value="Accountant">Accountant</MenuItem>
                    <MenuItem value="User">General User</MenuItem>
                  </TextField>
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
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => handleChange('isActive', e.target.checked)}
                      />
                    }
                    label="Active User Account"
                  />
                </Grid>
              </Grid>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Select Permissions
                </Typography>
                <List>
                  {allPermissions.map((permission) => (
                    <ListItem key={permission} dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={(formData.permissions || []).includes(permission)}
                            onChange={() => handlePermissionToggle(permission)}
                          />
                        }
                        label={permission}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>User Details - {selectedUser?.username}</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Full Name</Typography>
                  <Typography variant="body1">{selectedUser.firstName} {selectedUser.lastName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  <Typography variant="body1">{selectedUser.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Role</Typography>
                  <Chip label={selectedUser.role} color={getRoleColor(selectedUser.role)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Department</Typography>
                  <Typography variant="body1">{selectedUser.department}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip 
                    label={selectedUser.isActive ? 'Active' : 'Locked'} 
                    color={selectedUser.isActive ? 'success' : 'default'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Created Date</Typography>
                  <Typography variant="body1">{selectedUser.createdDate}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Last Login</Typography>
                  <Typography variant="body1">{formatDateTime(selectedUser.lastLogin)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>Permissions</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedUser.permissions.map((permission, idx) => (
                      <Chip key={idx} label={permission} size="small" color="primary" />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button variant="outlined" color="warning">
            Reset Password
          </Button>
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
            <VisibilityIcon fontSize="small" color="info" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          Edit User
        </MenuItem>
        <MenuItem 
          onClick={() => handleMenuAction('delete')}
          disabled={menuUser?.role === 'Admin'}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete User
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserManagement;
