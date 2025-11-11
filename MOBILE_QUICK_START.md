# Mobile Optimization Quick-Start Template

This template shows you exactly what to add/change to make any DataGrid page mobile-responsive.

## Step-by-Step Implementation

### Step 1: Add Imports (at top of file)
```typescript
import { useTheme, useMediaQuery } from '@mui/material';
import { createMobileColumns, MobileColumnPresets } from '../utils/mobileUtils';
```

### Step 2: Add Mobile Detection (inside component, before return)
```typescript
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
```

### Step 3: Define Mobile Columns (after desktop columns)
```typescript
// Mobile-optimized columns - only show essential information
const mobileColumns: GridColDef[] = useMemo(() => {
  if (!isMobile) return columns;
  
  return [
    {
      field: 'name', // Primary identifier
      headerName: 'Name',
      width: 120,
      flex: 1, // Allow this column to grow
    },
    { 
      field: 'phone', // Secondary info
      headerName: 'Phone', 
      width: 100,
    },
    {
      field: 'status', // Status indicator
      headerName: 'Status',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value as string}
          color={getStatusColor(params.value as string) as any}
          size="small"
          sx={{ fontSize: '0.65rem', height: '20px' }}
        />
      ),
    },
    {
      field: 'actions', // Actions menu
      headerName: '',
      width: 60,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, params.row)}
          sx={{ p: 0.5 }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];
}, [isMobile, columns]);
```

### Step 4: Update Page Header
**Before:**
```typescript
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
    Page Title
  </Typography>
  <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen('add')}>
    Add New Item
  </Button>
</Box>
```

**After:**
```typescript
<Box sx={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  mb: { xs: 1, sm: 3 },
  flexDirection: { xs: 'column', sm: 'row' },
  gap: { xs: 1, sm: 0 },
}}>
  <Typography 
    variant="h4" 
    sx={{ 
      fontWeight: 'bold', 
      fontSize: { xs: '1.25rem', sm: '2.125rem' } 
    }}
  >
    Page Title {isMobile && `(${filteredData.length})`}
  </Typography>
  <Button
    variant="contained"
    startIcon={!isMobile && <AddIcon />}
    onClick={() => handleOpen('add')}
    size={isMobile ? 'small' : 'medium'}
    fullWidth={isMobile}
  >
    {isMobile ? '+ Add' : 'Add New Item'}
  </Button>
</Box>
```

### Step 5: Update Search Box
**Before:**
```typescript
<Paper sx={{ p: 2, mb: 3 }}>
  <TextField
    fullWidth
    placeholder="Search items by..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</Paper>
```

**After:**
```typescript
<Paper sx={{ p: { xs: 1, sm: 2 }, mb: { xs: 1, sm: 3 } }}>
  <TextField
    fullWidth
    size={isMobile ? 'small' : 'medium'}
    placeholder={isMobile ? "Search..." : "Search items by name, status, etc..."}
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
      endAdornment: searchQuery && (
        <InputAdornment position="end">
          <IconButton size="small" onClick={handleClearSearch}>
            <ClearIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
  {searchQuery && (
    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
      Found {filteredData.length} of {data.length} items
    </Typography>
  )}
</Paper>
```

### Step 6: Hide Stats Cards on Mobile (Optional)
**Before:**
```typescript
<Grid container spacing={3} sx={{ mb: 3 }}>
  {/* Statistics cards */}
</Grid>
```

**After:**
```typescript
{!isMobile && (
  <Grid container spacing={3} sx={{ mb: 3 }}>
    {/* Statistics cards */}
  </Grid>
)}
```

### Step 7: Update DataGrid
**Before:**
```typescript
<Paper sx={{ height: 500, width: '100%' }}>
  <DataGrid
    rows={filteredData}
    columns={columns}
    initialState={{
      pagination: {
        paginationModel: { page: 0, pageSize: 10 },
      },
    }}
    pageSizeOptions={[5, 10, 25]}
    checkboxSelection
    onRowClick={(params) => handleOpen('view', params.row)}
  />
</Paper>
```

**After:**
```typescript
<Paper sx={{ 
  height: isMobile ? 'calc(100vh - 200px)' : 500, 
  width: '100%',
  p: { xs: 0, sm: 2 },
}}>
  <DataGrid
    rows={filteredData}
    columns={isMobile ? mobileColumns : columns}
    density={isMobile ? 'compact' : 'standard'}
    initialState={{
      pagination: {
        paginationModel: { 
          page: 0, 
          pageSize: isMobile ? 25 : 10 
        },
      },
    }}
    pageSizeOptions={isMobile ? [25, 50] : [5, 10, 25]}
    checkboxSelection={!isMobile}
    onRowClick={(params) => handleOpen('view', params.row)}
    sx={{
      '& .MuiDataGrid-row': {
        cursor: 'pointer',
      },
    }}
  />
</Paper>
```

### Step 8: Update All Dialogs
**Before:**
```typescript
<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
```

**After:**
```typescript
<Dialog 
  open={open} 
  onClose={handleClose} 
  maxWidth="md" 
  fullWidth
  fullScreen={isMobile}
>
```

Apply this change to **every Dialog** in your page (view, edit, add, email, SMS, etc.)

## Quick Checklist

Use this checklist when optimizing a page:

- [ ] Import `useTheme` and `useMediaQuery` from '@mui/material'
- [ ] Import mobile utilities
- [ ] Add `isMobile` detection constant
- [ ] Define `mobileColumns` with useMemo (3-4 essential columns only)
- [ ] Update page header (responsive title + button)
- [ ] Update search box (compact size on mobile)
- [ ] Hide stats cards on mobile (wrap in `{!isMobile && ...}`)
- [ ] Update DataGrid props (columns, density, pagination, checkboxSelection)
- [ ] Add `fullScreen={isMobile}` to all Dialog components
- [ ] Test in Chrome DevTools mobile viewport
- [ ] Commit changes

## Mobile Column Guidelines

### What to Include (3-4 columns max):
1. **Primary identifier** (name, ID, number) - with `flex: 1`
2. **Secondary info** (phone, email, vehicle)
3. **Status indicator** (compact Chip component)
4. **Actions menu** (MoreVertIcon button, width: 60)

### What to Exclude:
- Long text fields (descriptions, notes, addresses)
- Multiple similar fields (city, state, zip → keep one or none)
- Dates (except if critical)
- Extra identifiers
- Non-essential status fields

### Column Width Guidelines:
- Primary field: `width: 120, flex: 1`
- Secondary fields: `width: 80-100`
- Status chips: `width: 80`
- Actions: `width: 60`

## Testing Checklist

### Desktop View (width >= 600px):
- [ ] All columns visible
- [ ] Statistics cards shown
- [ ] Multi-select checkboxes enabled
- [ ] Standard button sizes
- [ ] Dialog appears as modal (not fullscreen)
- [ ] Standard padding/spacing

### Mobile View (width < 600px):
- [ ] Only 3-4 essential columns visible
- [ ] Statistics cards hidden
- [ ] No checkboxes (single selection only)
- [ ] Compact buttons with shorter labels
- [ ] Dialogs appear fullscreen
- [ ] Reduced padding/spacing
- [ ] Touch-friendly tap targets
- [ ] Larger default page size (25 items)
- [ ] Scrollable without horizontal scroll

## Example Pages

See these files for complete working examples:
- `client/src/pages/Customers.tsx` - Full implementation with all features
- `MOBILE_OPTIMIZATION.md` - Detailed documentation
- `client/src/theme/mobileTheme.ts` - Global mobile theme
- `client/src/utils/mobileUtils.ts` - Helper functions and presets

## Common Patterns

### Responsive Spacing
```typescript
sx={{ 
  p: { xs: 1, sm: 3 },      // Padding: 8px mobile, 24px desktop
  mb: { xs: 1, sm: 2 },     // Margin-bottom: 8px mobile, 16px desktop
  gap: { xs: 0.5, sm: 2 },  // Gap: 4px mobile, 16px desktop
}}
```

### Responsive Font Sizes
```typescript
sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }}
```

### Conditional Rendering
```typescript
{isMobile ? <MobileComponent /> : <DesktopComponent />}
```

### Conditional Props
```typescript
<Component
  size={isMobile ? 'small' : 'medium'}
  fullWidth={isMobile}
  startIcon={!isMobile && <Icon />}
/>
```

## Browser DevTools Testing

1. Press `F12` to open DevTools
2. Press `Ctrl+Shift+M` to toggle device toolbar
3. Select a mobile device or set custom width < 600px
4. Refresh page and verify mobile optimizations
5. Test interactions (tap targets, dialogs, menus)
6. Switch back to desktop width (> 600px)
7. Verify desktop experience is unchanged
