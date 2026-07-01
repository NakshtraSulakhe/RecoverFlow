/**
 * Tenant Switcher Component
 * Enterprise tenant selection with search, favorites, and recent tenants
 */

import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Avatar,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material'
import {
  Business as BusinessIcon,
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  History as HistoryIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material'
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux'
import { setCurrentTenant, addToFavorites, removeFromFavorites, fetchTenants } from '../../redux/slices/tenantSlice'
import { Tenant, TenantStatus } from '../../features/tenant/types'

export const TenantSwitcher: React.FC = () => {
  const dispatch = useAppDispatch()
  const anchorRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { tenants, currentTenant, favoriteTenants, recentTenants, isLoading } = useAppSelector(
    (state: any) => state.tenant
  )

  useEffect(() => {
    dispatch(fetchTenants())
  }, [dispatch])

  const handleToggle = () => {
    setOpen(!open)
    setSearchQuery('')
  }

  const handleClose = () => {
    setOpen(false)
    setSearchQuery('')
  }

  const handleSelectTenant = (tenant: Tenant) => {
    dispatch(setCurrentTenant(tenant))
    handleClose()
  }

  const handleToggleFavorite = (e: React.MouseEvent, tenantId: string) => {
    e.stopPropagation()
    if (favoriteTenants.includes(tenantId)) {
      dispatch(removeFromFavorites(tenantId))
    } else {
      dispatch(addToFavorites(tenantId))
    }
  }

  const filteredTenants = tenants.filter((tenant: Tenant) =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const favoriteTenantsList = tenants.filter((t: Tenant) => favoriteTenants.includes(t.id))
  const recentTenantsList = tenants.filter((t: Tenant) => recentTenants.includes(t.id))
  const otherTenants = filteredTenants.filter(
    (t: Tenant) => !favoriteTenants.includes(t.id) && !recentTenants.includes(t.id)
  )

  const getStatusColor = (status: TenantStatus) => {
    switch (status) {
      case TenantStatus.ACTIVE:
        return 'success'
      case TenantStatus.SUSPENDED:
        return 'error'
      case TenantStatus.TRIAL:
        return 'info'
      case TenantStatus.EXPIRED:
        return 'warning'
      default:
        return 'default'
    }
  }

  const renderTenantItem = (tenant: Tenant, showFavorite = true) => (
    <MenuItem
      key={tenant.id}
      selected={currentTenant?.id === tenant.id}
      onClick={() => handleSelectTenant(tenant)}
      sx={{
        py: 1.5,
        px: 2,
      }}
    >
      <Avatar
        src={tenant.logo}
        alt={tenant.name}
        sx={{ width: 32, height: 32, mr: 2 }}
      >
        {tenant.name.charAt(0)}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap>
          {tenant.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {tenant.code}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          label={tenant.status}
          size="small"
          color={getStatusColor(tenant.status) as any}
          sx={{ fontSize: '0.65rem', height: 20 }}
        />
        {showFavorite && (
          <IconButton
            size="small"
            onClick={(e) => handleToggleFavorite(e, tenant.id)}
            sx={{ ml: 0.5 }}
          >
            {favoriteTenants.includes(tenant.id) ? (
              <StarIcon fontSize="small" color="warning" />
            ) : (
              <StarBorderIcon fontSize="small" />
            )}
          </IconButton>
        )}
      </Box>
    </MenuItem>
  )

  return (
    <>
      <Button
        ref={anchorRef}
        onClick={handleToggle}
        startIcon={
          <Avatar
            src={currentTenant?.logo}
            alt={currentTenant?.name}
            sx={{ width: 28, height: 28 }}
          >
            {currentTenant?.name.charAt(0)}
          </Avatar>
        }
        endIcon={<ArrowDropDownIcon />}
        sx={{
          textTransform: 'none',
          justifyContent: 'flex-start',
          px: 1.5,
          minWidth: 200,
        }}
      >
        <Box sx={{ textAlign: 'left', ml: 1, flex: 1, minWidth: 0 }}>
          <Typography variant="body2" noWrap fontWeight={500}>
            {currentTenant?.name || 'Select Tenant'}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {currentTenant?.code}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 480,
            mt: 1,
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {/* Search */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search tenants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            autoFocus
          />
        </Box>

        <Divider />

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            {/* Favorites */}
            {favoriteTenantsList.length > 0 && searchQuery === '' && (
              <>
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon fontSize="inherit" />
                    Favorites
                  </Typography>
                </Box>
                {favoriteTenantsList.map((tenant: any) => renderTenantItem(tenant))}
                <Divider />
              </>
            )}

            {/* Recent */}
            {recentTenantsList.length > 0 && searchQuery === '' && (
              <>
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <HistoryIcon fontSize="inherit" />
                    Recent
                  </Typography>
                </Box>
                {recentTenantsList.map((tenant: any) => renderTenantItem(tenant))}
                <Divider />
              </>
            )}

            {/* All Tenants */}
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {searchQuery ? 'Search Results' : 'All Tenants'}
              </Typography>
            </Box>
            {otherTenants.length > 0 ? (
              otherTenants.map((tenant: any) => renderTenantItem(tenant))
            ) : (
              <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No tenants found
                </Typography>
              </Box>
            )}
          </>
        )}
      </Menu>
    </>
  )
}
