import { GroupOutlined } from '@mui/icons-material'
import { DataPageLayout } from '../../components/common/DataPageLayout'

const columns = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'role', label: 'Role' },
  { id: 'status', label: 'Status' },
  { id: 'actions', label: 'Actions', align: 'right' as const },
]

export default function Users() {
  return (
    <DataPageLayout
      title="Users"
      subtitle="Manage team members, roles, and access across your organization."
      columns={columns}
      primaryAction={{ label: 'Add User' }}
      emptyState={{
        icon: <GroupOutlined sx={{ fontSize: 36 }} />,
        title: 'No users yet',
        description: 'Invite team members to collaborate on recovery operations.',
        actionLabel: 'Add User',
      }}
    />
  )
}
