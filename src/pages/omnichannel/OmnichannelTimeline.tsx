import { useState, useEffect } from 'react'
import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Grid,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab'
import {
  Call as CallIcon,
  Chat as ChatIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Web as WebIcon,
} from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { fetchCommunicationTimeline } from '../../redux/slices/communicationSlice'
import { COMMUNICATION_CHANNELS } from '../../features/communication/constants'
import type { CommunicationChannel } from '../../features/communication/types'

const channelIcons: Record<CommunicationChannel, any> = {
  phone: CallIcon,
  whatsapp: ChatIcon,
  sms: SmsIcon,
  email: EmailIcon,
  chat: ChatIcon,
  portal: WebIcon,
}

export default function OmnichannelTimeline() {
  const [selectedChannel, setSelectedChannel] = useState<string>('all')
  const dispatch = useAppDispatch()
  const { communicationTimeline, isLoading } = useAppSelector((state) => state.communication)

  useEffect(() => {
    dispatch(fetchCommunicationTimeline())
  }, [dispatch])

  const filteredTimeline = selectedChannel === 'all'
    ? communicationTimeline
    : communicationTimeline.filter(event => event.channel === selectedChannel)

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Omnichannel Communication Timeline
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Tabs
          value={selectedChannel}
          onChange={(_, newValue) => setSelectedChannel(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Channels" value="all" />
          {COMMUNICATION_CHANNELS.map((channel) => (
            <Tab key={channel.channel} label={channel.label} value={channel.channel} />
          ))}
        </Tabs>
      </Paper>

      <Paper sx={{ p: 3 }}>
        {isLoading ? (
          <Typography textAlign="center" py={4}>Loading timeline...</Typography>
        ) : (
          <Timeline position="alternate">
            {filteredTimeline.length === 0 ? (
              <TimelineItem>
                <TimelineContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No communication events yet
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ) : (
              filteredTimeline.map((event) => {
                const IconComponent = channelIcons[event.channel as CommunicationChannel]
                return (
                  <TimelineItem key={event.id}>
                    <TimelineSeparator>
                      <TimelineDot color="primary">
                        <IconComponent />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper sx={{ p: 2, borderRadius: 2 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {event.customerName}
                          </Typography>
                          <Chip
                            label={event.channel}
                            size="small"
                            color="primary"
                          />
                        </Box>
                        <Typography variant="body1" gutterBottom>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          {new Date(event.timestamp).toLocaleString()}
                        </Typography>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                )
              })
            )}
          </Timeline>
        )}
      </Paper>
    </Box>
  )
}
