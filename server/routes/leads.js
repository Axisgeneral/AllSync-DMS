const express = require('express');
const router = express.Router();

// Mock data storage (in production, this would be a database)
let leads = [
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

// Get all leads
router.get('/', (req, res) => {
  res.json(leads);
});

// Get lead by ID
router.get('/:id', (req, res) => {
  const lead = leads.find(l => l.id === parseInt(req.params.id));
  if (!lead) {
    return res.status(404).json({ message: 'Lead not found' });
  }
  res.json(lead);
});

// Get leads statistics
router.get('/stats/summary', (req, res) => {
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    qualified: leads.filter(l => l.status === 'Qualified').length,
    nurturing: leads.filter(l => l.status === 'Nurturing').length,
    converted: leads.filter(l => l.status === 'Converted').length,
    lost: leads.filter(l => l.status === 'Lost').length,
    averageScore: leads.reduce((sum, l) => sum + l.score, 0) / leads.length,
    bySource: {
      website: leads.filter(l => l.source === 'Website').length,
      phone: leads.filter(l => l.source === 'Phone').length,
      walkIn: leads.filter(l => l.source === 'Walk-in').length,
      referral: leads.filter(l => l.source === 'Referral').length,
      socialMedia: leads.filter(l => l.source === 'Social Media').length,
      email: leads.filter(l => l.source === 'Email').length,
      other: leads.filter(l => l.source === 'Other').length,
    },
  };
  res.json(stats);
});

// Create new lead
router.post('/', (req, res) => {
  const newLead = {
    id: leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1,
    ...req.body,
    createdDate: new Date().toISOString().split('T')[0],
  };
  leads.push(newLead);
  res.status(201).json(newLead);
});

// Update lead
router.put('/:id', (req, res) => {
  const index = leads.findIndex(l => l.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Lead not found' });
  }
  leads[index] = { ...leads[index], ...req.body };
  res.json(leads[index]);
});

// Update lead status
router.patch('/:id/status', (req, res) => {
  const index = leads.findIndex(l => l.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Lead not found' });
  }
  leads[index].status = req.body.status;
  leads[index].lastContact = new Date().toISOString().split('T')[0];
  res.json(leads[index]);
});

// Update lead score
router.patch('/:id/score', (req, res) => {
  const index = leads.findIndex(l => l.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Lead not found' });
  }
  leads[index].score = req.body.score;
  res.json(leads[index]);
});

// Assign lead to sales person
router.patch('/:id/assign', (req, res) => {
  const index = leads.findIndex(l => l.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Lead not found' });
  }
  leads[index].assignedTo = req.body.assignedTo;
  res.json(leads[index]);
});

// Delete lead
router.delete('/:id', (req, res) => {
  const index = leads.findIndex(l => l.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Lead not found' });
  }
  const deletedLead = leads.splice(index, 1);
  res.json(deletedLead[0]);
});

// Search/filter leads
router.post('/search', (req, res) => {
  let filteredLeads = [...leads];
  const { status, source, assignedTo, minScore, maxScore } = req.body;

  if (status) {
    filteredLeads = filteredLeads.filter(l => l.status === status);
  }
  if (source) {
    filteredLeads = filteredLeads.filter(l => l.source === source);
  }
  if (assignedTo) {
    filteredLeads = filteredLeads.filter(l => l.assignedTo === assignedTo);
  }
  if (minScore !== undefined) {
    filteredLeads = filteredLeads.filter(l => l.score >= minScore);
  }
  if (maxScore !== undefined) {
    filteredLeads = filteredLeads.filter(l => l.score <= maxScore);
  }

  res.json(filteredLeads);
});

module.exports = router;
