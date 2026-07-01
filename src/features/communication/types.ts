export type DialerMode = 'predictive' | 'progressive' | 'power' | 'manual'

export type CommunicationChannel = 'phone' | 'whatsapp' | 'sms' | 'email' | 'chat' | 'portal'

export type CallStatus = 'idle' | 'dialing' | 'ringing' | 'connected' | 'on-hold' | 'disconnected' | 'voicemail' | 'busy'

export interface Call {
  id: string
  customerId: string
  customerName: string
  phoneNumber: string
  status: CallStatus
  startTime?: Date
  endTime?: Date
  duration?: number
  recordingUrl?: string
  notes?: string
}

export interface WhatsAppMessage {
  id: string
  customerId: string
  customerName: string
  phoneNumber: string
  direction: 'inbound' | 'outbound'
  type: 'text' | 'image' | 'document' | 'payment-link' | 'reminder' | 'offer'
  content: string
  mediaUrl?: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  timestamp: Date
}

export interface CommunicationEvent {
  id: string
  customerId: string
  customerName: string
  channel: CommunicationChannel
  type: string
  title: string
  description: string
  timestamp: Date
  metadata?: any
}
