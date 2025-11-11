import { GridColDef } from '@mui/x-data-grid';

/**
 * Mobile Optimization Utilities
 * 
 * These utilities help optimize DataGrid columns and layouts for mobile devices
 * without affecting the desktop experience.
 */

/**
 * Creates a mobile-optimized version of DataGrid columns
 * - Hides less important columns
 * - Reduces column widths
 * - Prioritizes essential information
 * 
 * @param columns - Original desktop columns
 * @param priorityFields - Array of field names to keep on mobile
 * @returns Mobile-optimized columns
 */
export const createMobileColumns = (
  columns: GridColDef[],
  priorityFields: string[]
): GridColDef[] => {
  return columns
    .filter(col => priorityFields.includes(col.field))
    .map(col => ({
      ...col,
      width: col.field === 'actions' ? 60 : Math.min((col.width as number) || 100, 100),
      minWidth: 60,
      flex: col.field === 'actions' ? undefined : 0,
    }));
};

/**
 * Gets responsive column width based on screen size
 * @param desktopWidth - Width for desktop
 * @param mobileWidth - Width for mobile
 * @param isMobile - Whether device is mobile
 */
export const getResponsiveWidth = (
  desktopWidth: number,
  mobileWidth: number,
  isMobile: boolean
): number => {
  return isMobile ? mobileWidth : desktopWidth;
};

/**
 * Common mobile column configurations for different page types
 */
export const MobileColumnPresets = {
  // For customer-related pages
  customers: ['id', 'firstName', 'lastName', 'phone', 'status', 'actions'],
  
  // For vehicle-related pages
  vehicles: ['stockNumber', 'year', 'make', 'model', 'price', 'status', 'actions'],
  
  // For lead-related pages
  leads: ['id', 'firstName', 'lastName', 'phone', 'status', 'actions'],
  
  // For deal-related pages
  deals: ['dealNumber', 'customerName', 'vehicle', 'totalPrice', 'status', 'actions'],
  
  // For service-related pages
  service: ['id', 'customerName', 'vehicle', 'date', 'status', 'actions'],
  
  // For financial pages
  financial: ['id', 'description', 'amount', 'date', 'status', 'actions'],
  
  // For employee pages
  employees: ['id', 'firstName', 'lastName', 'department', 'status', 'actions'],
  
  // For inventory pages
  inventory: ['id', 'partNumber', 'description', 'quantity', 'price', 'actions'],
};

/**
 * Mobile-friendly chip colors that work well on small screens
 */
export const mobileChipColors = {
  success: { bgcolor: '#dcfce7', color: '#166534' },
  error: { bgcolor: '#fee2e2', color: '#991b1b' },
  warning: { bgcolor: '#fef3c7', color: '#92400e' },
  info: { bgcolor: '#dbeafe', color: '#1e40af' },
  default: { bgcolor: '#f3f4f6', color: '#374151' },
};

/**
 * Get optimal pagination settings for mobile
 */
export const getMobilePaginationSettings = (isMobile: boolean) => ({
  pageSizeOptions: isMobile ? [10, 25] : [10, 25, 50, 100],
  pageSize: isMobile ? 10 : 25,
});

/**
 * Mobile-optimized dialog settings
 */
export const getMobileDialogProps = (isMobile: boolean) => ({
  fullScreen: isMobile,
  maxWidth: isMobile ? false : 'md' as const,
  PaperProps: {
    sx: {
      m: isMobile ? 0 : 2,
      maxHeight: isMobile ? '100%' : 'calc(100% - 64px)',
    },
  },
});

/**
 * Get responsive spacing
 */
export const getResponsiveSpacing = (isMobile: boolean) => ({
  p: isMobile ? 1 : 3,
  mb: isMobile ? 1 : 2,
  gap: isMobile ? 1 : 2,
});

export default {
  createMobileColumns,
  getResponsiveWidth,
  MobileColumnPresets,
  mobileChipColors,
  getMobilePaginationSettings,
  getMobileDialogProps,
  getResponsiveSpacing,
};
