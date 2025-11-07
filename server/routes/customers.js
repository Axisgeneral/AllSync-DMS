const express = require('express');
const router = express.Router();

// Mock customer data
let customers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    address: '123 Main St',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    dateOfBirth: '1985-05-15',
    driversLicense: 'D1234567',
    type: 'Individual',
    status: 'Active',
    creditScore: 720,
    notes: 'Preferred customer',
    dateAdded: '2024-01-10',
    lastContact: '2024-03-15'
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave',
    city: 'San Diego',
    state: 'CA',
    zipCode: '92101',
    dateOfBirth: '1990-08-22',
    driversLicense: 'D9876543',
    type: 'Individual',
    status: 'Active',
    creditScore: 680,
    notes: '',
    dateAdded: '2024-02-05',
    lastContact: '2024-03-20'
  }
];

// Get all customers
router.get('/', (req, res) => {
  const { status, type } = req.query;
  let filtered = [...customers];

  if (status) filtered = filtered.filter(c => c.status === status);
  if (type) filtered = filtered.filter(c => c.type === type);

  res.json(filtered);
});

// Get single customer
router.get('/:id', (req, res) => {
  const customer = customers.find(c => c.id === parseInt(req.params.id));
  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' });
  }
  res.json(customer);
});

// Create customer
router.post('/', (req, res) => {
  const newCustomer = {
    id: customers.length + 1,
    ...req.body,
    dateAdded: new Date().toISOString().split('T')[0]
  };
  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

// Update customer
router.put('/:id', (req, res) => {
  const index = customers.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Customer not found' });
  }
  customers[index] = { ...customers[index], ...req.body };
  res.json(customers[index]);
});

// Delete customer
router.delete('/:id', (req, res) => {
  const index = customers.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Customer not found' });
  }
  customers.splice(index, 1);
  res.json({ message: 'Customer deleted successfully' });
});

module.exports = router;
