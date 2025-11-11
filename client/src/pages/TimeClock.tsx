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
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import TodayIcon from '@mui/icons-material/Today';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';

interface TimeEntry {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  clockIn: string;
  clockOut?: string;
  breakStart?: string;
  breakEnd?: string;
  totalHours: number;
  status: 'Clocked In' | 'On Break' | 'Clocked Out';
  date: string;
  notes: string;
}

const TimeClock: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuEntry, setMenuEntry] = useState<TimeEntry | null>(null);
  const [formData, setFormData] = useState<Partial<TimeEntry>>({
    employeeId: 0,
    employeeName: '',
    department: 'Sales',
    clockIn: '',
    clockOut: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Mock employees
  const employees = [
    { id: 1, name: 'John Smith', department: 'Sales' },
    { id: 2, name: 'Jane Doe', department: 'Service' },
    { id: 3, name: 'Mike Johnson', department: 'Sales' },
    { id: 4, name: 'Sarah Williams', department: 'F&I' },
    { id: 5, name: 'Tom Brown', department: 'Service' },
  ];

  // Mock data
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const mockEntries: TimeEntry[] = [
      {
        id: 1,
        employeeId: 1,
        employeeName: 'John Smith',
        department: 'Sales',
        clockIn: `${today}T08:00:00`,
        clockOut: `${today}T17:30:00`,
        breakStart: `${today}T12:00:00`,
        breakEnd: `${today}T12:30:00`,
        totalHours: 9.0,
        status: 'Clocked Out',
        date: today,
        notes: '',
      },
      {
        id: 2,
        employeeId: 2,
        employeeName: 'Jane Doe',
        department: 'Service',
        clockIn: `${today}T07:30:00`,
        totalHours: 0,
        status: 'Clocked In',
        date: today,
        notes: '',
      },
      {
        id: 3,
        employeeId: 3,
        employeeName: 'Mike Johnson',
        department: 'Sales',
        clockIn: `${today}T08:30:00`,
        breakStart: `${today}T12:15:00`,
        totalHours: 0,
        status: 'On Break',
        date: today,
        notes: '',
      },
      {
        id: 4,
        employeeId: 4,
        employeeName: 'Sarah Williams',
        department: 'F&I',
        clockIn: `${today}T09:00:00`,
        totalHours: 0,
        status: 'Clocked In',
        date: today,
        notes: '',
      },
    ];
    setTimeEntries(mockEntries);
  }, []);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filteredEntries = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return timeEntries;
    }

    const searchTerm = normalizeText(trimmedQuery);

    return timeEntries.filter((entry) => {
      if (normalizeText(entry.employeeName).includes(searchTerm)) return true;
      if (normalizeText(entry.department).includes(searchTerm)) return true;
      if (normalizeText(entry.status).includes(searchTerm)) return true;
      if (normalizeText(entry.date).includes(searchTerm)) return true;

      return false;
    });
  }, [timeEntries, searchQuery]);

  const handleOpen = (entry?: TimeEntry) => {
    if (entry) {
      setSelectedEntry(entry);
      setFormData(entry);
    } else {
      setFormData({
        employeeId: 0,
        employeeName: '',
        department: 'Sales',
        clockIn: '',
        clockOut: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEntry(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, entry: TimeEntry) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuEntry(entry);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuEntry(null);
  };

  const handleMenuAction = (action: 'edit' | 'delete') => {
    if (menuEntry) {
      switch (action) {
        case 'edit':
          setSelectedEntry(menuEntry);
          setFormData(menuEntry);
          setOpen(true);
          break;
        case 'delete':
          handleDelete(menuEntry.id);
          break;
      }
    }
    handleMenuClose();
  };

  const handleSubmit = () => {
    const selectedEmployee = employees.find(e => e.id === formData.employeeId);
    const newEntry: TimeEntry = {
      ...formData as TimeEntry,
      id: timeEntries.length + 1,
      employeeName: selectedEmployee?.name || '',
      department: selectedEmployee?.department || formData.department || 'Sales',
      totalHours: 0,
      status: 'Clocked In',
    };
    setTimeEntries([...timeEntries, newEntry]);
    handleClose();
  };

  const handleDelete = (id: number) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
  };

  const handleChange = (field: keyof TimeEntry, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-populate employee name and department
    if (field === 'employeeId') {
      const employee = employees.find(e => e.id === value);
      if (employee) {
        setFormData(prev => ({
          ...prev,
          employeeId: value,
          employeeName: employee.name,
          department: employee.department,
        }));
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Clocked In': return 'success';
      case 'On Break': return 'warning';
      case 'Clocked Out': return 'default';
      default: return 'default';
    }
  };

  const formatTime = (datetime?: string) => {
    if (!datetime) return '-';
    const date = new Date(datetime);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatHours = (hours: number) => {
    return hours.toFixed(2);
  };

  // Statistics
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = timeEntries.filter(e => e.date === today);
  const stats = {
    totalToday: todayEntries.length,
    clockedIn: todayEntries.filter(e => e.status === 'Clocked In' || e.status === 'On Break').length,
    totalHours: todayEntries.reduce((sum, e) => sum + e.totalHours, 0),
  };

  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'employeeName', headerName: 'Employee', width: 180 },
    { field: 'department', headerName: 'Department', width: 120 },
    {
      field: 'clockIn',
      headerName: 'Clock In',
      width: 100,
      renderCell: (params: GridRenderCellParams) => formatTime(params.value as string),
    },
    {
      field: 'clockOut',
      headerName: 'Clock Out',
      width: 100,
      renderCell: (params: GridRenderCellParams) => formatTime(params.value as string),
    },
    {
      field: 'breakStart',
      headerName: 'Break Start',
      width: 110,
      renderCell: (params: GridRenderCellParams) => formatTime(params.value as string),
    },
    {
      field: 'breakEnd',
      headerName: 'Break End',
      width: 110,
      renderCell: (params: GridRenderCellParams) => formatTime(params.value as string),
    },
    {
      field: 'totalHours',
      headerName: 'Total Hours',
      width: 110,
      renderCell: (params: GridRenderCellParams) => (
        <Typography fontWeight="bold">
          {formatHours(params.value as number)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
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
        <Box>
          <Tooltip title="Actions">
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, params.row as TimeEntry)}
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
          Time Clock
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          New Time Entry
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
                    Entries Today
                  </Typography>
                  <Typography variant="h4">{stats.totalToday}</Typography>
                </Box>
                <TodayIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
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
                    Clocked In
                  </Typography>
                  <Typography variant="h4" color="success.main">{stats.clockedIn}</Typography>
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
                    Hours Today
                  </Typography>
                  <Typography variant="h4">{formatHours(stats.totalHours)}</Typography>
                </Box>
                <AccessTimeIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Alert severity="info" sx={{ py: 0 }}>
                <Typography variant="body2">
                  Current Time: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by employee, department, status, date..."
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

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedEntry ? 'Edit Time Entry' : 'New Time Entry'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Employee"
                  value={formData.employeeId}
                  onChange={(e) => handleChange('employeeId', parseInt(e.target.value))}
                  required
                >
                  {employees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Clock In"
                  type="time"
                  value={formData.clockIn?.split('T')[1]?.substring(0, 5) || ''}
                  onChange={(e) => handleChange('clockIn', `${formData.date}T${e.target.value}:00`)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Clock Out"
                  type="time"
                  value={formData.clockOut?.split('T')[1]?.substring(0, 5) || ''}
                  onChange={(e) => handleChange('clockOut', e.target.value ? `${formData.date}T${e.target.value}:00` : '')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Break Start"
                  type="time"
                  value={formData.breakStart?.split('T')[1]?.substring(0, 5) || ''}
                  onChange={(e) => handleChange('breakStart', e.target.value ? `${formData.date}T${e.target.value}:00` : '')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Break End"
                  type="time"
                  value={formData.breakEnd?.split('T')[1]?.substring(0, 5) || ''}
                  onChange={(e) => handleChange('breakEnd', e.target.value ? `${formData.date}T${e.target.value}:00` : '')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedEntry ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          Edit Entry
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete Entry
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TimeClock;
