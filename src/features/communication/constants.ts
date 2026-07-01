import { DialerMode, CommunicationChannel } from './types'

export const DIALER_MODES: { mode: DialerMode; label: string; description: string }[] = [
  { mode: 'manual', label: 'Manual', description: 'Click-to-call only' },
  { mode: 'progressive', label: 'Progressive', description: 'One call at a time' },
  { mode: 'predictive', label: 'Predictive', description: 'Multiple calls simultaneously' },
  { mode: 'power', label: 'Power', description: 'Balanced dialing' },
]

export const COMMUNICATION_CHANNELS: { channel: CommunicationChannel; label: string; icon: string }[] = [
  { channel: 'phone', label: 'Phone', icon: 'call' },
  { channel: 'whatsapp', label: 'WhatsApp', icon: 'chat' },
  { channel: 'sms', label: 'SMS', icon: 'message' },
  { channel: 'email', label: 'Email', icon: 'email' },
  { channel: 'chat', label: 'Chat', icon: 'chat-bubble' },
  { channel: 'portal', label: 'Portal', icon: 'web' },
]

export const WHATSAPP_TEMPLATES = [
  { id: 'payment-reminder', name: 'Payment Reminder', type: 'reminder' },
  { id: 'payment-link', name: 'Payment Link', type: 'payment-link' },
  { id: 'settlement-offer', name: 'Settlement Offer', type: 'offer' },
  { id: 'document-request', name: 'Document Request', type: 'document' },
  { id: 'otp-verification', name: 'OTP Verification', type: 'otp' },
]

export const COMMUNICATION_CONFIG = {
  autoRedialAttempts: 3,
  autoRedialDelay: 30000, // 30 seconds
  timezoneAware: true,
}
