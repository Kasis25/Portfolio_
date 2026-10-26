import { createRoot } from 'react-dom/client'
import '@fontsource/anton'
import '@fontsource-variable/inter-tight'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import './styles.css'
import App from './App'

// No StrictMode: the scroll engine owns timing and must not double-mount.
createRoot(document.getElementById('root')!).render(<App />)
