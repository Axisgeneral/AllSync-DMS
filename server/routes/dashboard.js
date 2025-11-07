const express = require('express');
const router = express.Router();

// Get dashboard statistics
router.get('/stats', (req, res) => {
  const stats = {
    inventory: {
      total: 45,
      available: 32,
      sold: 8,
      pending: 5,
      totalValue: 1850000
    },
    sales: {
      today: 2,
      thisWeek: 8,
      thisMonth: 24,
      revenue: 985000,
      avgDealSize: 41042
    },
    customers: {
      total: 156,
      active: 142,
      new: 12,
      leads: 23
    },
    service: {
      appointmentsToday: 6,
      appointmentsWeek: 28,
      pendingWork: 14,
      completedToday: 4
    }
  };

  res.json(stats);
});

// Get recent activity
router.get('/activity', (req, res) => {
  const activity = [
    {
      id: 1,
      type: 'sale',
      message: 'New sale: 2024 Toyota Camry to John Smith',
      timestamp: new Date().toISOString(),
      user: 'Mike Anderson'
    },
    {
      id: 2,
      type: 'vehicle',
      message: 'New vehicle added: 2024 Jeep Wrangler',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      user: 'Admin'
    },
    {
      id: 3,
      type: 'customer',
      message: 'New customer registered: Sarah Johnson',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      user: 'Lisa Chen'
    },
    {
      id: 4,
      type: 'service',
      message: 'Service appointment scheduled for 2023 Tesla Model 3',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      user: 'Tom Wilson'
    }
  ];

  res.json(activity);
});

// Get sales chart data
router.get('/sales-chart', (req, res) => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 15, 25, 22, 24]
      },
      {
        label: 'Revenue (x$10k)',
        data: [48, 76, 60, 100, 88, 98]
      }
    ]
  };

  res.json(chartData);
});

module.exports = router;
