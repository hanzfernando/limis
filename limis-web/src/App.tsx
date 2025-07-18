import ThemeToggleButton from './components/ThemeToggleButton'
import AppRouter from './routes/AppRouter'
import { ToastContainer } from 'react-toastify'
function App() {

  return (
    <>    
      <AppRouter />
      <ThemeToggleButton />
      <ToastContainer />
    </>
  )
}

export default App
