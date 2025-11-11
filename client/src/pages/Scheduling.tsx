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
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import WarningIcon from '@mui/icons-material/Warning';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';

interface Schedule {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  date: string;
  shiftType: 'Morning' | 'Afternoon' | 'Evening' | 'Full Day';
  startTime: string;
  endTime: string;
  status: 'Scheduled' | 'Confirmed' | 'Called Off' | 'Completed';
  notes: string;
}

const Scheduling: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState<Partial<Schedule>>({
    employeeId: 0,
    employeeName: '',
    department: 'Sales',
    date: new Date().toISOString().split('T')[0],
    shiftType: 'Full Day',
    startTime: '08:00',
    endTime: '17:00',
    status: 'Scheduled',
    notes: '',
  });

  // Mock employees
  const employees = [
    { id: 1, name: 'John Smith', department: 'Sales' },
    { id: 2, name: 'Jane Doe', department: 'Service' },
    { id: 3, name: 'Mike Johnson', department: 'Sales' },
    { id: 4, name: 'Sarah Williams', department: 'F&I' },
    { id: 5, name: 'Tom Brown', department: 'Service' },
    { id: 6, name: 'Lisa Davis', department: 'Parts' },
  ];

  // Mock data
  useEffect(() => {
    const today = new Date();
    const mockSchedules: Schedule[] = [];
    
    // Generate schedules for the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Schedule multiple employees per day
      employees.forEach((emp, idx) => {
        if (i < 5 || idx < 2) { // Weekdays full staff, weekends reduced
          mockSchedules.push({
            id: mockSchedules.length + 1,
            employeeId: emp.id,
            employeeName: emp.name,
            department: emp.department,
            date: dateStr,
            shiftType: 'Full Day',
            startTime: '08:00',
            endTime: '17:00',
            status: i === 0 ? 'Confirmed' : 'Scheduled',
            notes: '',
          });
        }
      });
    }
    
    setSchedules(mockSchedules);
  }, []);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filteredSchedules = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return schedules;
    }

    const searchTerm = normalizeText(trimmedQuery);

    return schedules.filter((schedule) => {
      if (normalizeText(schedule.employeeName).includes(searchTerm)) return true;
      if (normalizeText(schedule.department).includes(searchTerm)) return true;
      if (normalizeText(schedule.shiftType).includes(searchTerm)) return true;
      if (normalizeText(schedule.status).includes(searchTerm)) return true;
      if (normalizeText(schedule.date).includes(searchTerm)) return true;

      return false;
    });
  }, [schedules, searchQuery]);

  const handleOpen = (schedule?: Schedule) => {
    if (schedule) {
      setSelectedSchedule(schedule);
      setFormData(schedule);
    } else {
      setFormData({
        employeeId: 0,
        employeeName: '',
        department: 'Sales',
        date: new Date().toISOString().split('T')[0],
        shiftType: 'Full Day',
        startTime: '08:00',
        endTime: '17:00',
        status: 'Scheduled',
        notes: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSchedule(null);
  };

  const handleSubmit = () => {
    const selectedEmployee = employees.find(e => e.id === formData.employeeId);
    if (selectedSchedule) {
      setSchedules(schedules.map(s => 
        s.id === selectedSchedule.id ? { ...formData as Schedule, id: s.id } : s
      ));
    } else {
      const newSchedule: Schedule = {
        ...formData as Schedule,
        id: schedules.length + 1,
        employeeName: selectedEmployee?.name || '',
        department: selectedEmployee?.department || formData.department || 'Sales',
      };
      setSchedules([...schedules, newSchedule]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  const handleChange = (field: keyof Schedule, value: any) => {
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
    
    // Auto-set times based on shift type
    if (field === 'shiftType') {
      switch (value) {
        case 'Morning':
          setFormData(prev => ({ ...prev, shiftType: value, startTime: '06:00', endTime: '14:00' }));
          break;
        case 'Afternoon':
          setFormData(prev => ({ ...prev, shiftType: value, startTime: '14:00', endTime: '22:00' }));
          break;
        case 'Evening':
          setFormData(prev => ({ ...prev, shiftType: value, startTime: '16:00', endTime: '24:00' }));
          break;
        case 'Full Day':
          setFormData(prev => ({ ...prev, shiftType: value, startTime: '08:00', endTime: '17:00' }));
          break;
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Confirmed': return 'info';
      case 'Scheduled': return 'default';
      case 'Called Off': return 'error';
      default: return 'default';
    }
  };

  // Statistics
  const today = new Date().toISOString().split('T')[0];
  const thisWeek = schedules.filter(s => {
    const scheduleDate = new Date(s.date);
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return scheduleDate >= new Date() && scheduleDate <= weekFromNow;
  });
  
  const stats = {
    totalScheduled: thisWeek.length,
    uniqueEmployees: new Set(thisWeek.map(s => s.employeeId)).size,
    todayScheduled: schedules.filter(s => s.date === today).length,
    conflicts: 0, // In a real app, check for scheduling conflicts
  };

  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'employeeName', headerName: 'Employee', width: 180 },
    { field: 'department', headerName: 'Department', width: 120 },
    { field: 'shiftType', headerName: 'Shift Type', width: 120 },
    { field: 'startTime', headerName: 'Start Time', width: 100 },
    { field: 'endTime', headerName: 'End Time', width: 100 },
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
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen(params.row as Schedule);
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
          Employee Scheduling
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          New Schedule
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
                    This Week
                  </Typography>
                  <Typography variant="h4">{stats.totalScheduled}</Typography>
                  <Typography variant="caption" color="textSecondary">shifts</Typography>
                </Box>
                <EventIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
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
                    Employees
                  </Typography>
                  <Typography variant="h4">{stats.uniqueEmployees}</Typography>
                  <Typography variant="caption" color="textSecondary">scheduled</Typography>
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
                    Today
                  </Typography>
                  <Typography variant="h4" color="info.main">{stats.todayScheduled}</Typography>
                  <Typography variant="caption" color="textSecondary">shifts</Typography>
                </Box>
                <EventIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
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
                    Conflicts
                  </Typography>
                  <Typography variant="h4" color={stats.conflicts > 0 ? 'error.main' : 'success.main'}>
                    {stats.conflicts}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">scheduling issues</Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40, color: stats.conflicts > 0 ? 'error.main' : 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by employee, department, date, shift type, status..."
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
          rows={filteredSchedules}
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
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedSchedule ? 'Edit Schedule' : 'New Schedule'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
                  select
                  label="Shift Type"
                  value={formData.shiftType}
                  onChange={(e) => handleChange('shiftType', e.target.value)}
                  required
                >
                  <MenuItem value="Morning">Morning (6am-2pm)</MenuItem>
                  <MenuItem value="Afternoon">Afternoon (2pm-10pm)</MenuItem>
                  <MenuItem value="Evening">Evening (4pm-12am)</MenuItem>
                  <MenuItem value="Full Day">Full Day (8am-5pm)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  required
                >
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Called Off">Called Off</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </TextField>
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
            {selectedSchedule ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Scheduling;
