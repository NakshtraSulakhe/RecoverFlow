import React from 'react'
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Chip,
  Badge,
  Button,
  Tabs,
  Tab,
  Paper,
} from '@mui/material'
import {
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'

export interface NotificationDrawerProps {
  open: boolean
  onClose: () => void
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'warning' | 'error' | 'info'
  priority: 'high' | 'medium' | 'low'
  timestamp: string
  read: boolean
  starred?: boolean
  category: string
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ open, onClose }) => {
  const [selectedTab, setSelectedTab] = React.useState(0)
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      title: 'Payment Received',
      message: 'Customer John Doe made a payment of $500',
      type: 'success',
      priority: 'high',
      timestamp: '2 minutes ago',
      read: false,
      category: 'Payments',
    },
    {
      id: '2',
      title: 'Case Escalated',
      message: 'Recovery case #1234 has been escalated to legal team',
      type: 'warning',
      priority: 'high',
      timestamp: '1 hour ago',
      read: false,
      category: 'Recovery',
    },
    {
      id: '3',
      title: 'New Customer Added',
      message: 'Customer Jane Smith has been added to the system',
      type: 'info',
      priority: 'medium',
      timestamp: '3 hours ago',
      read: true,
      category: 'Customers',
    },
    {
      id: '4',
      title: 'System Update',
      message: 'System will be updated tonight at 11 PM',
      type: 'info',
      priority: 'low',
      timestamp: '1 day ago',
      read: true,
      category: 'System',
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon color="success" />
      case 'warning':
        return <WarningIcon color="warning" />
      case 'error':
        return <ErrorIcon color="error" />
      case 'info':
      default:
        return <InfoIcon color="info" />
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
      default:
        return 'default'
    }
  }

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleToggleStar = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, starred: !n.starred } : n))
    )
  }

  const groupNotificationsByDate = (notifs: Notification[]) => {
    const groups: Record<string, Notification[]> = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    }

    notifs.forEach((notif) => {
      if (notif.timestamp.includes('minute') || notif.timestamp.includes('hour')) {
        groups.Today.push(notif)
      } else if (notif.timestamp.includes('day')) {
        groups.Yesterday.push(notif)
      } else {
        groups.Earlier.push(notif)
      }
    })

    return groups
  }

  const groupedNotifications = groupNotificationsByDate(notifications)

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 400, borderRadius: '16px 0 0 16px' },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
            <Typography variant="h6">Notifications</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
            <Tab label={`All (${notifications.length})`} />
            <Tab label={`Unread (${unreadCount})`} />
            <Tab label="Starred" />
          </Tabs>
        </Box>

        {/* Actions */}
        <Box sx={{ p: 2, display: 'flex', gap: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Button size="small" startIcon={<MarkEmailReadIcon />} onClick={handleMarkAllRead}>
            Mark All Read
          </Button>
          <Button size="small" startIcon={<ArchiveIcon />}>
            Archive
          </Button>
        </Box>

        {/* Notifications List */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {Object.entries(groupedNotifications).map(([date, notifs]) => {
            if (notifs.length === 0) return null

            return (
              <Box key={date}>
                <Box sx={{ px: 2, py: 1, bgcolor: 'action.hover' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {date}
                  </Typography>
                </Box>
                <List disablePadding>
                  {notifs.map((notification) => (
                    <ListItem
                      key={notification.id}
                      disablePadding
                      sx={{
                        bgcolor: notification.read ? 'transparent' : 'action.hover',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <ListItemButton
                        dense
                        onClick={() => handleMarkRead(notification.id)}
                        sx={{ py: 2 }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {getNotificationIcon(notification.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                                {notification.title}
                              </Typography>
                              <Chip
                                label={notification.priority}
                                size="small"
                                color={getPriorityColor(notification.priority) as any}
                                sx={{ height: 18, fontSize: '0.65rem' }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                                {notification.message}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {notification.timestamp} • {notification.category}
                              </Typography>
                            </Box>
                          }
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleStar(notification.id)
                          }}
                        >
                          {notification.starred ? (
                            <StarIcon color="primary" fontSize="small" />
                          ) : (
                            <StarBorderIcon fontSize="small" />
                          )}
                        </IconButton>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )
          })}
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button fullWidth variant="outlined" endIcon={<ArrowForwardIcon />}>
            View All Notifications
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
