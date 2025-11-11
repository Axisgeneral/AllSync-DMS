import { createTheme } from '@mui/material/styles';

// Mobile-optimized theme that extends the base theme
export const mobileTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            fontSize: '0.75rem',
            padding: '4px 8px',
            minWidth: 'auto',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            '& .MuiInputBase-root': {
              fontSize: '0.75rem',
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.75rem',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            padding: '8px',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h4: {
          '@media (max-width: 600px)': {
            fontSize: '1.25rem',
          },
        },
        h5: {
          '@media (max-width: 600px)': {
            fontSize: '1.1rem',
          },
        },
        h6: {
          '@media (max-width: 600px)': {
            fontSize: '1rem',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          '@media (max-width: 600px)': {
            margin: '8px',
            maxHeight: 'calc(100% - 16px)',
            width: 'calc(100% - 16px)',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            fontSize: '1rem',
            padding: '12px 16px',
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            padding: '12px 16px',
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            padding: '12px 16px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            fontSize: '0.65rem',
            height: '20px',
            '& .MuiChip-label': {
              padding: '0 6px',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            '& .MuiToolbar-root': {
              minHeight: '48px',
              padding: '0 8px',
            },
            '& .MuiTypography-h6': {
              fontSize: '0.9rem',
            },
            '& .MuiTypography-body2': {
              fontSize: '0.7rem',
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          '@media (max-width: 600px)': {
            '& .MuiListItemText-primary': {
              fontSize: '0.8rem',
            },
            '& .MuiListItemIcon-root': {
              minWidth: '36px',
            },
          },
        },
      },
    },
  },
});

export default mobileTheme;
