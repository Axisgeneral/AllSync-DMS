import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  DirectionsCar as VehiclesIcon,
  People as PeopleIcon,
  AttachMoney as SalesIcon,
  Build as ServiceIcon,
  Assessment as ReportsIcon,
  AccountCircle,
  Logout,
  TrendingUp,
  Inventory,
  AccountBalance,
  Engineering,
  Work,
  ExpandLess,
  ExpandMore,
  Contactless,
  Handshake,
  CompareArrows,
  CreditCard,
  BusinessCenter,
  LocalAtm,
  Receipt,
  BarChart,
  AccessTime,
  Payment,
  CalendarMonth,
  Badge,
  ManageAccounts,
} from '@mui/icons-material';

const drawerWidth = 260;

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { text: string; path: string }[];
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    'Road to Sale': false,
    'Inventory Management': false,
    'F&I': false,
    'Service Department': false,
    'Accounting': false,
    'Human Resources': false,
  });

  // Color scheme for each category
  const getCategoryColor = (text: string) => {
    const colors: { [key: string]: { main: string; light: string; dark: string } } = {
      'Dashboard': { main: '#1976d2', light: '#e3f2fd', dark: '#0d47a1' },
      'Road to Sale': { main: '#2e7d32', light: '#e8f5e9', dark: '#1b5e20' },
      'Inventory Management': { main: '#ed6c02', light: '#fff3e0', dark: '#e65100' },
      'F&I': { main: '#9c27b0', light: '#f3e5f5', dark: '#6a1b9a' },
      'Service Department': { main: '#d32f2f', light: '#ffebee', dark: '#c62828' },
      'Accounting': { main: '#0288d1', light: '#e1f5fe', dark: '#01579b' },
      'Human Resources': { main: '#f57c00', light: '#fff3e0', dark: '#e65100' },
    };
    return colors[text] || { main: '#757575', light: '#f5f5f5', dark: '#424242' };
  };

  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    {
      text: 'Road to Sale',
      icon: <TrendingUp />,
      subItems: [
        { text: 'Leads', path: '/leads' },
        { text: 'Customers', path: '/customers' },
        { text: 'Deals', path: '/deals' },
        { text: 'Trades', path: '/trades' },
      ],
    },
    {
      text: 'Inventory Management',
      icon: <Inventory />,
      subItems: [
        { text: 'Vehicles', path: '/vehicles' },
      ],
    },
    {
      text: 'F&I',
      icon: <AccountBalance />,
      subItems: [
        { text: 'Credit Applications', path: '/credit-applications' },
        { text: 'Lender Management', path: '/lender-management' },
        { text: 'Deal Management', path: '/deal-management' },
      ],
    },
    {
      text: 'Service Department',
      icon: <Engineering />,
      subItems: [
        { text: 'Service Orders', path: '/service-orders' },
        { text: 'Parts Management', path: '/parts-management' },
      ],
    },
    {
      text: 'Accounting',
      icon: <Receipt />,
      subItems: [
        { text: 'GL Mapping', path: '/gl-mapping' },
        { text: 'Reconciliation', path: '/reconciliation' },
        { text: 'Profit and Loss', path: '/profit-loss' },
      ],
    },
    {
      text: 'Human Resources',
      icon: <Work />,
      subItems: [
        { text: 'Time Clock', path: '/time-clock' },
        { text: 'Payroll', path: '/payroll' },
        { text: 'Scheduling', path: '/scheduling' },
        { text: 'Employee Data', path: '/employee-data' },
        { text: 'User Management', path: '/user-management' },
      ],
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleMenuToggle = (menuText: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuText]: !prev[menuText],
    }));
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" noWrap component="div">
          AllSync DMS
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ py: 0 }}>
        {menuItems.map((item) => {
          const categoryColors = getCategoryColor(item.text);
          return (
            <React.Fragment key={item.text}>
              {item.subItems ? (
                <>
                  <ListItem 
                    disablePadding
                    sx={{
                      borderLeft: `4px solid ${categoryColors.main}`,
                      bgcolor: openMenus[item.text] ? categoryColors.light : 'transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: categoryColors.light,
                      },
                    }}
                  >
                    <ListItemButton onClick={() => handleMenuToggle(item.text)}>
                      <ListItemIcon 
                        sx={{ 
                          minWidth: 40,
                          color: categoryColors.main,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text} 
                        primaryTypographyProps={{ 
                          fontSize: '0.875rem', 
                          fontWeight: 600,
                          color: categoryColors.dark,
                        }}
                      />
                      {openMenus[item.text] ? 
                        <ExpandLess sx={{ color: categoryColors.main }} /> : 
                        <ExpandMore sx={{ color: categoryColors.main }} />
                      }
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={openMenus[item.text]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ bgcolor: categoryColors.light }}>
                      {item.subItems.map((subItem) => (
                        <ListItemButton
                          key={subItem.text}
                          sx={{ 
                            pl: 7,
                            borderLeft: `4px solid ${categoryColors.main}`,
                            '&:hover': {
                              bgcolor: 'white',
                              borderLeft: `4px solid ${categoryColors.dark}`,
                            },
                          }}
                          onClick={() => handleMenuClick(subItem.path)}
                        >
                          <ListItemText 
                            primary={subItem.text}
                            primaryTypographyProps={{ 
                              fontSize: '0.813rem',
                              color: categoryColors.dark,
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem 
                  disablePadding
                  sx={{
                    borderLeft: `4px solid ${categoryColors.main}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: categoryColors.light,
                    },
                  }}
                >
                  <ListItemButton onClick={() => handleMenuClick(item.path!)}>
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 40,
                        color: categoryColors.main,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{ 
                        fontSize: '0.875rem', 
                        fontWeight: 600,
                        color: categoryColors.dark,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dealership Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">{user?.name}</Typography>
            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.name?.charAt(0)}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem disabled>
          <AccountCircle sx={{ mr: 1 }} />
          {user?.email}
        </MenuItem>
        <Divider />
        <MenuItem onClick={onLogout}>
          <Logout sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'grey.100',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
