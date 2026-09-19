import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import AppRoutes from './routes/AppRoutes'

function ThemedToaster() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    const apply = () => setDark(document.documentElement.classList.contains('dark'))
    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return <Toaster position="top-right" richColors theme={dark ? 'dark' : 'light'} />
}


function App() {
  return (
    <>
      <ThemedToaster />
      <AppRoutes />
    </>
  )
}

export default App