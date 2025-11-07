const express = require('express');
const router = express.Router();

// Mock sales data
let sales = [
  {
    id: 1,
    dealNumber: 'D2024-001',
    customerId: 1,
    customerName: 'John Smith',
    vehicleId: 1,
    vehicleInfo: '2024 Toyota Camry',
    salePrice: 32500,
    downPayment: 5000,
    tradeInValue: 8000,
    financedAmount: 19500,
    financeType: 'Loan',
    lender: 'ABC Credit Union',
    interestRate: 4.5,
    term: 60,
    monthlyPayment: 363,
    salesPerson: 'Mike Anderson',
    status: 'Completed',
    saleDate: '2024-03-15',
    deliveryDate: '2024-03-18',
    commission: 1500,
    notes: ''
  },
  {
    id: 2,
    dealNumber: 'D2024-002',
    customerId: 2,
    customerName: 'Sarah Johnson',
    vehicleId: 2,
    vehicleInfo: '2023 Tesla Model 3',
    salePrice: 45999,
    downPayment: 10000,
    tradeInValue: 0,
    financedAmount: 35999,
    financeType: 'Loan',
    lender: 'Tesla Financing',
    interestRate: 3.9,
    term: 72,
    monthlyPayment: 556,
    salesPerson: 'Lisa Chen',
    status: 'Pending',
    saleDate: '2024-03-20',
    deliveryDate: null,
    commission: 2000,
    notes: 'Awaiting final paperwork'
  }
];

// Get all sales
router.get('/', (req, res) => {
  const { status, salesPerson } = req.query;
  let filtered = [...sales];

  if (status) filtered = filtered.filter(s => s.status === status);
  if (salesPerson) filtered = filtered.filter(s => s.salesPerson === salesPerson);

  res.json(filtered);
});

// Get single sale
router.get('/:id', (req, res) => {
  const sale = sales.find(s => s.id === parseInt(req.params.id));
  if (!sale) {
    return res.status(404).json({ message: 'Sale not found' });
  }
  res.json(sale);
});

// Create sale
router.post('/', (req, res) => {
  const newSale = {
    id: sales.length + 1,
    dealNumber: `D2024-${String(sales.length + 1).padStart(3, '0')}`,
    ...req.body,
    saleDate: new Date().toISOString().split('T')[0]
  };
  sales.push(newSale);
  res.status(201).json(newSale);
});

// Update sale
router.put('/:id', (req, res) => {
  const index = sales.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Sale not found' });
  }
  sales[index] = { ...sales[index], ...req.body };
  res.json(sales[index]);
});

// Delete sale
router.delete('/:id', (req, res) => {
  const index = sales.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Sale not found' });
  }
  sales.splice(index, 1);
  res.json({ message: 'Sale deleted successfully' });
});

module.exports = router;
