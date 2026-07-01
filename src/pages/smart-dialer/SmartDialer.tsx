import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Grid,
} from '@mui/material'
import React from 'react'
import {
  Call as CallIcon,
  CallEnd,
  Pause,
  PlayArrow,
  VolumeUp,
  Mic,
} from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { makeCall, endCall, setDialerMode } from '../../redux/slices/communicationSlice'
import { DIALER_MODES } from '../../features/communication/constants'
import type { DialerMode } from '../../features/communication/types'

export default function SmartDialer() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const dispatch = useAppDispatch()
  const { dialerMode, currentCall, isDialing, callHistory } = useAppSelector((state) => state.communication)

  const handleMakeCall = () => {
    if (phoneNumber.trim()) {
      dispatch(makeCall(phoneNumber))
    }
  }

  const handleEndCall = () => {
    dispatch(endCall())
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Smart Dialer
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dialing Controls
            </Typography>

            {/* Dialer Mode Selector */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Dialer Mode</InputLabel>
              <Select
                value={dialerMode}
                label="Dialer Mode"
                onChange={(e) => dispatch(setDialerMode(e.target.value as DialerMode))}
              >
                {DIALER_MODES.map((mode) => (
                  <MenuItem key={mode.mode} value={mode.mode}>
                    <Box>
                      <Typography variant="body1">{mode.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {mode.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Phone Number Input */}
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              sx={{ mb: 3 }}
              disabled={!!currentCall}
            />

            {/* Call Controls */}
            <Box display="flex" gap={2} mb={3}>
              {!currentCall ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CallIcon />}
                  onClick={handleMakeCall}
                  disabled={!phoneNumber.trim() || isDialing}
                  fullWidth
                >
                  {isDialing ? 'Dialing...' : 'Call'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<CallEnd />}
                  onClick={handleEndCall}
                  fullWidth
                >
                  End Call
                </Button>
              )}
            </Box>

            {/* Additional Controls */}
            {currentCall && (
              <Card sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Current Call
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {currentCall.customerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentCall.phoneNumber}
                </Typography>
                <Box display="flex" gap={2} mt={2}>
                  <Button startIcon={<Mic />} variant="outlined">
                    Mute
                  </Button>
                  <Button startIcon={<VolumeUp />} variant="outlined">
                    Hold
                  </Button>
                </Box>
              </Card>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Calls
            </Typography>
            {callHistory.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                No recent calls
              </Typography>
            ) : (
              <List>
                {callHistory.map((call) => (
                <React.Fragment key={call.id}>
                  <ListItem>
                    <Avatar sx={{ mr: 2 }}>
                      <CallIcon />
                    </Avatar>
                    <ListItemText
                      primary={call.customerName}
                      secondary={
                        <Box>
                          <Typography variant="body2">{call.phoneNumber}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {call.status} - {call.duration}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip
                      label={call.status}
                      color={
                        call.status === 'connected' ? 'success' : 'default'
                      }
                      size="small"
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
