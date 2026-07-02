import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Avatar, 
  Chip,
  IconButton,
  InputBase,
  Divider,
  Stack
} from '@mui/material'
import { 
  Add, 
  Search, 
  FilterList, 
  MoreVert, 
  PersonOutline, 
  MailOutline, 
  LocalPhoneOutlined,
  FileDownloadOutlined
} from '@mui/icons-material'

export default function Customers() {
  const hasData = false // Simulate empty state

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4}>
        <Box>
          <Typography variant="h2" gutterBottom>Customers</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your debt recovery portfolio and track customer interactions.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<FileDownloadOutlined />}>Export</Button>
          <Button variant="contained" startIcon={<Add />}>
            Add Customer
          </Button>
        </Stack>
      </Box>

      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            bgcolor: 'grey.100', 
            px: 2, 
            py: 0.75, 
            borderRadius: 2,
            flex: 1,
            maxWidth: 400
          }}>
            <Search fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              placeholder="Search customers by name, email..."
              sx={{ fontSize: 14, flex: 1 }}
            />
          </Box>
          <Button startIcon={<FilterList />} sx={{ color: 'text.secondary' }}>Filters</Button>
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer Details</TableCell>
                <TableCell>Contact Information</TableCell>
                <TableCell>Total Debt</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hasData ? (
                // Sample data rows would go here
                <TableRow />
              ) : (
                <TableRow>
                  <TableCell colSpan={5} padding="none">
                    <Box sx={{ 
                      py: 12, 
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <Avatar sx={{ width: 64, height: 64, bgcolor: 'grey.100', color: 'grey.400' }}>
                        <PersonOutline sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">No customers found</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Try adjusting your filters or add a new customer to get started.
                        </Typography>
                      </Box>
                      <Button variant="contained" startIcon={<Add />} sx={{ mt: 1 }}>
                        Add Your First Customer
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}
