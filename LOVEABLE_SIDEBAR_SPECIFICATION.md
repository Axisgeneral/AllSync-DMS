# AllSync DMS - Sidebar Navigation Specification for Loveable

## Overview
This document provides complete specifications for recreating the AllSync DMS sidebar navigation in Loveable. The sidebar features a collapsible multi-level menu with expandable categories, alternating color schemes, and responsive design.

---

## 📐 Layout Specifications

### Sidebar Dimensions
- **Expanded Width**: 260px
- **Collapsed Width**: 65px
- **Mobile**: Full-screen drawer overlay
- **Transition**: 0.3s ease for all animations

### Color Scheme
- **Background**: `#f8f9fa` (light gray)
- **Border**: `#e5e7eb` (1px solid)
- **Primary Blue**: `#2563eb` (main), `#eff6ff` (light), `#1e40af` (dark)
- **Primary Green**: `#059669` (main), `#ecfdf5` (light), `#047857` (dark)

---

## 📋 Navigation Structure

### Header
```
Component: Toolbar
- Background: Primary color (#1976d2 or similar)
- Height: 64px (desktop), 48px (mobile)
- Content:
  * Logo/Title: "AllSync DMS" (left aligned, white text)
  * Collapse Button: ChevronLeft/ChevronRight icon (right aligned, white)
  * Mobile: Hidden on collapsed state
```

### Expand/Collapse All Control
```
Location: Below header, above menu items
Background: #e5e7eb
Border-bottom: 1px solid #d1d5db
Button:
  - Icon: UnfoldMore (expand) / UnfoldLess (collapse)
  - Text: "Expand All" / "Collapse All"
  - Size: Small
  - Color: Primary blue
  - Only visible when sidebar is expanded
```

---

## 🎨 Menu Categories & Structure

### Category 1: Dashboard
**Icon**: DashboardIcon
**Color**: Blue (#2563eb)
**Type**: Single item (no submenu)
**Path**: `/dashboard`

---

### Category 2: Road to Sale
**Icon**: TrendingUp
**Color**: Green (#059669)
**Type**: Expandable category
**Submenu Items**:
1. Leads → `/leads`
2. Customers → `/customers`
3. Credit Applications → `/credit-applications`
4. Deals → `/deals`
5. Trades → `/trades`

---

### Category 3: Inventory Management
**Icon**: Inventory
**Color**: Blue (#2563eb)
**Type**: Expandable category
**Submenu Items**:
1. Vehicles → `/vehicles`

---

### Category 4: F&I
**Icon**: AccountBalance
**Color**: Green (#059669)
**Type**: Expandable category
**Submenu Items**:
1. Pending Credit Applications → `/pending-credit-applications`
2. Lender Management → `/lender-management`
3. Deal Management → `/deal-management`

---

### Category 5: Service Department
**Icon**: Engineering
**Color**: Blue (#2563eb)
**Type**: Expandable category
**Submenu Items**:
1. Service Appointments → `/service`
2. Service Orders → `/service-orders`
3. Parts Management → `/parts-management`

---

### Category 6: Accounting
**Icon**: Receipt
**Color**: Green (#059669)
**Type**: Expandable category
**Submenu Items**:
1. GL Mapping → `/gl-mapping`
2. Reconciliation → `/reconciliation`
3. Profit and Loss → `/profit-loss`

---

### Category 7: Human Resources
**Icon**: Work
**Color**: Blue (#2563eb)
**Type**: Expandable category
**Submenu Items**:
1. Time Clock → `/time-clock`
2. Payroll → `/payroll`
3. Scheduling → `/scheduling`
4. Employee Data → `/employee-data`
5. User Management → `/user-management`

---

## 🎯 Styling Specifications

### Category Item (Parent)
```css
Border-left: 4px solid {categoryColor.main}
Background: 
  - Default: transparent
  - Expanded: {categoryColor.light}
  - Hover: {categoryColor.light}
Transition: all 0.3s ease

Icon:
  - Color: {categoryColor.main}
  - Size: 24px
  - Min-width: 40px (expanded), 0px (collapsed)

Text:
  - Font-size: 0.875rem (14px)
  - Font-weight: 600 (semi-bold)
  - Color: {categoryColor.dark}

Expand Icon (ExpandMore/ExpandLess):
  - Color: {categoryColor.main}
  - Position: Right aligned
```

### Submenu Item (Child)
```css
Padding-left: 56px (7 * 8px spacing)
Border-left: 4px solid {categoryColor.main}
Background: {categoryColor.light}

Hover State:
  - Background: white
  - Border-left: 4px solid {categoryColor.dark}

Text:
  - Font-size: 0.813rem (13px)
  - Font-weight: 400 (normal)
  - Color: {categoryColor.dark}
```

### Collapsed State Behavior
- Show icons only (centered)
- Hide all text
- Hide expand/collapse indicators
- Close all submenus automatically
- Clicking category icon does nothing (no expand)

---

## 🔄 Interactive Features

### 1. Category Expansion
- Click category to toggle submenu
- Smooth collapse/expand animation
- Remember state per category
- Multiple categories can be open simultaneously

### 2. Sidebar Collapse/Expand
- Toggle button in header (desktop only)
- Icon changes: ChevronLeft ↔ ChevronRight
- Width animates smoothly (0.3s ease)
- Auto-closes all submenus when collapsing

### 3. Expand/Collapse All
- Single button to expand all categories
- Changes icon and text based on state
- Disabled when sidebar is collapsed
- Located below header bar

### 4. Mobile Behavior
- Sidebar becomes temporary drawer
- Opens with hamburger menu button
- Overlays main content
- Closes when item is selected
- Full 260px width always (no collapse)

### 5. Navigation
- Click submenu item to navigate
- Closes mobile drawer after navigation
- Maintains selected state (optional feature)
- Smooth page transitions

---

## 🎨 Color Pattern Reference

### Alternating Pattern (Blue → Green → Blue → Green)
1. **Dashboard**: Blue
2. **Road to Sale**: Green
3. **Inventory Management**: Blue
4. **F&I**: Green
5. **Service Department**: Blue
6. **Accounting**: Green
7. **Human Resources**: Blue

### Color Values by Category
```javascript
const categoryColors = {
  'Dashboard': { main: '#2563eb', light: '#eff6ff', dark: '#1e40af' },
  'Road to Sale': { main: '#059669', light: '#ecfdf5', dark: '#047857' },
  'Inventory Management': { main: '#2563eb', light: '#eff6ff', dark: '#1e40af' },
  'F&I': { main: '#059669', light: '#ecfdf5', dark: '#047857' },
  'Service Department': { main: '#2563eb', light: '#eff6ff', dark: '#1e40af' },
  'Accounting': { main: '#059669', light: '#ecfdf5', dark: '#047857' },
  'Human Resources': { main: '#2563eb', light: '#eff6ff', dark: '#1e40af' }
};
```

---

## 📱 Responsive Breakpoints

### Desktop (≥ 600px)
- Permanent drawer
- Collapsible sidebar
- Fixed width (260px or 65px)
- Collapse button visible

### Mobile (< 600px)
- Temporary drawer
- Hamburger menu trigger
- Overlay mode
- No collapse feature
- Always 260px when open

---

## 🔧 Material-UI Components Used

### Core Components
- `Drawer` (variant: "permanent" for desktop, "temporary" for mobile)
- `List` and `ListItem`
- `ListItemButton`
- `ListItemIcon`
- `ListItemText`
- `Collapse` (for submenu animation)
- `Toolbar`
- `IconButton`
- `Typography`
- `Divider`

### Icons Required
```
Material Icons:
- Dashboard
- TrendingUp
- Inventory
- AccountBalance
- Engineering
- Receipt
- Work
- ChevronLeft
- ChevronRight
- ExpandMore
- ExpandLess
- UnfoldMore
- UnfoldLess
- Menu (hamburger)
```

---

## ⚡ Key Features Summary

✅ **Multi-level navigation** with expandable categories
✅ **Alternating color scheme** (Blue/Green pattern)
✅ **Collapsible sidebar** (260px ↔ 65px)
✅ **Expand/Collapse All** button for all categories
✅ **Smooth animations** for all transitions
✅ **Responsive design** with mobile drawer
✅ **Visual hierarchy** with left border accents
✅ **Hover states** with color transitions
✅ **Icon-only mode** when collapsed
✅ **Multiple categories** can be open simultaneously

---

## 📝 Implementation Notes for Loveable

### State Management Required
```javascript
// Sidebar collapse state
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

// Individual menu expansion states
const [openMenus, setOpenMenus] = useState({
  'Road to Sale': false,
  'Inventory Management': false,
  'F&I': false,
  'Service Department': false,
  'Accounting': false,
  'Human Resources': false,
});

// Mobile drawer state
const [mobileOpen, setMobileOpen] = useState(false);
```

### Key Functions
1. `handleMenuToggle(menuText)` - Toggle individual category
2. `handleSidebarToggle()` - Collapse/expand sidebar
3. `handleExpandAll()` - Expand all categories
4. `handleCollapseAll()` - Collapse all categories
5. `handleMenuClick(path)` - Navigate to page
6. `getCategoryColor(text)` - Get colors for category

---

## 🎬 Animation Details

### Transitions
```css
/* Sidebar width */
transition: width 0.3s ease;

/* Background color changes */
transition: all 0.3s ease;

/* Submenu collapse/expand */
timeout: "auto" /* Material-UI Collapse component */
```

### Easing
All transitions use **ease** timing function for smooth, natural motion.

---

## 📦 Complete Menu Structure JSON

```json
{
  "menuItems": [
    {
      "text": "Dashboard",
      "icon": "Dashboard",
      "path": "/dashboard",
      "color": "blue"
    },
    {
      "text": "Road to Sale",
      "icon": "TrendingUp",
      "color": "green",
      "subItems": [
        { "text": "Leads", "path": "/leads" },
        { "text": "Customers", "path": "/customers" },
        { "text": "Credit Applications", "path": "/credit-applications" },
        { "text": "Deals", "path": "/deals" },
        { "text": "Trades", "path": "/trades" }
      ]
    },
    {
      "text": "Inventory Management",
      "icon": "Inventory",
      "color": "blue",
      "subItems": [
        { "text": "Vehicles", "path": "/vehicles" }
      ]
    },
    {
      "text": "F&I",
      "icon": "AccountBalance",
      "color": "green",
      "subItems": [
        { "text": "Pending Credit Applications", "path": "/pending-credit-applications" },
        { "text": "Lender Management", "path": "/lender-management" },
        { "text": "Deal Management", "path": "/deal-management" }
      ]
    },
    {
      "text": "Service Department",
      "icon": "Engineering",
      "color": "blue",
      "subItems": [
        { "text": "Service Appointments", "path": "/service" },
        { "text": "Service Orders", "path": "/service-orders" },
        { "text": "Parts Management", "path": "/parts-management" }
      ]
    },
    {
      "text": "Accounting",
      "icon": "Receipt",
      "color": "green",
      "subItems": [
        { "text": "GL Mapping", "path": "/gl-mapping" },
        { "text": "Reconciliation", "path": "/reconciliation" },
        { "text": "Profit and Loss", "path": "/profit-loss" }
      ]
    },
    {
      "text": "Human Resources",
      "icon": "Work",
      "color": "blue",
      "subItems": [
        { "text": "Time Clock", "path": "/time-clock" },
        { "text": "Payroll", "path": "/payroll" },
        { "text": "Scheduling", "path": "/scheduling" },
        { "text": "Employee Data", "path": "/employee-data" },
        { "text": "User Management", "path": "/user-management" }
      ]
    }
  ]
}
```

---

## 🎯 Quick Reference - All Submenu Items (25 Total)

### Dashboard (1)
1. Dashboard

### Road to Sale (5)
2. Leads
3. Customers
4. Credit Applications
5. Deals
6. Trades

### Inventory Management (1)
7. Vehicles

### F&I (3)
8. Pending Credit Applications
9. Lender Management
10. Deal Management

### Service Department (3)
11. Service Appointments
12. Service Orders
13. Parts Management

### Accounting (3)
14. GL Mapping
15. Reconciliation
16. Profit and Loss

### Human Resources (5)
17. Time Clock
18. Payroll
19. Scheduling
20. Employee Data
21. User Management

**Total**: 7 Main Categories, 25 Total Pages

---

## 💡 Tips for Loveable Implementation

1. **Use Material-UI**: The design relies heavily on MUI components
2. **State Management**: Use React hooks (useState) for managing expansion states
3. **Color System**: Define color object at the top for easy access
4. **Responsive Design**: Test both mobile drawer and desktop sidebar
5. **Animations**: Ensure smooth transitions for all interactive elements
6. **Icons**: Import all required Material Icons
7. **Navigation**: Integrate with React Router for page navigation
8. **Accessibility**: Maintain keyboard navigation and screen reader support

---

## 📸 Visual Reference

### Expanded Sidebar (260px)
```
┌────────────────────────────────────┐
│ AllSync DMS                    [<] │ ← Header (primary color)
├────────────────────────────────────┤
│         [Expand All ⇅]             │ ← Control bar
├────────────────────────────────────┤
│ 🔷 Dashboard                       │ ← Blue border
├────────────────────────────────────┤
│ 🟢 Road to Sale                  v │ ← Green border (expanded)
│   • Leads                          │
│   • Customers                      │
│   • Credit Applications            │
│   • Deals                          │
│   • Trades                         │
├────────────────────────────────────┤
│ 🔷 Inventory Management          > │ ← Blue border (collapsed)
├────────────────────────────────────┤
│ 🟢 F&I                           v │ ← Green border (expanded)
│   • Pending Credit Applications    │
│   • Lender Management              │
│   • Deal Management                │
└────────────────────────────────────┘
```

### Collapsed Sidebar (65px)
```
┌──────┐
│  [>] │ ← Header
├──────┤
│  🔷  │ ← Dashboard icon only
├──────┤
│  🟢  │ ← Road to Sale icon only
├──────┤
│  🔷  │ ← Inventory icon only
├──────┤
│  🟢  │ ← F&I icon only
└──────┘
```

---

**Document Version**: 1.0
**Last Updated**: November 12, 2025
**Project**: AllSync DMS
**Purpose**: Loveable Integration Specification
