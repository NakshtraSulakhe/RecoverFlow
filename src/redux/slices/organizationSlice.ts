import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { Branch, Department, Team, Designation, Location, BusinessUnit } from '../../features/tenant/types'

interface OrganizationState {
  branches: Branch[]
  departments: Department[]
  teams: Team[]
  designations: Designation[]
  locations: Location[]
  businessUnits: BusinessUnit[]
  isLoading: boolean
  error: string | null
}

const initialState: OrganizationState = {
  branches: [],
  departments: [],
  teams: [],
  designations: [],
  locations: [],
  businessUnits: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchBranches = createAsyncThunk(
  'organization/fetchBranches',
  async (_, { rejectWithValue }) => {
    try {
      return [] as Branch[]
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch branches')
    }
  }
)

export const fetchDepartments = createAsyncThunk(
  'organization/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      return [] as Department[]
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch departments')
    }
  }
)

export const fetchTeams = createAsyncThunk(
  'organization/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      return [] as Team[]
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teams')
    }
  }
)

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    addBranch: (state, action: PayloadAction<Branch>) => {
      state.branches.push(action.payload)
    },
    updateBranch: (state, action: PayloadAction<Branch>) => {
      const index = state.branches.findIndex(b => b.id === action.payload.id)
      if (index !== -1) {
        state.branches[index] = action.payload
      }
    },
    deleteBranch: (state, action: PayloadAction<string>) => {
      state.branches = state.branches.filter(b => b.id !== action.payload)
    },
    addDepartment: (state, action: PayloadAction<Department>) => {
      state.departments.push(action.payload)
    },
    updateDepartment: (state, action: PayloadAction<Department>) => {
      const index = state.departments.findIndex(d => d.id === action.payload.id)
      if (index !== -1) {
        state.departments[index] = action.payload
      }
    },
    deleteDepartment: (state, action: PayloadAction<string>) => {
      state.departments = state.departments.filter(d => d.id !== action.payload)
    },
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload)
    },
    updateTeam: (state, action: PayloadAction<Team>) => {
      const index = state.teams.findIndex(t => t.id === action.payload.id)
      if (index !== -1) {
        state.teams[index] = action.payload
      }
    },
    deleteTeam: (state, action: PayloadAction<string>) => {
      state.teams = state.teams.filter(t => t.id !== action.payload)
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
      .addCase(fetchBranches.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.isLoading = false
        state.branches = action.payload
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.teams = action.payload
      })
  },
})

export const {
  addBranch,
  updateBranch,
  deleteBranch,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  addTeam,
  updateTeam,
  deleteTeam,
  setError,
  clearError,
} = organizationSlice.actions

export default organizationSlice.reducer
