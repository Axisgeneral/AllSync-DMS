import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  InputAdornment,
  Menu,
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SmsIcon from '@mui/icons-material/Sms';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ImportExportMenu from '../components/ImportExportMenu';

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
  communicationHistory?: CommunicationRecord[];
}

interface CommunicationRecord {
  id: number;
  type: 'email' | 'sms';
  subject?: string;
  message: string;
  sentBy: string;
  sentDate: string;
  status: 'sent' | 'failed' | 'pending';
}

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuLead, setMenuLead] = useState<Lead | null>(null);
  
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
  const [customerFormData, setCustomerFormData] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    type: 'Individual',
    status: 'Active',
  });
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
  });
  const [smsData, setSmsData] = useState({
    message: '',
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
        communicationHistory: [
          {
            id: 1,
            type: 'email',
            subject: 'Welcome to AllSync Auto',
            message: 'Thank you for your interest in our vehicles...',
            sentBy: 'Sarah Johnson',
            sentDate: '2025-11-05 10:30 AM',
            status: 'sent',
          },
          {
            id: 2,
            type: 'sms',
            message: 'Hi John, following up on your interest in SUVs. When would be a good time to discuss?',
            sentBy: 'Sarah Johnson',
            sentDate: '2025-11-06 2:15 PM',
            status: 'sent',
          },
        ],
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
        communicationHistory: [
          {
            id: 3,
            type: 'email',
            subject: 'Great sedans in stock',
            message: 'Hi Emily, we have several reliable sedans that match your criteria...',
            sentBy: 'Mike Wilson',
            sentDate: '2025-11-04 3:45 PM',
            status: 'sent',
          },
        ],
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
        communicationHistory: [],
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
        communicationHistory: [
          {
            id: 4,
            type: 'email',
            subject: 'Congratulations on your purchase!',
            message: 'Thank you for choosing AllSync Auto. We hope you enjoy your new CR-V!',
            sentBy: 'Mike Wilson',
            sentDate: '2025-11-03 4:00 PM',
            status: 'sent',
          },
          {
            id: 5,
            type: 'sms',
            message: 'Thanks for your purchase Jennifer! Let us know if you need anything.',
            sentBy: 'Mike Wilson',
            sentDate: '2025-11-03 4:05 PM',
            status: 'sent',
          },
        ],
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
        communicationHistory: [
          {
            id: 6,
            type: 'sms',
            message: 'Hi Robert, we can offer great trade-in value for your Camry. Want to schedule an appraisal?',
            sentBy: 'Sarah Johnson',
            sentDate: '2025-11-05 11:20 AM',
            status: 'sent',
          },
        ],
      },
    ];
    setLeads(mockLeads);
  }, []);

  // Normalize phone number for searching (remove all non-digit characters)
  const normalizePhone = (phone: string): string => {
    return phone.replace(/\D/g, '');
  };

  // Normalize text for searching (remove extra spaces, convert to lowercase)
  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  // Use useMemo to filter leads based on search query
  const filteredLeads = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      return leads;
    }

    const searchTerm = normalizeText(trimmedQuery);
    const normalizedPhoneQuery = normalizePhone(trimmedQuery);

    return leads.filter((lead) => {
      // Search by name (check first name, last name, and full name)
      const firstName = normalizeText(lead.firstName);
      const lastName = normalizeText(lead.lastName);
      const fullName = `${firstName} ${lastName}`;
      
      if (firstName.includes(searchTerm)) return true;
      if (lastName.includes(searchTerm)) return true;
      if (fullName.includes(searchTerm)) return true;

      // Search by email
      if (lead.email.toLowerCase().includes(searchTerm)) return true;

      // Search by phone (normalized - digits only)
      if (normalizedPhoneQuery) {
        const normalizedLeadPhone = normalizePhone(lead.phone);
        if (normalizedLeadPhone.includes(normalizedPhoneQuery)) return true;
      }

      // Search by source
      if (normalizeText(lead.source).includes(searchTerm)) return true;

      // Search by status
      if (normalizeText(lead.status).includes(searchTerm)) return true;

      // Search by interest
      if (normalizeText(lead.interest).includes(searchTerm)) return true;

      // Search by assigned to
      if (lead.assignedTo && normalizeText(lead.assignedTo).includes(searchTerm)) return true;

      // Search by notes
      if (lead.notes && normalizeText(lead.notes).includes(searchTerm)) return true;

      return false;
    });
  }, [leads, searchQuery]);

  const handleImportLeads = (importedData: any[]) => {
    const newLeads = importedData.map((item, index) => ({
      id: leads.length + index + 1,
      ...item,
      score: parseInt(item.score) || 50,
    }));
    setLeads([...leads, ...newLeads]);
  };

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
    setConvertOpen(false);
    setEmailOpen(false);
    setSmsOpen(false);
    setHistoryOpen(false);
    setSelectedLead(null);
    setEmailData({ subject: '', message: '' });
    setSmsData({ message: '' });
    setTabValue(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, lead: Lead) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuLead(lead);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuLead(null);
  };

  const handleMenuAction = (action: 'view' | 'edit' | 'delete' | 'convert' | 'email' | 'sms') => {
    if (menuLead) {
      if (action === 'view') {
        handleOpen('view', menuLead);
      } else if (action === 'edit') {
        handleOpen('edit', menuLead);
      } else if (action === 'delete') {
        handleDelete(menuLead.id);
      } else if (action === 'convert') {
        handleConvertOpen(menuLead);
      } else if (action === 'email') {
        handleOpenEmail(menuLead);
      } else if (action === 'sms') {
        handleOpenSms(menuLead);
      }
    }
    handleMenuClose();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSubmit = () => {
    if (mode === 'add') {
      const newLead: Lead = {
        ...formData as Lead,
        id: leads.length + 1,
        createdDate: new Date().toISOString().split('T')[0],
        communicationHistory: [],
      };
      const updatedLeads = [...leads, newLead];
      setLeads(updatedLeads);
    } else if (mode === 'edit' && selectedLead) {
      const updatedLeads = leads.map(lead =>
        lead.id === selectedLead.id ? { ...lead, ...formData } : lead
      );
      setLeads(updatedLeads);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      const updatedLeads = leads.filter(lead => lead.id !== id);
      setLeads(updatedLeads);
    }
  };

  const handleConvertToCustomer = (lead: Lead) => {
    setSelectedLead(lead);
    setCustomerFormData({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      address: '',
      city: '',
      state: '',
      zipCode: '',
      type: 'Individual',
      status: 'Active',
    });
    setConvertOpen(true);
  };

  const handleConfirmConvert = () => {
    // Here you would typically send the customer data to the API
    console.log('Converting lead to customer:', customerFormData);
    
    // Update lead status to "Converted"
    if (selectedLead) {
      const updatedLeads = leads.map(lead =>
        lead.id === selectedLead.id ? { ...lead, status: 'Converted' } : lead
      );
      setLeads(updatedLeads);
    }
    
    // Show success message
    alert(`Lead successfully converted to customer: ${customerFormData.firstName} ${customerFormData.lastName}`);
    
    handleClose();
  };

  const handleOpenEmail = (lead: Lead) => {
    setSelectedLead(lead);
    setEmailData({
      subject: '',
      message: '',
    });
    setEmailOpen(true);
  };

  const handleOpenSms = (lead: Lead) => {
    setSelectedLead(lead);
    setSmsData({
      message: '',
    });
    setSmsOpen(true);
  };

  const handleOpenHistory = (lead: Lead) => {
    setSelectedLead(lead);
    setHistoryOpen(true);
  };

  const handleSendEmail = () => {
    if (!selectedLead || !emailData.subject || !emailData.message) {
      alert('Please fill in all fields');
      return;
    }

    const newCommunication: CommunicationRecord = {
      id: Date.now(),
      type: 'email',
      subject: emailData.subject,
      message: emailData.message,
      sentBy: 'Current User', // In real app, get from auth context
      sentDate: new Date().toLocaleString(),
      status: 'sent',
    };

    // Update lead with new communication
    const updatedLeads = leads.map(lead => {
      if (lead.id === selectedLead.id) {
        return {
          ...lead,
          communicationHistory: [...(lead.communicationHistory || []), newCommunication],
          lastContact: new Date().toISOString().split('T')[0],
        };
      }
      return lead;
    });
    setLeads(updatedLeads);

    alert(`Email sent to ${selectedLead.firstName} ${selectedLead.lastName}`);
    handleClose();
  };

  const handleSendSms = () => {
    if (!selectedLead || !smsData.message) {
      alert('Please enter a message');
      return;
    }

    const newCommunication: CommunicationRecord = {
      id: Date.now(),
      type: 'sms',
      message: smsData.message,
      sentBy: 'Current User', // In real app, get from auth context
      sentDate: new Date().toLocaleString(),
      status: 'sent',
    };

    // Update lead with new communication
    const updatedLeads = leads.map(lead => {
      if (lead.id === selectedLead.id) {
        return {
          ...lead,
          communicationHistory: [...(lead.communicationHistory || []), newCommunication],
          lastContact: new Date().toISOString().split('T')[0],
        };
      }
      return lead;
    });
    setLeads(updatedLeads);

    alert(`SMS sent to ${selectedLead.firstName} ${selectedLead.lastName}`);
    handleClose();
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
    total: filteredLeads.length,
    new: filteredLeads.filter(l => l.status === 'New').length,
    qualified: filteredLeads.filter(l => l.status === 'Qualified').length,
    converted: filteredLeads.filter(l => l.status === 'Converted').length,
  };

  const columns: GridColDef[] = [
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
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Actions">
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, params.row as Lead)}
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
          Leads Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <ImportExportMenu
            data={filteredLeads}
            filename="leads"
            onImport={handleImportLeads}
            headers={['firstName', 'lastName', 'email', 'phone', 'source', 'status', 'interest', 'score', 'assignedTo', 'lastContact', 'notes']}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen('add')}
          >
            Add New Lead
          </Button>
        </Box>
      </Box>

      {/* Search Box */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search leads by name, email, phone, status, source, interest, or notes..."
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
                <IconButton size="small" onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {searchQuery && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Found {filteredLeads.length} of {leads.length} leads
          </Typography>
        )}
      </Paper>

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
          rows={filteredLeads}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          onRowClick={(params) => handleOpen('view', params.row as Lead)}
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
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Lead Details</DialogTitle>
        <DialogContent>
          {selectedLead && (
            <Box sx={{ mt: 1 }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
                <Tab label="Information" />
                <Tab label={`Communication History (${selectedLead.communicationHistory?.length || 0})`} />
              </Tabs>

              {/* Information Tab */}
              {tabValue === 0 && (
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
              )}

              {/* Communication History Tab */}
              {tabValue === 1 && (
                <Box>
                  {selectedLead.communicationHistory && selectedLead.communicationHistory.length > 0 ? (
                    <List>
                      {selectedLead.communicationHistory.map((comm, index) => (
                        <React.Fragment key={comm.id}>
                          {index > 0 && <Divider />}
                          <ListItem alignItems="flex-start">
                            <ListItemIcon>
                              {comm.type === 'email' ? (
                                <EmailIcon color="primary" />
                              ) : (
                                <SmsIcon color="secondary" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {comm.type === 'email' ? `Email: ${comm.subject}` : 'SMS Message'}
                                  </Typography>
                                  <Chip
                                    label={comm.status}
                                    size="small"
                                    color={comm.status === 'sent' ? 'success' : comm.status === 'failed' ? 'error' : 'default'}
                                  />
                                </Box>
                              }
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                                    {comm.message}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Sent by {comm.sentBy} on {comm.sentDate}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <HistoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No communication history
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            onClick={() => {
              handleClose();
              if (selectedLead) handleOpenEmail(selectedLead);
            }}
            startIcon={<EmailIcon />}
          >
            Send Email
          </Button>
          <Button
            onClick={() => {
              handleClose();
              if (selectedLead) handleOpenSms(selectedLead);
            }}
            startIcon={<SmsIcon />}
          >
            Send SMS
          </Button>
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

      {/* Convert to Customer Dialog */}
      <Dialog open={convertOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Convert Lead to Customer</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Converting: <strong>{selectedLead?.firstName} {selectedLead?.lastName}</strong>
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={customerFormData.firstName}
                onChange={(e) => setCustomerFormData({ ...customerFormData, firstName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={customerFormData.lastName}
                onChange={(e) => setCustomerFormData({ ...customerFormData, lastName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={customerFormData.email}
                onChange={(e) => setCustomerFormData({ ...customerFormData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={customerFormData.phone}
                onChange={(e) => setCustomerFormData({ ...customerFormData, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={customerFormData.address}
                onChange={(e) => setCustomerFormData({ ...customerFormData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={customerFormData.city}
                onChange={(e) => setCustomerFormData({ ...customerFormData, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="State"
                value={customerFormData.state}
                onChange={(e) => setCustomerFormData({ ...customerFormData, state: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={customerFormData.zipCode}
                onChange={(e) => setCustomerFormData({ ...customerFormData, zipCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Type"
                value={customerFormData.type}
                onChange={(e) => setCustomerFormData({ ...customerFormData, type: e.target.value })}
              >
                <MenuItem value="Individual">Individual</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={customerFormData.status}
                onChange={(e) => setCustomerFormData({ ...customerFormData, status: e.target.value })}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmConvert} variant="contained" color="success" startIcon={<PersonAddIcon />}>
            Convert to Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={emailOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon />
            Send Email to {selectedLead?.firstName} {selectedLead?.lastName}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="To"
                value={selectedLead?.email || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={8}
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSendEmail} variant="contained" startIcon={<SendIcon />}>
            Send Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send SMS Dialog */}
      <Dialog open={smsOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmsIcon />
            Send SMS to {selectedLead?.firstName} {selectedLead?.lastName}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="To"
                value={selectedLead?.phone || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={6}
                value={smsData.message}
                onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                required
                inputProps={{ maxLength: 160 }}
                helperText={`${smsData.message.length}/160 characters`}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSendSms} variant="contained" startIcon={<SendIcon />}>
            Send SMS
          </Button>
        </DialogActions>
      </Dialog>

      {/* Communication History Dialog */}
      <Dialog open={historyOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon />
            Communication History - {selectedLead?.firstName} {selectedLead?.lastName}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedLead?.communicationHistory && selectedLead.communicationHistory.length > 0 ? (
            <List>
              {selectedLead.communicationHistory.map((comm, index) => (
                <React.Fragment key={comm.id}>
                  {index > 0 && <Divider />}
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      {comm.type === 'email' ? (
                        <EmailIcon color="primary" />
                      ) : (
                        <SmsIcon color="secondary" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {comm.type === 'email' ? `Email: ${comm.subject}` : 'SMS Message'}
                          </Typography>
                          <Chip
                            label={comm.status}
                            size="small"
                            color={comm.status === 'sent' ? 'success' : comm.status === 'failed' ? 'error' : 'default'}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                            {comm.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Sent by {comm.sentBy} on {comm.sentDate}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <HistoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No communication history
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Send an email or SMS to start tracking communications
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={() => {
            handleClose();
            if (selectedLead) handleOpenEmail(selectedLead);
          }} startIcon={<EmailIcon />}>
            Send Email
          </Button>
          <Button onClick={() => {
            handleClose();
            if (selectedLead) handleOpenSms(selectedLead);
          }} startIcon={<SmsIcon />}>
            Send SMS
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
        <MenuItem onClick={() => handleMenuAction('convert')} disabled={menuLead?.status === 'Converted'}>
          <ListItemIcon>
            <PersonAddIcon fontSize="small" color="success" />
          </ListItemIcon>
          Convert to Customer
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('email')}>
          <ListItemIcon>
            <EmailIcon fontSize="small" color="primary" />
          </ListItemIcon>
          Send Email
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('sms')}>
          <ListItemIcon>
            <SmsIcon fontSize="small" color="secondary" />
          </ListItemIcon>
          Send SMS
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          Edit Lead
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete Lead
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Leads;
