import LandingPage from './components/LandingPage'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'

const App = () => {
  return (
    <Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/dashboard" element={<Dashboard />} />
</Routes>
  )
}

export default App
