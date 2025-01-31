
import { Route, Routes } from 'react-router-dom'
import Login from './components/login'
import MainContent from './components/mainContent'
import './styles/dashboard.css'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<MainContent/>}/>
      </Routes>
    </>
  )
}

export default App
