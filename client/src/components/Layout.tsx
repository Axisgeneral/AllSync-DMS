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
  ChevronLeft,
  ChevronRight,
  UnfoldMore,
  UnfoldLess,
} from '@mui/icons-material';

const drawerWidth = 260;
const drawerWidthCollapsed = 65;

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    'Road to Sale': false,
    'Inventory Management': false,
    'F&I': false,
    'Service Department': false,
    'Accounting': false,
    'Human Resources': false,
  });

  // Color scheme for each category - Alternating Blue and Green
  const getCategoryColor = (text: string) => {
    const colors: { [key: string]: { main: string; light: string; dark: string } } = {
      'Dashboard': { main: '#2563eb', light: '#eff6ff', dark: '#1e40af' }, // Blue
      'Road to Sale': { main: '#059669', light: '#ecfdf5', dark: '#047857' }, // Green
      'Inventory Management': { main: '#2563eb', light: '#eff6ff', dark: '#1e40af' }, // Blue
      'F&I': { main: '#059669', light: '#ecfdf5', dark: '#047857' }, // Green
      'Service Department': { main: '#2563eb', light: '#eff6ff', dark: '#1e40af' }, // Blue
      'Accounting': { main: '#059669', light: '#ecfdf5', dark: '#047857' }, // Green
      'Human Resources': { main: '#2563eb', light: '#eff6ff', dark: '#1e40af' }, // Blue
    };
    return colors[text] || { main: '#64748b', light: '#f8fafc', dark: '#475569' };
  };

  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    {
      text: 'Road to Sale',
      icon: <TrendingUp />,
      subItems: [
        { text: 'Leads', path: '/leads' },
        { text: 'Customers', path: '/customers' },
        { text: 'Credit Applications', path: '/credit-applications' },
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
        { text: 'Pending Credit Applications', path: '/pending-credit-applications' },
        { text: 'Lender Management', path: '/lender-management' },
        { text: 'Deal Management', path: '/deal-management' },
      ],
    },
    {
      text: 'Service Department',
      icon: <Engineering />,
      subItems: [
        { text: 'Service Appointments', path: '/service' },
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

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Close all submenus when collapsing
    if (!sidebarCollapsed) {
      setOpenMenus({
        'Road to Sale': false,
        'Inventory Management': false,
        'F&I': false,
        'Service Department': false,
        'Accounting': false,
        'Human Resources': false,
      });
    }
  };

  const handleExpandAll = () => {
    setOpenMenus({
      'Road to Sale': true,
      'Inventory Management': true,
      'F&I': true,
      'Service Department': true,
      'Accounting': true,
      'Human Resources': true,
    });
  };

  const handleCollapseAll = () => {
    setOpenMenus({
      'Road to Sale': false,
      'Inventory Management': false,
      'F&I': false,
      'Service Department': false,
      'Accounting': false,
      'Human Resources': false,
    });
  };

  const areAllExpanded = Object.values(openMenus).every(value => value === true);
  const areAllCollapsed = Object.values(openMenus).every(value => value === false);

  const drawer = (
    <Box>
      <Toolbar sx={{ bgcolor: 'primary.main', color: 'white', justifyContent: sidebarCollapsed ? 'center' : 'space-between' }}>
        {!sidebarCollapsed && (
          <Typography variant="h6" noWrap component="div">
            AllSync DMS
          </Typography>
        )}
        <IconButton 
          onClick={handleSidebarToggle}
          sx={{ 
            color: 'white',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Toolbar>
      <Divider />
      {!sidebarCollapsed && (
        <Box sx={{ 
          px: 2, 
          py: 1, 
          display: 'flex', 
          justifyContent: 'center',
          bgcolor: '#e5e7eb',
          borderBottom: '1px solid #d1d5db',
        }}>
          <IconButton
            size="small"
            onClick={areAllExpanded ? handleCollapseAll : handleExpandAll}
            sx={{ 
              fontSize: '0.75rem',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.light',
              },
            }}
            title={areAllExpanded ? 'Collapse All Categories' : 'Expand All Categories'}
          >
            {areAllExpanded ? <UnfoldLess fontSize="small" /> : <UnfoldMore fontSize="small" />}
            <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 600 }}>
              {areAllExpanded ? 'Collapse All' : 'Expand All'}
            </Typography>
          </IconButton>
        </Box>
      )}
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
                    <ListItemButton 
                      onClick={() => !sidebarCollapsed && handleMenuToggle(item.text)}
                      sx={{ justifyContent: sidebarCollapsed ? 'center' : 'initial' }}
                    >
                      <ListItemIcon 
                        sx={{ 
                          minWidth: sidebarCollapsed ? 0 : 40,
                          justifyContent: 'center',
                          color: categoryColors.main,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {!sidebarCollapsed && (
                        <>
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
                        </>
                      )}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={openMenus[item.text] && !sidebarCollapsed} timeout="auto" unmountOnExit>
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
                  <ListItemButton 
                    onClick={() => handleMenuClick(item.path!)}
                    sx={{ justifyContent: sidebarCollapsed ? 'center' : 'initial' }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: sidebarCollapsed ? 0 : 40,
                        justifyContent: 'center',
                        color: categoryColors.main,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!sidebarCollapsed && (
                      <ListItemText 
                        primary={item.text}
                        primaryTypographyProps={{ 
                          fontSize: '0.875rem', 
                          fontWeight: 600,
                          color: categoryColors.dark,
                        }}
                      />
                    )}
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
          width: { sm: `calc(100% - ${sidebarCollapsed ? drawerWidthCollapsed : drawerWidth}px)` },
          ml: { sm: `${sidebarCollapsed ? drawerWidthCollapsed : drawerWidth}px` },
          transition: 'all 0.3s ease',
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
        sx={{ 
          width: { sm: sidebarCollapsed ? drawerWidthCollapsed : drawerWidth }, 
          flexShrink: { sm: 0 },
          transition: 'width 0.3s ease',
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: '#f8f9fa',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: sidebarCollapsed ? drawerWidthCollapsed : drawerWidth,
              bgcolor: '#f8f9fa',
              borderRight: '1px solid #e5e7eb',
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
            },
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
          width: { sm: `calc(100% - ${sidebarCollapsed ? drawerWidthCollapsed : drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'grey.100',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
