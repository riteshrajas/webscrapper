import { createTheme } from '@mui/material/styles';

// Professional color palette inspired by modern enterprise applications
const lightPalette = {
  primary: {
    main: '#1e293b', // Professional dark slate
    light: '#334155',
    dark: '#0f172a',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#3b82f6', // Clean blue accent
    light: '#60a5fa',
    dark: '#2563eb',
    contrastText: '#ffffff',
  },
  background: {
    default: '#fafbfc',
    paper: '#ffffff',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
  },
  divider: '#e2e8f0',
  surface: {
    main: '#f8fafc',
    light: '#ffffff',
    dark: '#f1f5f9',
  },
};

const darkPalette = {
  primary: {
    main: '#f1f5f9', // Light text for dark mode
    light: '#ffffff',
    dark: '#e2e8f0',
    contrastText: '#1e293b',
  },
  secondary: {
    main: '#60a5fa', // Brighter blue for dark mode
    light: '#93c5fd',
    dark: '#3b82f6',
    contrastText: '#ffffff',
  },
  background: {
    default: '#0f172a',
    paper: '#1e293b',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
  },
  divider: '#334155',
  surface: {
    main: '#1e293b',
    light: '#334155',
    dark: '#0f172a',
  },
};

export const createAppTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    ...(mode === 'light' ? lightPalette : darkPalette),    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.375,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.625,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.625,
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.025em',
    },  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    // ... repeat for all 25 shadow levels
    ...Array(16).fill('0 25px 50px -12px rgb(0 0 0 / 0.25)'),
  ],  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          MozOsxFontSmoothing: 'grayscale',
          WebkitFontSmoothing: 'antialiased',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
        },
        body: {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
        },
        '#root': {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: mode === 'light' 
            ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
            : '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: mode === 'light'
              ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
              : '0 25px 50px -12px rgb(0 0 0 / 0.5)',
          },
        },
      },
    },    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          padding: '12px 32px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: mode === 'light' ? 'rgba(37, 99, 235, 0.04)' : 'rgba(59, 130, 246, 0.1)',
          },
        },
      },
    },    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: mode === 'light' ? '#ffffff' : 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(10px)',
            '& fieldset': {
              borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: mode === 'light' ? '#2563eb' : '#3b82f6',
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'light' ? '#2563eb' : '#3b82f6',
              borderWidth: '2px',
              boxShadow: mode === 'light' 
                ? '0 0 0 3px rgba(37, 99, 235, 0.1)' 
                : '0 0 0 3px rgba(59, 130, 246, 0.2)',
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
          },
        },
      },
    },    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.8)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          fontSize: '0.8rem',
          backdropFilter: 'blur(10px)',
        },
        outlined: {
          borderWidth: '2px',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          height: 10,
          backgroundColor: mode === 'light' ? '#e2e8f0' : '#334155',
        },
        bar: {
          borderRadius: 10,
          background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
        },
      },
    },    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          border: '1px solid',
          backdropFilter: 'blur(10px)',
        },
        standardSuccess: {
          backgroundColor: mode === 'light' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)',
          borderColor: '#10b981',
        },
        standardError: {
          backgroundColor: mode === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.2)',
          borderColor: '#ef4444',
        },
        standardWarning: {
          backgroundColor: mode === 'light' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.2)',
          borderColor: '#f59e0b',
        },
        standardInfo: {
          backgroundColor: mode === 'light' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.2)',
          borderColor: '#06b6d4',
        },
      },
    },    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid',
          borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '16px 0',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          minHeight: 64,
          borderRadius: '12px 12px 0 0',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: mode === 'light' ? 'rgba(37, 99, 235, 0.04)' : 'rgba(59, 130, 246, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: mode === 'light' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(59, 130, 246, 0.2)',
          },
        },
      },
    },    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid',
          borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid',
            borderColor: mode === 'light' ? '#f1f5f9' : '#334155',
            fontWeight: 500,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: mode === 'light' ? 'rgba(248, 250, 252, 0.8)' : 'rgba(15, 23, 42, 0.8)',
            borderBottom: '2px solid',
            borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
            borderRadius: '20px 20px 0 0',
          },
          '& .MuiDataGrid-columnHeader': {
            fontWeight: 700,
            fontSize: '0.9rem',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: mode === 'light' ? 'rgba(37, 99, 235, 0.04)' : 'rgba(59, 130, 246, 0.1)',
          },
          '& .MuiDataGrid-selectedRowCount': {
            visibility: 'hidden',
          },
        },
      },
    },    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
            : '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
          border: '2px solid',
          borderColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.8)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: mode === 'light' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(59, 130, 246, 0.2)',
          },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          backgroundColor: mode === 'light' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(0, 0, 0, 0.6)',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? 'rgba(248, 250, 252, 0.8)' : 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
  },
});

export default createAppTheme;
