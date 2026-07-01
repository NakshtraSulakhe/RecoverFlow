export interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  tenantId: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  totalDebt: number
  status: 'active' | 'inactive' | 'settled'
  createdAt: string
}

export interface Case {
  id: string
  customerId: string
  caseNumber: string
  amount: number
  status: 'open' | 'in_progress' | 'closed' | 'settled'
  assignedTo: string
  createdAt: string
  updatedAt: string
}

export interface Recovery {
  id: string
  caseId: string
  amount: number
  method: 'phone' | 'email' | 'visit' | 'legal'
  status: 'pending' | 'completed' | 'failed'
  notes: string
  date: string
}

export interface Payment {
  id: string
  caseId: string
  customerId: string
  amount: number
  paymentDate: string
  method: 'cash' | 'card' | 'bank_transfer' | 'check'
  status: 'pending' | 'completed' | 'failed'
  reference: string
}

export interface Tenant {
  id: string
  name: string
  domain: string
  status: 'active' | 'inactive'
  createdAt: string
}
