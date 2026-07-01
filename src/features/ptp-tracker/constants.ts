export const PTP_STATUSES = {
  pending: { label: 'Pending', color: 'primary' as const },
  kept: { label: 'Kept', color: 'success' as const },
  broken: { label: 'Broken', color: 'error' as const },
  rescheduled: { label: 'Rescheduled', color: 'warning' as const },
}

export const REMINDER_TYPES = [
  { label: 'SMS', value: 'sms' },
  { label: 'Email', value: 'email' },
  { label: 'In-App', value: 'in_app' },
]
