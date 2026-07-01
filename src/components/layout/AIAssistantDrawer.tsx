import React from 'react'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Avatar,
} from '@mui/material'
import {
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as SmartToyIcon,
  AutoAwesome as AutoAwesomeIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Lightbulb as LightbulbIcon,
  Speed as SpeedIcon,
  Minimize as MinimizeIcon,
  Expand as ExpandIcon,
  History as HistoryIcon,
} from '@mui/icons-material'

export interface AIAssistantDrawerProps {
  open: boolean
  onClose: () => void
}

interface SuggestedAction {
  id: string
  label: string
  icon: React.ReactNode
  description: string
}

interface AIInsight {
  id: string
  title: string
  description: string
  type: 'prediction' | 'recommendation' | 'insight'
  timestamp: string
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ open, onClose }) => {
  const [isMinimized, setIsMinimized] = React.useState(false)
  const [message, setMessage] = React.useState('')

  const suggestedActions: SuggestedAction[] = [
    {
      id: '1',
      label: 'Analyze Recovery Trends',
      icon: <TrendingUpIcon />,
      description: 'Get insights on recovery patterns',
    },
    {
      id: '2',
      label: 'Predict Payment Risk',
      icon: <AssessmentIcon />,
      description: 'Assess customer payment risk',
    },
    {
      id: '3',
      label: 'Generate Summary',
      icon: <AutoAwesomeIcon />,
      description: 'Summarize recent activities',
    },
    {
      id: '4',
      label: 'Quick Recommendations',
      icon: <LightbulbIcon />,
      description: 'Get actionable suggestions',
    },
  ]

  const recentInsights: AIInsight[] = [
    {
      id: '1',
      title: 'High Risk Customers',
      description: '5 customers flagged with high payment risk',
      type: 'prediction',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      title: 'Recovery Rate Increase',
      description: 'Recovery rate increased by 15% this week',
      type: 'insight',
      timestamp: '1 day ago',
    },
    {
      id: '3',
      title: 'Optimal Follow-up Time',
      description: 'Best time to contact customers is 10 AM - 12 PM',
      type: 'recommendation',
      timestamp: '2 days ago',
    },
  ]

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'prediction':
        return <AssessmentIcon color="warning" />
      case 'recommendation':
        return <LightbulbIcon color="info" />
      case 'insight':
      default:
        return <TrendingUpIcon color="success" />
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending
      setMessage('')
    }
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMinimized ? 80 : 400,
          borderRadius: '16px 0 0 16px',
          transition: (theme) => theme.transitions.create('width'),
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {!isMinimized ? (
          <>
            {/* Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SmartToyIcon />
                <Typography variant="h6">AI Assistant</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton size="small" onClick={() => setIsMinimized(true)} sx={{ color: 'inherit' }}>
                  <MinimizeIcon />
                </IconButton>
                <IconButton size="small" onClick={onClose} sx={{ color: 'inherit' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Greeting */}
            <Box sx={{ p: 3, bgcolor: 'action.hover' }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                👋 Hello! I'm your AI assistant.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                I can help you analyze data, predict outcomes, and provide recommendations.
              </Typography>
            </Box>

            {/* Suggested Actions */}
            <Box sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                SUGGESTED ACTIONS
              </Typography>
              <List dense>
                {suggestedActions.map((action) => (
                  <ListItem key={action.id} disablePadding>
                    <ListItemButton dense sx={{ borderRadius: 1, mb: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>{action.icon}</ListItemIcon>
                      <ListItemText
                        primary={action.label}
                        secondary={action.description}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider />

            {/* Recent Insights */}
            <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                RECENT INSIGHTS
              </Typography>
              <List dense>
                {recentInsights.map((insight) => (
                  <Paper key={insight.id} sx={{ mb: 1, p: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      {getInsightIcon(insight.type)}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {insight.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {insight.description}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                          {insight.timestamp}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </List>

              {/* Conversation History Placeholder */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  CONVERSATION HISTORY
                </Typography>
                <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <HistoryIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No recent conversations
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Input */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <TextField
                fullWidth
                placeholder="Ask AI anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage()
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleSendMessage} disabled={!message.trim()}>
                      <SendIcon />
                    </IconButton>
                  ),
                }}
                size="small"
              />
            </Box>
          </>
        ) : (
          <>
            {/* Minimized State */}
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <IconButton onClick={() => setIsMinimized(false)} size="large">
                <ExpandIcon />
              </IconButton>
              <SmartToyIcon sx={{ mt: 1, color: 'primary.main' }} />
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  )
}
