import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { Tenant } from '../../features/tenant/types'

interface TenantState {
  tenants: Tenant[]
  currentTenant: Tenant | null
  recentTenants: string[]
  favoriteTenants: string[]
  isLoading: boolean
  error: string | null
}

const initialState: TenantState = {
  tenants: [],
  currentTenant: null,
  recentTenants: [],
  favoriteTenants: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchTenants = createAsyncThunk(
  'tenant/fetchTenants',
  async (_, { rejectWithValue }) => {
    try {
      // This would call the tenant service
      // const response = await tenantService.getTenants()
      // return response
      return [] as Tenant[]
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tenants')
    }
  }
)

export const fetchCurrentTenant = createAsyncThunk(
  'tenant/fetchCurrentTenant',
  async (_tenantId: string, { rejectWithValue }) => {
    try {
      // This would call the tenant service
      // const response = await tenantService.getTenant(tenantId)
      // return response
      return null as Tenant | null
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tenant')
    }
  }
)

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setCurrentTenant: (state, action: PayloadAction<Tenant>) => {
      state.currentTenant = action.payload
      // Add to recent tenants
      if (!state.recentTenants.includes(action.payload.id)) {
        state.recentTenants.unshift(action.payload.id)
        if (state.recentTenants.length > 5) {
          state.recentTenants.pop()
        }
      }
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.favoriteTenants.includes(action.payload)) {
        state.favoriteTenants.push(action.payload)
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favoriteTenants = state.favoriteTenants.filter(id => id !== action.payload)
    },
    clearCurrentTenant: (state) => {
      state.currentTenant = null
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tenants
      .addCase(fetchTenants.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.isLoading = false
        state.tenants = action.payload
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Failed to fetch tenants'
      })
      // Fetch current tenant
      .addCase(fetchCurrentTenant.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCurrentTenant.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentTenant = action.payload
      })
      .addCase(fetchCurrentTenant.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Failed to fetch tenant'
      })
  },
})

export const { setCurrentTenant, addToFavorites, removeFromFavorites, clearCurrentTenant, setError, clearError } = tenantSlice.actions
export default tenantSlice.reducer
