import { Box, Typography, Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Divider, Stack } from '@mui/material'
import { Add, BusinessOutlined, FileDownloadOutlined } from '@mui/icons-material'

export default function Tenants() {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4}>
        <Box>
          <Typography variant="h2" gutterBottom>Tenants</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your corporate clients and their respective organizational structures.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<FileDownloadOutlined />}>Export</Button>
          <Button variant="contained" startIcon={<Add />}>
            Add Tenant
          </Button>
        </Stack>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Organization</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} padding="none">
                  <Box sx={{ py: 10, textAlign: 'center' }}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: 'grey.100', color: 'grey.400', mx: 'auto', mb: 2 }}>
                      <BusinessOutlined />
                    </Avatar>
                    <Typography variant="h6">No tenants available</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start by adding a new tenant to manage their operations.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}
