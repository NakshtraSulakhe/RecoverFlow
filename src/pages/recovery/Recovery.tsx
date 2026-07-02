import { LoopOutlined } from '@mui/icons-material'
import { DataPageLayout } from '../../components/common/DataPageLayout'

const columns = [
  { id: 'case', label: 'Case' },
  { id: 'method', label: 'Method' },
  { id: 'amount', label: 'Amount' },
  { id: 'status', label: 'Status' },
  { id: 'date', label: 'Date' },
  { id: 'actions', label: 'Actions', align: 'right' as const },
]

export default function Recovery() {
  return (
    <DataPageLayout
      title="Recovery Actions"
      subtitle="Monitor follow-ups, outreach activities, and recovery outcomes."
      columns={columns}
      primaryAction={{ label: 'Add Recovery Action' }}
      emptyState={{
        icon: <LoopOutlined sx={{ fontSize: 36 }} />,
        title: 'No recovery actions',
        description: 'Log calls, visits, and follow-ups to keep cases moving forward.',
        actionLabel: 'Add Recovery Action',
      }}
    />
  )
}
