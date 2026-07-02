import { GavelOutlined } from '@mui/icons-material'
import { DataPageLayout } from '../../components/common/DataPageLayout'

const columns = [
  { id: 'caseNumber', label: 'Case Number' },
  { id: 'customer', label: 'Customer' },
  { id: 'amount', label: 'Amount' },
  { id: 'status', label: 'Status' },
  { id: 'assignedTo', label: 'Assigned To' },
  { id: 'actions', label: 'Actions', align: 'right' as const },
]

export default function Cases() {
  return (
    <DataPageLayout
      title="Cases"
      subtitle="Track recovery cases, assignments, and resolution progress."
      columns={columns}
      primaryAction={{ label: 'Add Case' }}
      emptyState={{
        icon: <GavelOutlined sx={{ fontSize: 36 }} />,
        title: 'No cases found',
        description: 'Create a case to begin tracking customer recovery workflows.',
        actionLabel: 'Add Case',
      }}
    />
  )
}
