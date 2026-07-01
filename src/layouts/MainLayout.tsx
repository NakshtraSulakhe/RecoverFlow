import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Badge,
  InputBase,
  Tooltip,
  Divider,
  Button,
} from '@mui/material'
import {
  DashboardOutlined,
  PeopleAltOutlined,
  BusinessOutlined,
  AccountBalanceOutlined,
  GavelOutlined,
  PaymentOutlined,
  AssessmentOutlined,
  SettingsOutlined,
  SmartToyOutlined,
  Search,
  NotificationsOutlined,
  MenuOpen,
  ChevronLeft,
  AddCircleOutline,
  KeyboardCommandKey,
} from '@mui/icons-material'

const drawerWidth = 260
const collapsedWidth = 80

const menuItems = [
  { group: 'Main', items: [
    { text: 'Dashboard', icon: <DashboardOutlined />, path: '/dashboard' },
    { text: 'Global Search', icon: <Search />, path: '/search' },
  ]},
  { group: 'Customers', items: [
    { text: 'Tenants', icon: <BusinessOutlined />, path: '/tenants' },
    { text: 'Users', icon: <PeopleAltOutlined />, path: '/users' },
    { text: 'All Customers', icon: <AccountBalanceOutlined />, path: '/customers' },
  ]},
  { group: 'Operations', items: [
    { text: 'Cases', icon: <GavelOutlined />, path: '/cases' },
    { text: 'Follow-ups', icon: <PaymentOutlined />, path: '/recovery' },
  ]},
  { group: 'Payments', items: [
    { text: 'Payments', icon: <PaymentOutlined />, path: '/payments' },
    { text: 'Settlements', icon: <AssessmentOutlined />, path: '/reports' },
  ]},
]

export function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(true)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${collapsedWidth}px)`,
          ml: open ? `${drawerWidth}px` : `${collapsedWidth}px`,
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={toggleDrawer} edge="start">
              {open ? <MenuOpen /> : <ChevronLeft sx={{ transform: 'rotate(180deg)' }} />}
            </IconButton>
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center', 
              bgcolor: 'grey.100', 
              px: 2, 
              py: 0.5, 
              borderRadius: 2,
              minWidth: 300,
            }}>
              <Search fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
              <InputBase
                placeholder="Search anything..."
                sx={{ fontSize: 14, flex: 1 }}
              />
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5, 
                bgcolor: 'white', 
                px: 1, 
                borderRadius: 1, 
                border: '1px solid',
                borderColor: 'grey.300'
              }}>
                <KeyboardCommandKey sx={{ fontSize: 12 }} />
                <Typography variant="caption" sx={{ fontWeight: 700 }}>K</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Quick Create">
              <IconButton color="primary" sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                borderRadius: 2,
                px: 2,
                gap: 1
              }}>
                <AddCircleOutline fontSize="small" />
                <Typography variant="button">Quick Create</Typography>
              </IconButton>
            </Tooltip>
            <IconButton>
              <Badge variant="dot" color="error">
                <NotificationsOutlined />
              </Badge>
            </IconButton>
            <Box sx={{ ml: 1, borderLeft: '1px solid', borderColor: 'grey.200', pl: 2, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>RF</Avatar>
              <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                <Typography variant="subtitle2" sx={{ lineHeight: 1 }}>Admin User</Typography>
                <Typography variant="caption" color="text.secondary">Enterprise Plan</Typography>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : collapsedWidth,
            boxSizing: 'border-box',
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 1.5 }}>RF</Avatar>
          {open && (
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: 700 }}>RecoverFlow</Typography>
              <Typography variant="caption" color="text.secondary">Enterprise Management</Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ px: 2, mb: 2 }}>
          <Box sx={{ bgcolor: 'warning.light', color: 'warning.dark', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>Development</Typography>
          </Box>
        </Box>

        <List sx={{ px: 1.5 }}>
          {menuItems.map((group) => (
            <Box key={group.group} sx={{ mb: 2 }}>
              {open && (
                <Typography 
                  variant="overline" 
                  sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary', fontWeight: 700 }}
                >
                  {group.group}
                </Typography>
              )}
              {group.items.map((item) => (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      '&.Mui-selected': {
                        bgcolor: 'primary.50',
                        color: 'primary.main',
                        '& .MuiListItemIcon-root': { color: 'primary.main' },
                        '&:hover': { bgcolor: 'primary.100' },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                    {open && <ListItemText primary={item.text} primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />}
                  </ListItemButton>
                </ListItem>
              ))}
            </Box>
          ))}
        </List>

        <Box sx={{ mt: 'auto', p: 2 }}>
          {open && (
            <Box sx={{ bgcolor: 'grey.50', p: 1.5, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>Support</Typography>
              <Typography variant="caption" color="text.secondary">Need help with something?</Typography>
              <Button size="small" fullWidth sx={{ mt: 1, bgcolor: 'white', border: '1px solid', borderColor: 'grey.300', borderRadius: 1.5, textTransform: 'none' }}>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>Contact Us</Typography>
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: 8,
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
