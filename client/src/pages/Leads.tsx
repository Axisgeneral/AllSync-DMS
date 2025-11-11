import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  interest: string;
  score: number;
  notes: string;
  assignedTo: string;
  createdDate: string;
  lastContact: string;
}

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<Partial<Lead>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    source: 'Website',
    status: 'New',
    interest: 'Vehicle Purchase',
    score: 50,
    notes: '',
    assignedTo: '',
    lastContact: new Date().toISOString().split('T')[0],
  });

  // Mock data
  useEffect(() => {
    const mockLeads: Lead[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        source: 'Website',
        status: 'Contacted',
        interest: 'New Car',
        score: 85,
        notes: 'Interested in SUVs, budget $40k',
        assignedTo: 'Sarah Johnson',
        createdDate: '2025-11-05',
        lastContact: '2025-11-06',
      },
      {
        id: 2,
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@email.com',
        phone: '(555) 234-5678',
        source: 'Referral',
        status: 'Qualified',
        interest: 'Used Car',
        score: 92,
        notes: 'Looking for reliable sedan, trade-in available',
        assignedTo: 'Mike Wilson',
        createdDate: '2025-11-04',
        lastContact: '2025-11-07',
      },
      {
        id: 3,
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@email.com',
        phone: '(555) 345-6789',
        source: 'Walk-in',
        status: 'New',
        interest: 'Financing',
        score: 65,
        notes: 'Needs financing options',
        assignedTo: 'Sarah Johnson',
        createdDate: '2025-11-07',
        lastContact: '2025-11-07',
      },
      {
        id: 4,
        firstName: 'Jennifer',
        lastName: 'Wilson',
        email: 'jennifer.wilson@email.com',
        phone: '(555) 456-7890',
        source: 'Phone',
        status: 'Converted',
        interest: 'New Car',
        score: 98,
        notes: 'Purchased 2025 Honda CR-V',
        assignedTo: 'Mike Wilson',
        createdDate: '2025-10-28',
        lastContact: '2025-11-03',
      },
      {
        id: 5,
        firstName: 'Robert',
        lastName: 'Taylor',
        email: 'robert.taylor@email.com',
        phone: '(555) 567-8901',
        source: 'Social Media',
        status: 'Nurturing',
        interest: 'Trade-in',
        score: 70,
        notes: 'Wants to trade 2018 Toyota Camry',
        assignedTo: 'Sarah Johnson',
        createdDate: '2025-11-01',
        lastContact: '2025-11-05',
      },
    ];
    setLeads(mockLeads);
  }, []);

  const handleOpen = (leadMode: 'add' | 'edit' | 'view', lead?: Lead) => {
    setMode(leadMode);
    if (lead) {
      setSelectedLead(lead);
      if (leadMode === 'edit') {
        setFormData(lead);
      }
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        source: 'Website',
        status: 'New',
        interest: 'Vehicle Purchase',
        score: 50,
        notes: '',
        assignedTo: '',
        lastContact: new Date().toISOString().split('T')[0],
      });
    }
    if (leadMode === 'view') {
      setViewOpen(true);
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedLead(null);
  };

  const handleSubmit = () => {
    if (mode === 'add') {
      const newLead: Lead = {
        ...formData as Lead,
        id: leads.length + 1,
        createdDate: new Date().toISOString().split('T')[0],
      };
      setLeads([...leads, newLead]);
    } else if (mode === 'edit' && selectedLead) {
      setLeads(leads.map(lead =>
        lead.id === selectedLead.id ? { ...lead, ...formData } : lead
      ));
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setLeads(leads.filter(lead => lead.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'info';
      case 'Contacted': return 'primary';
      case 'Qualified': return 'warning';
      case 'Nurturing': return 'default';
      case 'Converted': return 'success';
      case 'Lost': return 'error';
      default: return 'default';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  // Statistics
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    qualified: leads.filter(l => l.status === 'Qualified').length,
    converted: leads.filter(l => l.status === 'Converted').length,
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      valueGetter: (params: any) => `${params.row.firstName} ${params.row.lastName}`,
    },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'source', headerName: 'Source', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value as string}
          color={getStatusColor(params.value as string) as any}
          size="small"
        />
      ),
    },
    { field: 'interest', headerName: 'Interest', width: 150 },
    {
      field: 'score',
      headerName: 'Score',
      width: 110,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          icon={<StarIcon />}
          label={params.value}
          color={getScoreColor(params.value as number) as any}
          size="small"
        />
      ),
    },
    { field: 'assignedTo', headerName: 'Assigned To', width: 150 },
    { field: 'lastContact', headerName: 'Last Contact', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="info"
              onClick={() => handleOpen('view', params.row as Lead)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpen('edit', params.row as Lead)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
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
          Leads Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen('add')}
        >
          Add New Lead
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Leads
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.total}
                  </Typography>
                </Box>
                <GroupIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
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
                    New Leads
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                    {stats.new}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, color: 'info.main', opacity: 0.3 }} />
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
                    Qualified
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {stats.qualified}
                  </Typography>
                </Box>
                <StarIcon sx={{ fontSize: 48, color: 'warning.main', opacity: 0.3 }} />
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
                    Converted
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {stats.converted}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Leads Data Grid */}
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={leads}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {mode === 'add' ? 'Add New Lead' : 'Edit Lead'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              >
                <MenuItem value="Website">Website</MenuItem>
                <MenuItem value="Phone">Phone</MenuItem>
                <MenuItem value="Walk-in">Walk-in</MenuItem>
                <MenuItem value="Referral">Referral</MenuItem>
                <MenuItem value="Social Media">Social Media</MenuItem>
                <MenuItem value="Email">Email</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="Qualified">Qualified</MenuItem>
                <MenuItem value="Nurturing">Nurturing</MenuItem>
                <MenuItem value="Converted">Converted</MenuItem>
                <MenuItem value="Lost">Lost</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Interest"
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
              >
                <MenuItem value="New Car">New Car</MenuItem>
                <MenuItem value="Used Car">Used Car</MenuItem>
                <MenuItem value="Trade-in">Trade-in</MenuItem>
                <MenuItem value="Financing">Financing</MenuItem>
                <MenuItem value="Service">Service</MenuItem>
                <MenuItem value="Parts">Parts</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lead Score (0-100)"
                type="number"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Assigned To"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Contact Date"
                type="date"
                value={formData.lastContact}
                onChange={(e) => setFormData({ ...formData, lastContact: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {mode === 'add' ? 'Add Lead' : 'Update Lead'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Lead Details</DialogTitle>
        <DialogContent>
          {selectedLead && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    {selectedLead.firstName} {selectedLead.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon color="action" />
                    <Typography>{selectedLead.email}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="action" />
                    <Typography>{selectedLead.phone}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="body2">Source</Typography>
                  <Typography>{selectedLead.source}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="body2">Status</Typography>
                  <Chip
                    label={selectedLead.status}
                    color={getStatusColor(selectedLead.status) as any}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="body2">Interest</Typography>
                  <Typography>{selectedLead.interest}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="body2">Lead Score</Typography>
                  <Chip
                    icon={<StarIcon />}
                    label={selectedLead.score}
                    color={getScoreColor(selectedLead.score) as any}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="body2">Assigned To</Typography>
                  <Typography>{selectedLead.assignedTo || 'Unassigned'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary" variant="body2">Last Contact</Typography>
                  <Typography>{selectedLead.lastContact}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary" variant="body2">Notes</Typography>
                  <Typography>{selectedLead.notes || 'No notes'}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            onClick={() => {
              handleClose();
              if (selectedLead) handleOpen('edit', selectedLead);
            }}
            variant="contained"
          >
            Edit Lead
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Leads;
