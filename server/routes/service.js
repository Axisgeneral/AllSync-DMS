const express = require('express');
const router = express.Router();

// Mock service appointments
let appointments = [
  {
    id: 1,
    appointmentNumber: 'SVC-001',
    customerId: 1,
    customerName: 'John Smith',
    vehicleInfo: '2022 Honda Accord',
    vin: '1HGCV1F30JA123456',
    serviceType: 'Maintenance',
    description: 'Oil change and tire rotation',
    appointmentDate: '2024-03-25',
    appointmentTime: '10:00 AM',
    status: 'Scheduled',
    advisor: 'Tom Wilson',
    technician: 'Dave Martinez',
    estimatedCost: 89.99,
    actualCost: null,
    notes: 'Customer requested synthetic oil'
  },
  {
    id: 2,
    appointmentNumber: 'SVC-002',
    customerId: 2,
    customerName: 'Sarah Johnson',
    vehicleInfo: '2023 Tesla Model 3',
    vin: '5YJSA1E26FF123457',
    serviceType: 'Repair',
    description: 'Brake inspection and replacement',
    appointmentDate: '2024-03-22',
    appointmentTime: '2:00 PM',
    status: 'In Progress',
    advisor: 'Tom Wilson',
    technician: 'Mike Rodriguez',
    estimatedCost: 450.00,
    actualCost: null,
    notes: 'Rear brakes only'
  }
];

// Get all appointments
router.get('/appointments', (req, res) => {
  const { status, date } = req.query;
  let filtered = [...appointments];

  if (status) filtered = filtered.filter(a => a.status === status);
  if (date) filtered = filtered.filter(a => a.appointmentDate === date);

  res.json(filtered);
});

// Get single appointment
router.get('/appointments/:id', (req, res) => {
  const appointment = appointments.find(a => a.id === parseInt(req.params.id));
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  res.json(appointment);
});

// Create appointment
router.post('/appointments', (req, res) => {
  const newAppointment = {
    id: appointments.length + 1,
    appointmentNumber: `SVC-${String(appointments.length + 1).padStart(3, '0')}`,
    ...req.body
  };
  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

// Update appointment
router.put('/appointments/:id', (req, res) => {
  const index = appointments.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  appointments[index] = { ...appointments[index], ...req.body };
  res.json(appointments[index]);
});

// Delete appointment
router.delete('/appointments/:id', (req, res) => {
  const index = appointments.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  appointments.splice(index, 1);
  res.json({ message: 'Appointment deleted successfully' });
});

module.exports = router;
