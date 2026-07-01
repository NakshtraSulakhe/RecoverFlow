export const RISK_LEVELS = {
  low: { label: 'Low Risk', color: 'success' as const },
  medium: { label: 'Medium Risk', color: 'warning' as const },
  high: { label: 'High Risk', color: 'error' as const },
}

export const FACTOR_NAMES = [
  'Payment History',
  'Loan Age',
  'Previous Promises',
  'Call Behavior',
  'Location',
  'Occupation',
  'Credit Score',
]
