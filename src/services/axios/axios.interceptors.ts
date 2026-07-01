import axiosInstance from './axios.config'

let store: any = null
let setLoadingAction: any = null

export const setStoreForInterceptors = (reduxStore: any, setLoading: any) => {
  store = reduxStore
  setLoadingAction = setLoading
}

// Loading interceptor
export const setupLoadingInterceptor = () => {
  let requestCount = 0

  axiosInstance.interceptors.request.use(
    (config) => {
      requestCount++
      if (requestCount === 1 && store && setLoadingAction) {
        store.dispatch(setLoadingAction({ isLoading: true, message: 'Loading...' }))
      }
      return config
    },
    (error) => {
      requestCount--
      if (requestCount === 0 && store && setLoadingAction) {
        store.dispatch(setLoadingAction({ isLoading: false }))
      }
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    (response) => {
      requestCount--
      if (requestCount === 0 && store && setLoadingAction) {
        store.dispatch(setLoadingAction({ isLoading: false }))
      }
      return response
    },
    (error) => {
      requestCount--
      if (requestCount === 0 && store && setLoadingAction) {
        store.dispatch(setLoadingAction({ isLoading: false }))
      }
      return Promise.reject(error)
    }
  )
}

// Logging interceptor
export const setupLoggingInterceptor = () => {
  axiosInstance.interceptors.request.use((config) => {
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data)
    }
    return config
  })

  axiosInstance.interceptors.response.use(
    (response) => {
      if (import.meta.env.DEV) {
        console.log(`[API Response] ${response.config.url}`, response.data)
      }
      return response
    },
    (error) => {
      if (import.meta.env.DEV) {
        console.error(`[API Error] ${error.config?.url}`, error.response?.data || error.message)
      }
      return Promise.reject(error)
    }
  )
}
