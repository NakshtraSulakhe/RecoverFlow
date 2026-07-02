import { PaymentOutlined } from '@mui/icons-material'
import { DataPageLayout } from '../../components/common/DataPageLayout'

const columns = [
  { id: 'paymentId', label: 'Payment ID' },
  { id: 'case', label: 'Case' },
  { id: 'customer', label: 'Customer' },
  { id: 'amount', label: 'Amount' },
  { id: 'method', label: 'Method' },
  { id: 'date', label: 'Date' },
  { id: 'status', label: 'Status' },
  { id: 'actions', label: 'Actions', align: 'right' as const },
]

export default function Payments() {
  return (
    <DataPageLayout
      title="Payments"
      subtitle="Record, reconcile, and audit customer payments and settlements."
      columns={columns}
      primaryAction={{ label: 'Record Payment' }}
      emptyState={{
        icon: <PaymentOutlined sx={{ fontSize: 36 }} />,
        title: 'No payments recorded',
        description: 'Payments linked to cases will appear here for tracking and reporting.',
        actionLabel: 'Record Payment',
      }}
    />
  )
}
