export interface PromiseToPay {
  id: string
  customerId: string
  caseId: string
  ptpDate: Date
  amount: number
  confidenceScore: number
  reminderDate?: Date
  status: 'pending' | 'kept' | 'broken' | 'rescheduled'
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface PTPReminder {
  id: string
  ptpId: string
  type: 'sms' | 'email' | 'in_app'
  sentAt?: Date
  status: 'pending' | 'sent' | 'failed'
}

export interface PTPCalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay: boolean
  resource: PromiseToPay
}
