import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import './index.css'
import App from './App.tsx'

// Add platform class for Android-specific responsive styles
const platform = Capacitor.getPlatform()
if (platform === 'android') {
  document.documentElement.classList.add('platform-android')
} else if (platform === 'ios') {
  document.documentElement.classList.add('platform-ios')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
