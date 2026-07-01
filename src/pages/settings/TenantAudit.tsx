/**
 * Tenant Audit Page
 * Activity timeline for tenant changes
 */

import React, { useState } from 'react'
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Alert,
  Grid,
  Button,
} from '@mui/material'
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material'
import { TenantAuditLog, AuditAction, EntityType } from '../../features/tenant/types'

export const TenantAudit: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [entityFilter, setEntityFilter] = useState('')
  const [page, setPage] = useState(1)

  // Mock audit logs
  const auditLogs: TenantAuditLog[] = [
    {
      id: '1',
      tenantId: 'tenant-1',
      userId: 'user-1',
      action: AuditAction.UPDATE,
      entityType: EntityType.SETTINGS,
      entityId: 'settings-1',
      changes: { timezone: 'UTC', currency: 'USD' },
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      timestamp: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      tenantId: 'tenant-1',
      userId: 'user-2',
      action: AuditAction.CREATE,
      entityType: EntityType.BRANCH,
      entityId: 'branch-1',
      changes: { name: 'New York Branch', code: 'NYC' },
      ipAddress: '192.168.1.2',
      userAgent: 'Mozilla/5.0',
      timestamp: '2024-01-15T09:15:00Z',
    },
    {
      id: '3',
      tenantId: 'tenant-1',
      userId: 'user-1',
      action: AuditAction.UPDATE,
      entityType: EntityType.BRANDING,
      entityId: 'branding-1',
      changes: { primaryColor: '#1976d2' },
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      timestamp: '2024-01-14T16:45:00Z',
    },
    {
      id: '4',
      tenantId: 'tenant-1',
      userId: 'user-3',
      action: AuditAction.CREATE,
      entityType: EntityType.USER,
      entityId: 'user-3',
      changes: { email: 'newuser@company.com', role: 'admin' },
      ipAddress: '192.168.1.3',
      userAgent: 'Mozilla/5.0',
      timestamp: '2024-01-14T14:20:00Z',
    },
    {
      id: '5',
      tenantId: 'tenant-1',
      userId: 'user-1',
      action: AuditAction.UPDATE,
      entityType: EntityType.FEATURE_FLAG,
      entityId: 'feature-ai',
      changes: { enabled: true },
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      timestamp: '2024-01-13T11:00:00Z',
    },
  ]

  const getActionColor = (action: AuditAction) => {
    switch (action) {
      case AuditAction.CREATE:
        return 'success'
      case AuditAction.UPDATE:
        return 'info'
      case AuditAction.DELETE:
        return 'error'
      case AuditAction.ACTIVATE:
        return 'success'
      case AuditAction.DEACTIVATE:
        return 'warning'
      case AuditAction.SUSPEND:
        return 'error'
      case AuditAction.UNSUSPEND:
        return 'success'
      default:
        return 'default'
    }
  }

  const getEntityLabel = (entity: EntityType) => {
    switch (entity) {
      case EntityType.TENANT:
        return 'Tenant'
      case EntityType.BRANCH:
        return 'Branch'
      case EntityType.DEPARTMENT:
        return 'Department'
      case EntityType.TEAM:
        return 'Team'
      case EntityType.USER:
        return 'User'
      case EntityType.DESIGNATION:
        return 'Designation'
      case EntityType.LOCATION:
        return 'Location'
      case EntityType.BUSINESS_UNIT:
        return 'Business Unit'
      case EntityType.SETTINGS:
        return 'Settings'
      case EntityType.BRANDING:
        return 'Branding'
      case EntityType.FEATURE_FLAG:
        return 'Feature Flag'
      default:
        return entity
    }
  }

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = searchQuery === '' || 
      log.userId.includes(searchQuery) ||
      log.entityId.includes(searchQuery)
    const matchesAction = actionFilter === '' || log.action === actionFilter
    const matchesEntity = entityFilter === '' || log.entityType === entityFilter
    return matchesSearch && matchesAction && matchesEntity
  })

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Audit Logs
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        Track all changes made to your tenant configuration
      </Alert>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Action</InputLabel>
              <Select
                value={actionFilter}
                label="Action"
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <MenuItem value="">All Actions</MenuItem>
                <MenuItem value={AuditAction.CREATE}>Create</MenuItem>
                <MenuItem value={AuditAction.UPDATE}>Update</MenuItem>
                <MenuItem value={AuditAction.DELETE}>Delete</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Entity Type</InputLabel>
              <Select
                value={entityFilter}
                label="Entity Type"
                onChange={(e) => setEntityFilter(e.target.value)}
              >
                <MenuItem value="">All Entities</MenuItem>
                <MenuItem value={EntityType.TENANT}>Tenant</MenuItem>
                <MenuItem value={EntityType.BRANCH}>Branch</MenuItem>
                <MenuItem value={EntityType.DEPARTMENT}>Department</MenuItem>
                <MenuItem value={EntityType.TEAM}>Team</MenuItem>
                <MenuItem value={EntityType.USER}>User</MenuItem>
                <MenuItem value={EntityType.SETTINGS}>Settings</MenuItem>
                <MenuItem value={EntityType.BRANDING}>Branding</MenuItem>
                <MenuItem value={EntityType.FEATURE_FLAG}>Feature Flag</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => {
                setSearchQuery('')
                setActionFilter('')
                setEntityFilter('')
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Audit Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Entity Type</TableCell>
                <TableCell>Entity ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Changes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.action}
                      color={getActionColor(log.action) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {getEntityLabel(log.entityType)}
                  </TableCell>
                  <TableCell>
                    {log.entityId}
                  </TableCell>
                  <TableCell>
                    {log.userId}
                  </TableCell>
                  <TableCell>
                    {log.ipAddress}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {JSON.stringify(log.changes)}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No audit logs found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredLogs.length / 10)}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
        />
      </Box>
    </Container>
  )
}

export default TenantAudit
