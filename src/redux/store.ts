import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authReducer from './slices/authSlice'
import tenantReducer from './slices/tenantSlice'
import userReducer from './slices/userSlice'
import customerReducer from './slices/customerSlice'
import caseReducer from './slices/caseSlice'
import recoveryReducer from './slices/recoverySlice'
import paymentReducer from './slices/paymentSlice'
import uiReducer, { setLoading } from './slices/uiSlice'
import aiAssistantReducer from './slices/aiAssistantSlice'
import priorityScoringReducer from './slices/priorityScoringSlice'
import ptpTrackerReducer from './slices/ptpTrackerSlice'
import communicationReducer from './slices/communicationSlice'
import { setStore } from '../services/axios/axios.config'
import { setStoreForInterceptors } from '../services/axios/axios.interceptors'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenant: tenantReducer,
    user: userReducer,
    customer: customerReducer,
    case: caseReducer,
    recovery: recoveryReducer,
    payment: paymentReducer,
    ui: uiReducer,
    aiAssistant: aiAssistantReducer,
    priorityScoring: priorityScoringReducer,
    ptpTracker: ptpTrackerReducer,
    communication: communicationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.DEV,
})

// Set the store for axios interceptors
setStore(store)
setStoreForInterceptors(store, setLoading)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
