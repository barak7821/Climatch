import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Weather from './pages/Weather.jsx'
import NotFound from './pages/NotFound.jsx'
import WakeUp from './pages/WakeUp.jsx'

function App() {
  return (
    <Routes>
      <Route index element={<WakeUp />} />
      <Route path="/home" element={<Home />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
