import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'

import { GlobalContextContent } from './store/TheGlobalState.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalContextContent>
      <App />
    </GlobalContextContent>
  </React.StrictMode>,
)
