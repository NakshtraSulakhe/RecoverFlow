export interface RecoveryScore {
  overall: number // 0-100
  riskLevel: 'low' | 'medium' | 'high'
  starRating: 1 | 2 | 3 | 4 | 5
  factors: RecoveryFactor[]
}

export interface RecoveryFactor {
  name: string
  value: string | number
  weight: number
  impact: 'positive' | 'negative' | 'neutral'
}

export interface PriorityCase {
  id: string
  customerName: string
  caseNumber: string
  recoveryScore: RecoveryScore
  amountDue: number
  dpd: number // Days Past Due
  lastContact?: Date
  assignedTo?: string
}
