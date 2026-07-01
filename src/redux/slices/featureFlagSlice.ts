import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TenantFeatures } from '../../features/tenant/types'

interface FeatureFlagState {
  features: TenantFeatures
  isLoading: boolean
}

const initialState: FeatureFlagState = {
  features: {
    ai: { enabled: false },
    payments: { enabled: false },
    legal: { enabled: false },
    reports: { enabled: true },
    workflows: { enabled: false },
    notifications: { enabled: true },
    api: { enabled: true },
    integrations: { enabled: false },
    advancedAnalytics: { enabled: false },
    customFields: { enabled: false },
    multiCurrency: { enabled: false },
    multiLanguage: { enabled: false },
  },
  isLoading: false,
}

const featureFlagSlice = createSlice({
  name: 'featureFlag',
  initialState,
  reducers: {
    setFeatures: (state, action: PayloadAction<TenantFeatures>) => {
      state.features = action.payload
    },
    updateFeature: (state, action: PayloadAction<{ key: keyof TenantFeatures; value: boolean }>) => {
      const { key, value } = action.payload
      if (state.features[key]) {
        state.features[key].enabled = value
      }
    },
    setFeatureLimit: (state, action: PayloadAction<{ key: keyof TenantFeatures; limit: number | undefined }>) => {
      const { key, limit } = action.payload
      if (state.features[key]) {
        state.features[key].limit = limit
      }
    },
  },
})

export const { setFeatures, updateFeature, setFeatureLimit } = featureFlagSlice.actions
export default featureFlagSlice.reducer
