import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  tenantId: string
}

interface UserState {
  users: User[]
  loading: boolean
}

const initialState: UserState = {
  users: [],
  loading: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setUsers, setLoading } = userSlice.actions
export default userSlice.reducer
