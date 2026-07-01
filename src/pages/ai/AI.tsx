import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  Avatar,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material'
import { Send, SmartToy, Person } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { sendMessage, addMessage, clearMessages } from '../../redux/slices/aiAssistantSlice'
import { ChatMessage } from '../../features/ai-assistant/types'

export default function AI() {
  const [inputValue, setInputValue] = useState('')
  const dispatch = useAppDispatch()
  const { messages, isTyping, lastResponse } = useAppSelector((state) => state.aiAssistant)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }
    dispatch(addMessage(userMessage))
    dispatch(sendMessage(inputValue))
    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Assistant
      </Typography>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <SmartToy color="primary" />
          <Typography variant="h6">RecoverFlow AI</Typography>
          <Chip label="Online" color="success" size="small" />
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          AI summarizes every customer interaction, suggests best responses, recommends next actions, predicts recovery probability, and generates follow-up notes automatically.
        </Typography>
      </Paper>

      {/* Chat Messages */}
      <Paper sx={{ p: 3, mb: 2, height: 400, overflowY: 'auto' }}>
        <Stack spacing={2}>
          {messages.length === 0 ? (
            <Box textAlign="center" py={4}>
              <SmartToy sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Start a conversation with the AI Assistant!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try: "Customer says they'll pay on Friday after salary"
              </Typography>
            </Box>
          ) : (
            messages.map((msg) => (
              <Box
                key={msg.id}
                display="flex"
                gap={2}
                justifyContent={msg.role === 'user' ? 'flex-end' : 'flex-start'}
              >
                {msg.role === 'assistant' && (
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <SmartToy />
                  </Avatar>
                )}
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                    color: msg.role === 'user' ? 'white' : 'text.primary',
                  }}
                >
                  <Typography variant="body1" whiteSpace="pre-line">
                    {msg.content}
                  </Typography>
                </Paper>
                {msg.role === 'user' && (
                  <Avatar sx={{ bgcolor: 'secondary.light' }}>
                    <Person />
                  </Avatar>
                )}
              </Box>
            ))
          )}
          {isTyping && (
            <Box display="flex" gap={2}>
              <Avatar sx={{ bgcolor: 'primary.light' }}>
                <SmartToy />
              </Avatar>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={24} />
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Stack>
      </Paper>

      {/* AI Response Details */}
      {lastResponse && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            AI Analysis
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            {lastResponse.ptpDate && (
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Promise to Pay:</Typography>
                <Typography variant="body2" fontWeight="bold">{lastResponse.ptpDate}</Typography>
              </Box>
            )}
            {lastResponse.confidenceScore && (
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Confidence Score:</Typography>
                <Chip label={`${lastResponse.confidenceScore}%`} color="success" size="small" />
              </Box>
            )}
            {lastResponse.reminderDate && (
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Reminder:</Typography>
                <Typography variant="body2" fontWeight="bold">{lastResponse.reminderDate}</Typography>
              </Box>
            )}
            {lastResponse.suggestedAction && (
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Suggested Action:</Typography>
                <Chip label={lastResponse.suggestedAction.toUpperCase()} color="primary" size="small" />
              </Box>
            )}
            {lastResponse.recoveryProbability && (
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Recovery Probability:</Typography>
                <Typography variant="body2" fontWeight="bold">{lastResponse.recoveryProbability}%</Typography>
              </Box>
            )}
            {lastResponse.followUpNotes && (
              <Box mt={1}>
                <Typography variant="body2" color="text.secondary">Follow-up Notes:</Typography>
                <Typography variant="body2">{lastResponse.followUpNotes}</Typography>
              </Box>
            )}
          </Stack>
        </Paper>
      )}

      {/* Input Area */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Describe the customer interaction..."
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
          <Button variant="outlined" onClick={() => dispatch(clearMessages())}>
            Clear
          </Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleSend}
            disabled={isTyping || !inputValue.trim()}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
