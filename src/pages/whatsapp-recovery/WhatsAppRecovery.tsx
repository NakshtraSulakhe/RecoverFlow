import { useState } from 'react'
import React from 'react'
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
  Grid,
} from '@mui/material'
import { Send as SendIcon, Chat as ChatIcon, Description } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { sendWhatsAppMessage } from '../../redux/slices/communicationSlice'
import { WHATSAPP_TEMPLATES } from '../../features/communication/constants'

export default function WhatsAppRecovery() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [messageType, setMessageType] = useState('text')
  const [messageContent, setMessageContent] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const dispatch = useAppDispatch()
  const { whatsappMessages, isLoading } = useAppSelector((state) => state.communication)

  const handleSendMessage = () => {
    if (phoneNumber.trim() && messageContent.trim()) {
      dispatch(sendWhatsAppMessage({ phoneNumber, content: messageContent, type: messageType }))
      setMessageContent('')
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = WHATSAPP_TEMPLATES.find(t => t.id === templateId)
    if (template) {
      setMessageType(template.type)
      setMessageContent(`[${template.name}] Placeholder content`)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        WhatsApp Recovery
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Send WhatsApp Message
            </Typography>

            <TextField
              fullWidth
              label="Customer Phone Number"
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Template</InputLabel>
              <Select
                value={selectedTemplate}
                label="Template"
                onChange={(e) => handleTemplateSelect(e.target.value)}
              >
                {WHATSAPP_TEMPLATES.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Message Content"
              variant="outlined"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={!phoneNumber.trim() || !messageContent.trim() || isLoading}
              fullWidth
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Message History
            </Typography>
            {whatsappMessages.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                No messages sent yet
              </Typography>
            ) : (
              <List>
                {whatsappMessages.map((message) => (
                  <React.Fragment key={message.id}>
                    <ListItem>
                      <Avatar sx={{ mr: 2, bgcolor: message.direction === 'outbound' ? 'primary.light' : 'success.light' }}>
                        <ChatIcon />
                      </Avatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1" fontWeight="bold">
                              {message.customerName}
                            </Typography>
                            <Chip
                              label={message.direction}
                              size="small"
                              color={message.direction === 'outbound' ? 'primary' : 'success'}
                            />
                            <Chip label={message.type} size="small" variant="outlined" />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                              {message.content}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(message.timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                        }
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
