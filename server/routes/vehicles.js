const express = require('express');
const router = express.Router();

// Mock vehicle data
let vehicles = [
  {
    id: 1,
    stockNumber: 'V2024-001',
    vin: '1HGCM82633A123456',
    year: 2024,
    make: 'Toyota',
    model: 'Camry',
    trim: 'XLE',
    type: 'Sedan',
    condition: 'New',
    mileage: 15,
    exteriorColor: 'Silver',
    interiorColor: 'Black',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    price: 32500,
    cost: 28000,
    status: 'Available',
    location: 'Main Lot',
    images: [],
    features: ['Sunroof', 'Leather Seats', 'Navigation'],
    dateAdded: '2024-01-15'
  },
  {
    id: 2,
    stockNumber: 'V2024-002',
    vin: '5YJSA1E26FF123457',
    year: 2023,
    make: 'Tesla',
    model: 'Model 3',
    trim: 'Long Range',
    type: 'Sedan',
    condition: 'Used',
    mileage: 12500,
    exteriorColor: 'Pearl White',
    interiorColor: 'White',
    transmission: 'Automatic',
    fuelType: 'Electric',
    price: 45999,
    cost: 42000,
    status: 'Available',
    location: 'Main Lot',
    images: [],
    features: ['Autopilot', 'Premium Audio', 'Glass Roof'],
    dateAdded: '2024-02-01'
  },
  {
    id: 3,
    stockNumber: 'V2024-003',
    vin: '1C4RJFBG5FC123458',
    year: 2024,
    make: 'Jeep',
    model: 'Wrangler',
    trim: 'Sahara',
    type: 'SUV',
    condition: 'New',
    mileage: 8,
    exteriorColor: 'Black',
    interiorColor: 'Black',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    price: 48500,
    cost: 43000,
    status: 'Available',
    location: 'Showroom',
    images: [],
    features: ['4WD', 'Removable Top', 'LED Lights'],
    dateAdded: '2024-01-20'
  }
];

// Get all vehicles
router.get('/', (req, res) => {
  const { status, type, condition } = req.query;
  let filtered = [...vehicles];

  if (status) filtered = filtered.filter(v => v.status === status);
  if (type) filtered = filtered.filter(v => v.type === type);
  if (condition) filtered = filtered.filter(v => v.condition === condition);

  res.json(filtered);
});

// Get single vehicle
router.get('/:id', (req, res) => {
  const vehicle = vehicles.find(v => v.id === parseInt(req.params.id));
  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  res.json(vehicle);
});

// Create vehicle
router.post('/', (req, res) => {
  const newVehicle = {
    id: vehicles.length + 1,
    ...req.body,
    dateAdded: new Date().toISOString().split('T')[0]
  };
  vehicles.push(newVehicle);
  res.status(201).json(newVehicle);
});

// Update vehicle
router.put('/:id', (req, res) => {
  const index = vehicles.findIndex(v => v.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  vehicles[index] = { ...vehicles[index], ...req.body };
  res.json(vehicles[index]);
});

// Delete vehicle
router.delete('/:id', (req, res) => {
  const index = vehicles.findIndex(v => v.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  vehicles.splice(index, 1);
  res.json({ message: 'Vehicle deleted successfully' });
});

module.exports = router;
