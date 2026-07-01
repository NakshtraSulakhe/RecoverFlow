import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider } from './contexts'
import App from './App'
import { store } from './redux/store'
import { GlobalErrorBoundary } from './components/common/GlobalErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </GlobalErrorBoundary>
  </React.StrictMode>,
)
