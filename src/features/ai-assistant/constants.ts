export const AI_ASSISTANT_CONFIG = {
  MAX_HISTORY_LENGTH: 50,
  TYPING_DELAY_MS: 500,
}

export const SUGGESTED_ACTIONS = [
  { label: 'Call Customer', value: 'call', icon: 'call' },
  { label: 'Send SMS', value: 'sms', icon: 'sms' },
  { label: 'Send Email', value: 'email', icon: 'email' },
  { label: 'Send Legal Notice', value: 'legal', icon: 'gavel' },
] as const
