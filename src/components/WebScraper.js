import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ScraperUtils } from '../utils/scraper';
import { createAppTheme } from '../theme';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Checkbox,
  FormControlLabel,
  Alert,
  LinearProgress,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,  Tab,
  Tabs,
  Snackbar,
  CircularProgress,
  Badge,
  Avatar,
  ListItemAvatar,
  Skeleton,
  Fade,
  Zoom,
  Slide,
  Backdrop,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  MenuItem,
  Switch,
  FormGroup,
  FormControl,
  InputLabel,
  Select,  OutlinedInput,
  InputAdornment,
  useMediaQuery,
  CssBaseline,
} from '@mui/material';
import {
  Search as SearchIcon,
  Link as LinkIcon,
  Language as LanguageIcon,
  Home as HomeIcon,
  Public as PublicIcon,
  Image as ImageIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  FileDownload as FileDownloadIcon,
  DataObject as DataObjectIcon,
  Map as MapIcon,
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Insights as InsightsIcon,
  OpenInNew as OpenInNewIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,  Analytics as AnalyticsIcon,
  CloudDownload as CloudDownloadIcon,
  LinkOff as LinkOffIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

// Custom TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const WebScraper = () => {
  // Theme and UI state
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);
  const theme = createAppTheme(isDarkMode ? 'dark' : 'light');
  
  // Core application state
  const [url, setUrl] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filterText, setFilterText] = useState('');
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [selectedProxy, setSelectedProxy] = useState('auto');
  const [maxLinks, setMaxLinks] = useState(1000);
  const [brokenLinks, setBrokenLinks] = useState(null);
  const [checkingBrokenLinks, setCheckingBrokenLinks] = useState(false);

  const proxyOptions = [
    { value: 'auto', label: 'Auto (Try All)' },
    { value: 'allorigins', label: 'AllOrigins' },
    { value: 'cors-anywhere', label: 'CORS Anywhere' },
    { value: 'codetabs', label: 'CodeTabs' },
  ];

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const clearResults = () => {
    setResults(null);
    setBrokenLinks(null);
    setCheckingBrokenLinks(false);
    setError('');
    setProgress(0);
    setProgressText('');
    setSpeedDialOpen(false);
  };

  const shareResults = () => {
    if (navigator.share && results) {
      navigator.share({
        title: 'Pyintel Web Scraper Results',
        text: `Found ${results.totalLinks} links on ${results.baseDomain}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      const shareText = `Pyintel Web Scraper Results for ${results?.baseDomain || 'website'}:\n\nTotal Links: ${results?.totalLinks || 0}\nInternal: ${results?.uniqueInternalLinks || 0}\nExternal: ${results?.uniqueExternalLinks || 0}\nImages: ${results?.images?.length || 0}`;
      navigator.clipboard.writeText(shareText);
      showSnackbar('Results copied to clipboard!');
    }
    setSpeedDialOpen(false);
  };

  const getProxyUrl = useCallback((targetUrl, proxyType) => {
    switch (proxyType) {
      case 'allorigins':
        return `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      case 'cors-anywhere':
        return `https://cors-anywhere.herokuapp.com/${targetUrl}`;
      case 'codetabs':
        return `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`;
      default:
        return null;
    }
  }, []);
  const scrapeWebsite = async () => {
    if (!url || !agreed) {
      setError('Please enter a URL and agree to the terms');
      return;
    }

    if (!ScraperUtils.isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }    setLoading(true);
    setError('');
    setResults(null);
    setBrokenLinks(null);
    setCheckingBrokenLinks(false);
    setProgress(0);
    setProgressText('Initializing advanced scraping...');

    try {
      setProgress(10);
      setProgressText('Configuring proxy settings...');
      
      let proxyServices = [];
      
      if (selectedProxy === 'auto') {
        proxyServices = [
          `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
          `https://cors-anywhere.herokuapp.com/${url}`,
          `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
        ];
      } else {
        const proxyUrl = getProxyUrl(url, selectedProxy);
        if (proxyUrl) proxyServices = [proxyUrl];
      }

      setProgress(20);
      setProgressText('Connecting to proxy services...');

      let htmlContent = null;

      try {
        const response = await axios.get(`/api/proxy?url=${encodeURIComponent(url)}&proxy=${selectedProxy}`, {
          timeout: advancedMode ? 30000 : 15000,
        });
        htmlContent = response.data;
      } catch (proxyError) {
        console.error('Proxy request failed:', proxyError);
        throw new Error(`The scraping service failed to fetch the URL. The website might be down or blocking requests.`);
      }

      if (!htmlContent) {
        throw new Error(`The scraping service returned empty content. The website might be protected or is a single-page application that requires JavaScript.`);
      }

      setProgress(60);
      setProgressText('Parsing HTML content with advanced algorithms...');
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      setProgress(70);
      setProgressText('Extracting links with AI-powered detection...');
      const allLinks = ScraperUtils.extractLinks(doc, url);
      
      // Limit links if specified
      const limitedLinks = advancedMode ? allLinks : allLinks.slice(0, maxLinks);
      
      setProgress(80);
      setProgressText('Categorizing and analyzing links...');
      const baseDomain = ScraperUtils.extractDomain(url);
      const categorizedLinks = ScraperUtils.categorizeLinks(limitedLinks, baseDomain);

      setProgress(90);
      setProgressText('Gathering comprehensive metadata...');
      
      // Enhanced metadata extraction
      const title = doc.querySelector('title')?.textContent || 'No title found';
      const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || 'No description found';
      const metaKeywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
      const canonicalUrl = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
      const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
      const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
      const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
      
      const images = Array.from(doc.querySelectorAll('img[src]')).map(img => img.src).filter(src => ScraperUtils.isValidUrl(src));
      const videos = Array.from(doc.querySelectorAll('video[src], video source[src]')).map(video => video.src || video.getAttribute('src')).filter(src => ScraperUtils.isValidUrl(src));
      const scripts = Array.from(doc.querySelectorAll('script[src]')).map(script => script.src).filter(src => ScraperUtils.isValidUrl(src));
      const stylesheets = Array.from(doc.querySelectorAll('link[rel="stylesheet"][href]')).map(link => link.href).filter(href => ScraperUtils.isValidUrl(href));
      
      // Calculate domain statistics
      const externalDomains = [...new Set(categorizedLinks.external.map(link => ScraperUtils.extractDomain(link)))];
      const domainStats = externalDomains.reduce((acc, domain) => {
        acc[domain] = categorizedLinks.external.filter(link => ScraperUtils.extractDomain(link) === domain).length;
        return acc;
      }, {});
      
      setProgress(100);
      setProgressText('Analysis completed successfully!');

      const scrapedData = {
        originalUrl: url,
        baseDomain,
        timestamp: new Date().toISOString(),
        title,
        metaDescription,
        metaKeywords,
        canonicalUrl,
        ogTitle,
        ogDescription,
        ogImage,
        categorizedLinks,
        images: [...new Set(images)],
        videos: [...new Set(videos)],
        scripts: [...new Set(scripts)],
        stylesheets: [...new Set(stylesheets)],
        totalLinks: limitedLinks.length,
        totalLinksFound: allLinks.length,
        uniqueInternalLinks: categorizedLinks.internal.length,
        uniqueExternalLinks: categorizedLinks.external.length,
        resourceLinks: categorizedLinks.resources.length,
        externalDomains,
        domainStats,
        proxyUsed: usedProxy,
        advancedMode,
        analysisStats: {
          proxyAttempts,
          processingTime: Date.now(),
          linkLimitApplied: allLinks.length > maxLinks,
        }
      };      setResults(scrapedData);
      showSnackbar(`Successfully analyzed ${scrapedData.totalLinks} links from ${scrapedData.baseDomain}!`, 'success');

      // Check for broken links if in advanced mode
      if (advancedMode) {
        await checkBrokenLinks(scrapedData);
      }

    } catch (err) {
      console.error('Scraping error:', err);
      setError(`Failed to scrape the website: ${err.message}`);
      showSnackbar('Scraping failed. Please try a different proxy or website.', 'error');
    } finally {
      setLoading(false);
      setProgress(0);
      setProgressText('');
    }
  };

  const checkBrokenLinks = async (scrapedData) => {
    if (!scrapedData || !advancedMode) return;
    
    setCheckingBrokenLinks(true);
    setProgressText('Checking for broken links...');
    
    try {
      // Combine all links for checking
      const allLinksToCheck = [
        ...scrapedData.categorizedLinks.internal,
        ...scrapedData.categorizedLinks.external
      ];
      
      setProgress(95);
      setProgressText(`Checking ${allLinksToCheck.length} links for broken status...`);
      
      const brokenLinkResults = await ScraperUtils.checkBrokenLinks(allLinksToCheck, 3);
      setBrokenLinks(brokenLinkResults);
      
      showSnackbar(
        `Broken link check completed! Found ${brokenLinkResults.brokenCount} broken links`, 
        brokenLinkResults.brokenCount > 0 ? 'warning' : 'success'
      );
    } catch (error) {
      console.error('Broken link check failed:', error);
      showSnackbar('Failed to check broken links', 'error');
    } finally {
      setCheckingBrokenLinks(false);
      setProgress(100);
      setProgressText('Analysis completed!');
    }
  };

  const downloadXML = (data, type) => {
    const xml = ScraperUtils.generateAdvancedXML(data, type);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_links_${data.baseDomain}_${new Date().toISOString().split('T')[0]}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSnackbar(`${type} links XML downloaded successfully!`);
  };

  const downloadSitemap = (data) => {
    const xml = ScraperUtils.generateSitemapXML(data);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitemap_${data.baseDomain}_${new Date().toISOString().split('T')[0]}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSnackbar('Sitemap downloaded successfully!');
  };

  const downloadJSON = (data) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scrape_results_${data.baseDomain}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSnackbar('JSON results downloaded successfully!');
  };
  const downloadBrokenLinksReport = () => {
    if (!brokenLinks) {
      showSnackbar('No broken links data available', 'warning');
      return;
    }

    const report = {
      timestamp: new Date().toISOString(),
      originalUrl: results.originalUrl,
      baseDomain: results.baseDomain,
      summary: {
        totalChecked: brokenLinks.total,
        brokenCount: brokenLinks.brokenCount,
        workingCount: brokenLinks.workingCount,
        unreachableCount: brokenLinks.unreachableCount
      },
      brokenLinks: brokenLinks.broken,
      unreachableLinks: brokenLinks.unreachable,
      workingLinks: brokenLinks.working.slice(0, 100) // Limit working links to keep file size reasonable
    };

    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `broken_links_report_${results.baseDomain}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSnackbar('Broken links report downloaded successfully!');
  };

  // Enhanced DataGrid columns for links
  const createLinkColumns = useCallback((type) => [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      type: 'number',
    },
    {
      field: 'url',
      headerName: 'URL',
      width: 450,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={`Click to open: ${params.value}`} arrow>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <LinkIcon fontSize="small" color="primary" />
            <Typography 
              variant="body2" 
              sx={{ 
                cursor: 'pointer', 
                color: 'primary.main',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                '&:hover': { 
                  textDecoration: 'underline',
                  color: 'primary.dark'
                }
              }}
              onClick={() => window.open(params.value, '_blank')}
            >
              {params.value}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                window.open(params.value, '_blank');
              }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'domain',
      headerName: 'Domain',
      width: 200,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          variant="outlined"
          sx={{ 
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'white'
            }
          }}
        />
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color={params.value === 'internal' ? 'success' : 'warning'}
          variant="filled"
        />
      ),
    },
    {
      field: 'protocol',
      headerName: 'Protocol',
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color={params.value === 'https:' ? 'success' : 'error'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Copy URL">
            <IconButton
              size="small"
              onClick={() => {
                navigator.clipboard.writeText(params.row.url);
                showSnackbar('URL copied to clipboard!');
              }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open in new tab">
            <IconButton
              size="small"
              onClick={() => window.open(params.row.url, '_blank')}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], [showSnackbar]);

  const formatLinksForDataGrid = useCallback((links, type) => {
    return links.map((link, index) => {
      const urlObj = new URL(link);
      return {
        id: index + 1,
        url: link,
        domain: urlObj.hostname,
        type: type,
        protocol: urlObj.protocol,
        pathname: urlObj.pathname,
      };
    });
  }, []);

  // Filter links based on search text
  const filteredInternalLinks = useMemo(() => {
    if (!results || !filterText) return results?.categorizedLinks?.internal || [];
    return results.categorizedLinks.internal.filter(link => 
      link.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [results, filterText]);

  const filteredExternalLinks = useMemo(() => {
    if (!results || !filterText) return results?.categorizedLinks?.external || [];
    return results.categorizedLinks.external.filter(link => 
      link.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [results, filterText]);
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: 'background.default',
        position: 'relative',
      }}>
        {/* Professional Navigation Bar */}
        <Paper 
          elevation={0} 
          sx={{ 
            py: 2, 
            px: 3,
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            backdropFilter: 'blur(20px)',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            maxWidth: 'xl',
            mx: 'auto'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'secondary.main', 
                  width: 40, 
                  height: 40,
                  boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)'
                }}
              >
                <InsightsIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Pyintel Web Scraper
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Professional Link Analysis Platform
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
                <IconButton
                  onClick={toggleDarkMode}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Settings">
                <IconButton
                  onClick={() => setSettingsOpen(true)}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Modern Header Section */}
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 800,
                  color: 'text.primary',
                  mb: 2,
                  background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Advanced Web Link Analysis
              </Typography>
              <Typography 
                variant="h5" 
                color="text.secondary" 
                sx={{ 
                  mb: 4, 
                  fontWeight: 400,
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                Extract, analyze, and visualize website link structures with enterprise-grade precision
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<SecurityIcon />} 
                  label="Client-Side Processing" 
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
                <Chip 
                  icon={<SpeedIcon />} 
                  label="Real-time Analysis" 
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
                <Chip 
                  icon={<AnalyticsIcon />} 
                  label="Advanced Insights" 
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
          </Fade>          {/* Professional Input Form */}
          <Slide direction="up" in timeout={800}>
            <Paper 
              elevation={0}
              sx={{ 
                mb: 4,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{ 
                  px: 4, 
                  py: 3,
                  backgroundColor: 'background.paper',
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Website Analysis Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter a URL to begin comprehensive link extraction and analysis
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="🌐 Website URL"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      error={!!error && !url}
                      helperText={error && !url ? 'URL is required' : 'Enter the complete URL including protocol (https://)'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkIcon color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: url && (
                          <InputAdornment position="end">
                            <Tooltip title="Clear URL">
                              <IconButton onClick={() => setUrl('')} size="small">
                                <ClearIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      size="large"
                    />
                  </Grid>

                  {/* Advanced Settings */}
                  {advancedMode && (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2, bgcolor: 'rgba(33, 150, 243, 0.1)' }}>
                        <Typography variant="h6" gutterBottom>
                          ⚙️ Advanced Configuration
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                              <InputLabel>Proxy Service</InputLabel>
                              <Select
                                value={selectedProxy}
                                onChange={(e) => setSelectedProxy(e.target.value)}
                                input={<OutlinedInput label="Proxy Service" />}
                              >
                                {proxyOptions.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Max Links to Process"
                              type="number"
                              value={maxLinks}
                              onChange={(e) => setMaxLinks(parseInt(e.target.value))}
                              inputProps={{ min: 100, max: 10000, step: 100 }}
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  )}

                  {/* Terms Agreement - Enhanced */}
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ bgcolor: 'rgba(255, 193, 7, 0.05)', border: '2px solid', borderColor: 'warning.light' }}>
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: 'warning.main' }}>
                            <SecurityIcon />
                          </Avatar>
                        }
                        title="⚖️ Terms of Use & Legal Disclaimer"
                        titleTypographyProps={{ variant: 'h6', color: 'warning.dark', fontWeight: 600 }}
                        subheader="Please read and agree to the following terms before proceeding"
                      />
                      <CardContent>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            🚨 Important Legal Notice
                          </Typography>
                        </Alert>
                        
                        <Accordion>
                          <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ bgcolor: 'rgba(255, 193, 7, 0.1)' }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckCircleIcon color="success" />
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                📋 Usage Terms & User Responsibilities
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <List dense>
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                                    <CheckCircleIcon fontSize="small" />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                  primary="Personal & Business Use Only" 
                                  secondary="This tool is designed for legitimate personal or business analysis purposes"
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                    <SecurityIcon fontSize="small" />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                  primary="Client-Side Processing Guarantee" 
                                  secondary="All operations run in your browser - no data sent to Pyintel servers"
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: 'error.main', width: 32, height: 32 }}>
                                    <WarningIcon fontSize="small" />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                  primary="No Liability for Data Usage" 
                                  secondary="Pyintel is not responsible for data leaks or misuse of scraped information"
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                                    <InfoIcon fontSize="small" />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                  primary="Legal Compliance Required" 
                                  secondary="You must comply with all laws and target website terms of service"
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                                    <PublicIcon fontSize="small" />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                  primary="Respect Website Policies" 
                                  secondary="Always respect robots.txt, rate limits, and ethical scraping practices"
                                />
                              </ListItem>
                            </List>
                          </AccordionDetails>
                        </Accordion>

                        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                color="primary"
                                size="large"
                              />
                            }
                            label={
                              <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                ✅ I have read, understood, and agree to all terms and conditions above
                              </Typography>
                            }
                          />
                        </Box>
                           </CardContent>
                          </Card>
                    </Grid>
                    

                  {/* Progress Section */}
                  {loading && (
                    <Grid item xs={12}>
                      <Fade in>
                        <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CircularProgress size={32} sx={{ mr: 2, color: 'inherit' }} />
                            <Typography variant="h6">
                              🚀 Advanced Scraping in Progress
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{ 
                              mb: 1, 
                              height: 8,
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: 'white'
                              }
                            }} 
                          />
                          <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            {progressText} ({progress}%)
                          </Typography>
                        </Paper>
                      </Fade>
                    </Grid>
                  )}

                  {/* Error Display */}
                  {error && (
                    <Grid item xs={12}>
                      <Fade in>
                        <Alert 
                          severity="error" 
                          icon={<ErrorIcon />}
                          sx={{ borderRadius: 2 }}
                          action={
                            <Button color="inherit" size="small" onClick={() => setError('')}>
                              Dismiss
                            </Button>
                          }
                        >
                          <Typography variant="subtitle2">
                            {error}
                          </Typography>
                        </Alert>
                      </Fade>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={scrapeWebsite}
                  disabled={!url || !agreed || loading}
                  startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
                  sx={{ 
                    px: 6, 
                    py: 2,
                    fontSize: '1.2rem',
                    minWidth: 250,
                  }}
                >                  {loading ? 'Analyzing Website...' : '🚀 Start Advanced Analysis'}
                </Button>
              </CardActions>
            </Paper>
          </Slide>

          {/* Advanced Settings Dialog */}
          <Dialog 
            open={settingsOpen} 
            onClose={() => setSettingsOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon color="primary" />
                Advanced Settings
              </Box>
            </DialogTitle>
            <DialogContent>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={advancedMode}
                      onChange={(e) => setAdvancedMode(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable Advanced Mode"
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                  Advanced mode provides additional configuration options and enhanced analysis capabilities.
                </Typography>
              </FormGroup>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSettingsOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>          {/* Enhanced Results Section */}
          {results && (
            <Slide direction="up" in timeout={1000}>
              <Card>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <AnalyticsIcon />
                    </Avatar>
                  }
                  title="📊 Advanced Analysis Results"
                  subheader={`Comprehensive analysis completed for ${results.baseDomain} at ${new Date(results.timestamp).toLocaleString()}`}
                  action={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Filter Results">
                        <TextField
                          size="small"
                          placeholder="Filter links..."
                          value={filterText}
                          onChange={(e) => setFilterText(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FilterListIcon fontSize="small" />
                              </InputAdornment>
                            ),
                            endAdornment: filterText && (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setFilterText('')}>
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ minWidth: 200 }}
                        />
                      </Tooltip>
                    </Box>
                  }
                />
                <CardContent>
                  {/* Enhanced Website Info */}
                  <Paper sx={{ 
                    p: 3, 
                    mb: 3, 
                    background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                            📄 {results.title}
                          </Typography>
                          <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                            {results.metaDescription}
                          </Typography>
                          {results.ogTitle && results.ogTitle !== results.title && (
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              <strong>OG Title:</strong> {results.ogTitle}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                              <strong>🌐 Domain:</strong> {results.baseDomain}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                              <strong>⏰ Analyzed:</strong> {new Date(results.timestamp).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              <strong>🔧 Mode:</strong> {results.advancedMode ? 'Advanced' : 'Standard'}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box sx={{
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      zIndex: 0,
                    }} />
                  </Paper>

                  {/* Enhanced Statistics Grid */}
                  <Grid container spacing={2} sx={{ mb: 4 }}>
                    {[
                      { 
                        icon: LinkIcon, 
                        value: results.totalLinks, 
                        label: 'Total Links', 
                        color: 'primary',
                        description: results.totalLinksFound > results.totalLinks ? `${results.totalLinksFound} found (limited)` : 'All links processed'
                      },
                      { 
                        icon: HomeIcon, 
                        value: results.uniqueInternalLinks, 
                        label: 'Internal Links', 
                        color: 'success',
                        description: 'Same domain links'
                      },
                      { 
                        icon: PublicIcon, 
                        value: results.uniqueExternalLinks, 
                        label: 'External Links', 
                        color: 'warning',
                        description: 'Cross-domain links'
                      },
                      { 
                        icon: DataObjectIcon, 
                        value: results.resourceLinks, 
                        label: 'Resources', 
                        color: 'info',
                        description: 'JS, CSS, images, etc.'
                      },
                      { 
                        icon: ImageIcon, 
                        value: results.images.length, 
                        label: 'Images', 
                        color: 'secondary',
                        description: 'Image resources found'
                      },                      { 
                        icon: LanguageIcon, 
                        value: results.externalDomains.length, 
                        label: 'Domains', 
                        color: 'error',
                        description: 'Unique external domains'
                      },
                      { 
                        icon: LinkOffIcon, 
                        value: brokenLinks ? brokenLinks.brokenCount : '?', 
                        label: 'Broken Links', 
                        color: 'error',
                        description: brokenLinks ? `${brokenLinks.brokenCount} broken of ${brokenLinks.total} checked` : 'Click to check',
                        onClick: brokenLinks ? undefined : () => checkBrokenLinks(results)
                      },
                    ].map((stat, index) => (                      <Grid item xs={6} sm={4} md={2} key={index}>
                        <Zoom in style={{ transitionDelay: `${index * 100}ms` }}>
                          <Paper sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            height: '100%',
                            transition: 'all 0.3s ease',
                            cursor: stat.onClick ? 'pointer' : 'default',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: (theme) => theme.shadows[8],
                            }
                          }}
                          onClick={stat.onClick}
                          >
                            <Avatar sx={{ 
                              bgcolor: `${stat.color}.main`, 
                              mx: 'auto', 
                              mb: 1,
                              width: 48,
                              height: 48,
                            }}>
                              <stat.icon />
                            </Avatar>
                            <Typography variant="h4" color={`${stat.color}.main`} sx={{ fontWeight: 700 }}>
                              {stat.value}
                            </Typography>
                            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                              {stat.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {stat.description}
                            </Typography>
                            {stat.onClick && (
                              <Button 
                                size="small" 
                                variant="outlined" 
                                sx={{ mt: 1 }}
                                disabled={checkingBrokenLinks}
                                startIcon={checkingBrokenLinks ? <CircularProgress size={16} /> : undefined}
                              >
                                {checkingBrokenLinks ? 'Checking...' : 'Check Now'}
                              </Button>
                            )}
                          </Paper>
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Enhanced Export Section */}
                  <Paper sx={{ p: 3, mb: 3, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CloudDownloadIcon color="success" />
                      📥 Export & Download Options
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Download your analysis results in various formats for further processing
                    </Typography>
                    <Grid container spacing={2}>
                      {[
                        { 
                          action: () => downloadXML(results, 'internal'), 
                          icon: FileDownloadIcon, 
                          label: 'Internal XML', 
                          color: 'success',
                          description: `${results.uniqueInternalLinks} internal links`
                        },
                        { 
                          action: () => downloadXML(results, 'external'), 
                          icon: FileDownloadIcon, 
                          label: 'External XML', 
                          color: 'warning',
                          description: `${results.uniqueExternalLinks} external links`
                        },
                        { 
                          action: () => downloadSitemap(results), 
                          icon: MapIcon, 
                          label: 'Sitemap', 
                          color: 'secondary',
                          description: 'SEO-friendly format'
                        },                        { 
                          action: () => downloadJSON(results), 
                          icon: DataObjectIcon, 
                          label: 'JSON Export', 
                          color: 'info',
                          description: 'Complete dataset'
                        },
                        ...(brokenLinks ? [{
                          action: () => downloadBrokenLinksReport(), 
                          icon: LinkOffIcon, 
                          label: 'Broken Links Report', 
                          color: 'error',
                          description: `${brokenLinks.brokenCount} broken links`
                        }] : []),
                      ].map((exportOption, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                          <Button
                            fullWidth
                            variant="contained"
                            color={exportOption.color}
                            startIcon={<exportOption.icon />}
                            onClick={exportOption.action}
                            sx={{ 
                              mb: 1,
                              flexDirection: 'column',
                              py: 2,
                              height: 80,
                            }}
                          >
                            <Typography variant="button" sx={{ fontWeight: 600 }}>
                              {exportOption.label}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              {exportOption.description}
                            </Typography>
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>

                  {/* Enhanced Tabbed Content */}
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs 
                      value={tabValue} 
                      onChange={handleTabChange} 
                      variant="scrollable" 
                      scrollButtons="auto"
                      sx={{ 
                        '& .MuiTab-root': {
                          minHeight: 64,
                          fontSize: '1rem',
                        }
                      }}
                    >
                      <Tab 
                        label={
                          <Badge badgeContent={filteredInternalLinks.length} color="success" max={9999}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <HomeIcon />
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  Internal Links
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Same domain
                                </Typography>
                              </Box>
                            </Box>
                          </Badge>
                        } 
                      />
                      <Tab 
                        label={
                          <Badge badgeContent={filteredExternalLinks.length} color="warning" max={9999}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PublicIcon />
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  External Links
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Other domains
                                </Typography>
                              </Box>
                            </Box>
                          </Badge>
                        } 
                      />
                      <Tab 
                        label={
                          <Badge badgeContent={results.images.length} color="secondary" max={9999}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ImageIcon />
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  Media Assets
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Images & videos
                                </Typography>
                              </Box>
                            </Box>
                          </Badge>
                        }                      />
                      <Tab 
                        label={
                          <Badge 
                            badgeContent={brokenLinks ? brokenLinks.brokenCount : 0} 
                            color="error" 
                            max={9999}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinkOffIcon />
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  Broken Links
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {checkingBrokenLinks ? 'Checking...' : 'Link status'}
                                </Typography>
                              </Box>
                            </Box>
                          </Badge>
                        } 
                      />
                      <Tab 
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AnalyticsIcon />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Analytics
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Domain insights
                              </Typography>
                            </Box>
                          </Box>
                        } 
                      />
                    </Tabs>
                  </Box>

                  {/* Internal Links Tab - Enhanced DataGrid */}
                  <TabPanel value={tabValue} index={0}>
                    <Box sx={{ height: 650, width: '100%' }}>
                      <DataGrid
                        rows={formatLinksForDataGrid(filteredInternalLinks, 'internal')}
                        columns={createLinkColumns('internal')}
                        pageSize={25}
                        rowsPerPageOptions={[25, 50, 100, 200]}
                        disableSelectionOnClick
                        components={{
                          Toolbar: GridToolbar,
                        }}
                        sx={{
                          '& .MuiDataGrid-cell:hover': {
                            backgroundColor: 'action.hover',
                          },
                          '& .MuiDataGrid-row:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.04)',
                          },
                          '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                          },
                        }}
                        loading={loading}
                      />
                    </Box>
                  </TabPanel>

                  {/* External Links Tab - Enhanced DataGrid */}
                  <TabPanel value={tabValue} index={1}>
                    <Box sx={{ height: 650, width: '100%' }}>
                      <DataGrid
                        rows={formatLinksForDataGrid(filteredExternalLinks, 'external')}
                        columns={createLinkColumns('external')}
                        pageSize={25}
                        rowsPerPageOptions={[25, 50, 100, 200]}
                        disableSelectionOnClick
                        components={{
                          Toolbar: GridToolbar,
                        }}
                        sx={{
                          '& .MuiDataGrid-cell:hover': {
                            backgroundColor: 'action.hover',
                          },
                          '& .MuiDataGrid-row:hover': {
                            backgroundColor: 'rgba(255, 152, 0, 0.04)',
                          },
                          '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'warning.light',
                            color: 'warning.contrastText',
                          },
                        }}
                        loading={loading}
                      />
                    </Box>
                  </TabPanel>

                  {/* Enhanced Media Tab */}
                  <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={2}>
                      {results.images.slice(0, 24).map((image, index) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                          <Zoom in style={{ transitionDelay: `${index * 50}ms` }}>
                            <Card sx={{ 
                              height: '100%',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: (theme) => theme.shadows[8],
                              }
                            }}>
                              <Box
                                component="img"
                                src={image}
                                alt={`Media ${index + 1}`}
                                sx={{
                                  width: '100%',
                                  height: 120,
                                  objectFit: 'cover',
                                }}
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEzVjE5QzIxIDIwLjEgMjAuMSAyMSAxOSAyMUg1QzMuOSAyMSAzIDIwLjEgMyAxOVY1QzMgMy45IDMuOSAzIDUgM0gxMVYxMUgyMVYxM1oiIGZpbGw9IiNFNUU1RTUiLz4KPHBhdGggZD0iTTEzIDlIMTFWN0gxM1Y5WiIgZmlsbD0iIzlFOUU5RSIvPgo8L3N2Zz4K';
                                }}
                              />
                              <CardContent sx={{ p: 1.5 }}>
                                <Typography variant="caption" display="block" noWrap sx={{ mb: 1 }}>
                                  {image.split('/').pop()?.substring(0, 20) || 'Unknown'}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Tooltip title="Copy URL">
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        navigator.clipboard.writeText(image);
                                        showSnackbar('Image URL copied!');
                                      }}
                                    >
                                      <ShareIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Open in new tab">
                                    <IconButton
                                      size="small"
                                      onClick={() => window.open(image, '_blank')}
                                    >
                                      <OpenInNewIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </CardContent>
                            </Card>
                          </Zoom>
                        </Grid>
                      ))}
                      {results.images.length > 24 && (
                        <Grid item xs={12}>
                          <Alert severity="info" sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">
                              Showing first 24 images. Total images found: {results.images.length}
                            </Typography>
                            <Button 
                              variant="outlined" 
                              size="small" 
                              sx={{ mt: 1 }}
                              onClick={() => downloadJSON(results)}
                            >
                              Download complete list
                            </Button>
                          </Alert>
                        </Grid>                      )}
                    </Grid>
                  </TabPanel>

                  {/* Broken Links Tab */}
                  <TabPanel value={tabValue} index={3}>
                    {checkingBrokenLinks ? (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress size={60} sx={{ mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          Checking Links for Broken Status...
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          This may take a few minutes depending on the number of links
                        </Typography>
                      </Box>
                    ) : !brokenLinks ? (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Broken Link Detection
                        </Typography>
                        <Typography variant="body2">
                          Enable Advanced Mode and run a new analysis to check for broken links automatically.
                        </Typography>
                      </Alert>
                    ) : (
                      <Box>
                        {/* Broken Links Summary */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={12} sm={3}>
                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText' }}>
                              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {brokenLinks.brokenCount}
                              </Typography>
                              <Typography variant="body2">Broken Links</Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
                              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {brokenLinks.workingCount}
                              </Typography>
                              <Typography variant="body2">Working Links</Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {brokenLinks.unreachableCount}
                              </Typography>
                              <Typography variant="body2">Unreachable</Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {brokenLinks.total}
                              </Typography>
                              <Typography variant="body2">Total Checked</Typography>
                            </Paper>
                          </Grid>
                        </Grid>

                        {/* Broken Links DataGrid */}
                        {brokenLinks.broken.length > 0 ? (
                          <Box sx={{ height: 500, width: '100%' }}>
                            <DataGrid
                              rows={brokenLinks.broken.map((link, index) => ({
                                id: index + 1,
                                url: link.url,
                                status: link.status,
                                error: link.error || 'Unknown error',
                                domain: ScraperUtils.extractDomain(link.url)
                              }))}
                              columns={[
                                { field: 'id', headerName: 'ID', width: 70 },
                                {
                                  field: 'url',
                                  headerName: 'Broken URL',
                                  width: 400,
                                  flex: 1,
                                  renderCell: (params) => (
                                    <Tooltip title={`Broken link: ${params.value}`} arrow>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                        <LinkOffIcon fontSize="small" color="error" />
                                        <Typography 
                                          variant="body2" 
                                          sx={{ 
                                            cursor: 'pointer', 
                                            color: 'error.main',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            flex: 1,
                                            '&:hover': { 
                                              textDecoration: 'underline',
                                            }
                                          }}
                                          onClick={() => window.open(params.value, '_blank')}
                                        >
                                          {params.value}
                                        </Typography>
                                      </Box>
                                    </Tooltip>
                                  ),
                                },
                                {
                                  field: 'domain',
                                  headerName: 'Domain',
                                  width: 200,
                                  renderCell: (params) => (
                                    <Chip 
                                      label={params.value} 
                                      size="small" 
                                      variant="outlined"
                                      color="error"
                                    />
                                  ),
                                },
                                {
                                  field: 'error',
                                  headerName: 'Error Details',
                                  width: 300,
                                  renderCell: (params) => (
                                    <Tooltip title={params.value} arrow>
                                      <Typography variant="body2" color="text.secondary" noWrap>
                                        {params.value}
                                      </Typography>
                                    </Tooltip>
                                  ),
                                },
                              ]}
                              pageSize={25}
                              rowsPerPageOptions={[25, 50, 100]}
                              disableSelectionOnClick
                              components={{
                                Toolbar: GridToolbar,
                              }}
                              sx={{
                                '& .MuiDataGrid-cell:hover': {
                                  backgroundColor: 'rgba(244, 67, 54, 0.04)',
                                },
                                '& .MuiDataGrid-row:hover': {
                                  backgroundColor: 'rgba(244, 67, 54, 0.04)',
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                  backgroundColor: 'error.light',
                                  color: 'error.contrastText',
                                },
                              }}
                            />
                          </Box>
                        ) : (
                          <Alert severity="success" icon={<CheckCircleIcon />}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              🎉 No Broken Links Found!
                            </Typography>
                            <Typography variant="body2">
                              All {brokenLinks.total} links checked are working properly.
                            </Typography>
                          </Alert>
                        )}
                      </Box>
                    )}
                  </TabPanel>

                  {/* Analytics Tab */}
                  <TabPanel value={tabValue} index={4}>

                    <Grid container spacing={3}>

                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            🏆 Top External Domains
                          </Typography>
                          <List>
                            {Object.entries(results.domainStats)
                              .sort(([,a], [,b]) => b - a)
                              .slice(0, 10)
                              .map(([domain, count], index) => (
                                <ListItem key={domain} sx={{ px: 0 }}>
                                  <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                                      <Typography variant="caption">
                                        {index + 1}
                                      </Typography>
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={domain}
                                    secondary={`${count} links`}
                                  />
                                  <Chip 
                                    label={count} 
                                    color="secondary"
                                    size="small"
                                    sx={{ ml: 2 }}
                                    />
                                </ListItem>
                              ))}
                            </List>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DataObjectIcon />}
                                onClick={() => downloadJSON(results)}
                                sx={{ mt: 2 }}
                            >
                                Download Full Domain Stats
                            </Button>
                        </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            📊 Link Distribution
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: 'Internal', value: results.uniqueInternalLinks },
                                      { name: 'External', value: results.uniqueExternalLinks },
                                      { name: 'Resources', value: results.resourceLinks.length },
                                    ]}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                  >
                                    <Cell key="internal" fill={theme.palette.success.main} />
                                    <Cell key="external" fill={theme.palette.warning.main} />
                                    <Cell key="resources" fill={theme.palette.info.main} />
                                  </Pie>
                                  <RechartsTooltip />
                                  <Legend />
                                </PieChart>
                              </ResponsiveContainer>
                        </Paper>
                        </Grid>
                        <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            🌐 Domain Overview
                          </Typography>
                          <List>
                            <ListItem>
                              <ListItemText 
                                primary="Domain Name" 
                                secondary={new URL(url).hostname} 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Total Links Found" 
                                secondary={results.totalLinks} 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Unique Internal Links" 
                                secondary={results.uniqueInternalLinks} 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Unique External Links" 
                                secondary={results.uniqueExternalLinks} 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Total Images Found" 
                                secondary={results.images.length} 
                              />
                            </ListItem>
                          </List>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DataObjectIcon />}
                                onClick={() => downloadJSON(results)}
                                sx={{ mt: 2 }}
                            >
                                Download Full Domain Overview
                            </Button>
                        </Paper>
                        </Grid>
                      
                    </Grid>
                    </TabPanel>
                </CardContent>
              </Card>
            </Slide>
          )}

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={closeSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>

          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={speedDialOpen}
            onClick={() => setSpeedDialOpen(false)}
          />
          
          {results && (
            <SpeedDial
              ariaLabel="SpeedDial for results"
              sx={{ position: 'fixed', bottom: 32, right: 32 }}
              icon={<SpeedDialIcon />}
              onClose={() => setSpeedDialOpen(false)}
              onOpen={() => setSpeedDialOpen(true)}
              open={speedDialOpen}
            >
              <SpeedDialAction
                icon={<RefreshIcon />}
                tooltipTitle="Clear Results"
                onClick={clearResults}
              />
              <SpeedDialAction
                icon={<ShareIcon />}
                tooltipTitle="Share Results"
                onClick={shareResults}
              />
            </SpeedDial>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default WebScraper;
