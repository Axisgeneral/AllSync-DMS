import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  DirectionsCar,
  AttachMoney,
  People,
  Build,
  TrendingUp,
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';

interface DashboardStats {
  inventory: any;
  sales: any;
  customers: any;
  service: any;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        axios.get('/api/dashboard/stats'),
        axios.get('/api/dashboard/activity'),
      ]);
      setStats(statsRes.data);
      setActivity(activityRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color }: any) => (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: `${color}.light`,
              p: 1.5,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (!stats) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stat Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Inventory"
            value={stats.inventory.total}
            subtitle={`${stats.inventory.available} Available`}
            icon={<DirectionsCar sx={{ color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Sales"
            value={stats.sales.thisMonth}
            subtitle={`$${stats.sales.revenue.toLocaleString()}`}
            icon={<AttachMoney sx={{ color: 'success.main' }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={stats.customers.total}
            subtitle={`${stats.customers.new} New This Month`}
            icon={<People sx={{ color: 'info.main' }} />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Service Today"
            value={stats.service.appointmentsToday}
            subtitle={`${stats.service.completedToday} Completed`}
            icon={<Build sx={{ color: 'warning.main' }} />}
            color="warning"
          />
        </Grid>

        {/* Sales Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sales Performance
            </Typography>
            <BarChart
              series={[
                { data: [12, 19, 15, 25, 22, 24], label: 'Units Sold' },
                { data: [480, 760, 600, 1000, 880, 985], label: 'Revenue ($k)' },
              ]}
              height={300}
              xAxis={[{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], scaleType: 'band' }]}
              margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {activity.slice(0, 5).map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemText
                    primary={item.message}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                        <Chip
                          label={item.type}
                          size="small"
                          color={
                            item.type === 'sale' ? 'success' :
                            item.type === 'vehicle' ? 'primary' :
                            item.type === 'customer' ? 'info' : 'default'
                          }
                        />
                        <Typography variant="caption">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h5" color="primary.main" fontWeight="bold">
                    ${stats.inventory.totalValue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Inventory Value
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h5" color="success.main" fontWeight="bold">
                    ${stats.sales.avgDealSize.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avg Deal Size
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h5" color="info.main" fontWeight="bold">
                    {stats.customers.leads}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Active Leads
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h5" color="warning.main" fontWeight="bold">
                    {stats.service.pendingWork}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Pending Service Orders
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
