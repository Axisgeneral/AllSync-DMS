import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';

const Reports: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Reports & Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Sales Report */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Sales Report
            </Typography>
            <BarChart
              series={[
                { data: [12, 19, 15, 25, 22, 24], label: 'Units Sold' },
              ]}
              height={290}
              xAxis={[{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], scaleType: 'band' }]}
              margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
          </Paper>
        </Grid>

        {/* Inventory by Type */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Inventory by Type
            </Typography>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 18, label: 'Sedan' },
                    { id: 1, value: 12, label: 'SUV' },
                    { id: 2, value: 8, label: 'Truck' },
                    { id: 3, value: 5, label: 'Coupe' },
                    { id: 4, value: 2, label: 'Van' },
                  ],
                },
              ]}
              height={290}
            />
          </Paper>
        </Grid>

        {/* Top Performers */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Sales People (This Month)
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Mike Anderson"
                    secondary="15 units • $615,000"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Lisa Chen"
                    secondary="12 units • $542,000"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Tom Wilson"
                    secondary="10 units • $428,000"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Popular Models */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Most Popular Models
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Toyota Camry"
                    secondary="8 units sold"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Honda Accord"
                    secondary="6 units sold"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Tesla Model 3"
                    secondary="5 units sold"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Revenue */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Department
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Total Appointments"
                    secondary="128 this month"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Service Revenue"
                    secondary="$45,600"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Customer Satisfaction"
                    secondary="4.8 / 5.0"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Breakdown */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Breakdown (Last 6 Months)
            </Typography>
            <BarChart
              series={[
                { data: [480, 760, 600, 1000, 880, 985], label: 'New Vehicle Sales ($k)' },
                { data: [320, 410, 380, 520, 460, 485], label: 'Used Vehicle Sales ($k)' },
                { data: [42, 48, 45, 52, 48, 46], label: 'Service Revenue ($k)' },
              ]}
              height={300}
              xAxis={[{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], scaleType: 'band' }]}
              margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
