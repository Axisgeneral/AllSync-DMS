const express = require('express');
const router = express.Router();

// Mock user data (replace with database later)
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123', // In production, use hashed passwords
    name: 'Admin User',
    role: 'admin',
    email: 'admin@allsync.us'
  },
  {
    id: 2,
    username: 'sales',
    password: 'sales123',
    name: 'Sales Manager',
    role: 'sales',
    email: 'sales@allsync.us'
  }
];

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // In production, generate JWT token here
  const token = 'mock-jwt-token-' + user.id;

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email
    }
  });
});

// Get current user
router.get('/me', (req, res) => {
  // Mock authentication check
  const user = users[0];
  res.json({ user });
});

module.exports = router;
