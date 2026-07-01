import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UIState {
  isLoading: boolean
  loadingMessage?: string
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'system'
  breadcrumbs: Array<{ label: string; path?: string }>
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    autoHide?: boolean
    duration?: number
  }>
  modal: {
    open: boolean
    title?: string
    content?: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }
  drawer: {
    open: boolean
    content?: React.ReactNode
    anchor?: 'left' | 'right' | 'top' | 'bottom'
  }
}

const initialState: UIState = {
  isLoading: false,
  loadingMessage: undefined,
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: 'system',
  breadcrumbs: [],
  notifications: [],
  modal: {
    open: false,
  },
  drawer: {
    open: false,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.isLoading = action.payload.isLoading
      state.loadingMessage = action.payload.message
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload
    },
    setBreadcrumbs: (state, action: PayloadAction<Array<{ label: string; path?: string }>>) => {
      state.breadcrumbs = action.payload
    },
    addNotification: (
      state,
      action: PayloadAction<{
        type: 'success' | 'error' | 'warning' | 'info'
        message: string
        autoHide?: boolean
        duration?: number
      }>
    ) => {
      const id = Date.now().toString()
      state.notifications.push({
        id,
        ...action.payload,
      })
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    openModal: (
      state,
      action: PayloadAction<{
        title?: string
        content?: React.ReactNode
        size?: 'sm' | 'md' | 'lg' | 'xl'
      }>
    ) => {
      state.modal = {
        open: true,
        ...action.payload,
      }
    },
    closeModal: (state) => {
      state.modal = {
        open: false,
      }
    },
    openDrawer: (
      state,
      action: PayloadAction<{
        content?: React.ReactNode
        anchor?: 'left' | 'right' | 'top' | 'bottom'
      }>
    ) => {
      state.drawer = {
        open: true,
        ...action.payload,
      }
    },
    closeDrawer: (state) => {
      state.drawer = {
        open: false,
      }
    },
  },
})

export const {
  setLoading,
  setSidebarOpen,
  setSidebarCollapsed,
  setTheme,
  setBreadcrumbs,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  openDrawer,
  closeDrawer,
} = uiSlice.actions

export default uiSlice.reducer
