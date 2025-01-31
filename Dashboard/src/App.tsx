import { Route, Routes } from 'react-router-dom'
import Login from './components/login'
import MainContent from './components/mainContent'
import './styles/dashboard.css'
import './styles/sidebar.css'
import './styles/login.css'
import { ProjectProvider } from './context/ProjectContext'

function App() {
  return (
      <ProjectProvider>
        <div className="app">
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/dashboard' element={<MainContent/>}/>
          </Routes>
        </div>
      </ProjectProvider>
  )
}

export default App
