export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface AIAssistantResponse {
  ptpDate?: string
  confidenceScore?: number
  reminderDate?: string
  suggestedResponse?: string
  suggestedAction?: 'call' | 'sms' | 'email' | 'legal'
  recoveryProbability?: number
  followUpNotes?: string
}

export interface ConversationContext {
  customerId?: string
  caseId?: string
}
