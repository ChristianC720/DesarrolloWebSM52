import { Route, Routes } from 'react-router-dom'
import Login from './components/login'
import MainContent from './components/mainContent'
import Perfil from './components/perfil'
import './styles/dashboard.css'
import './styles/sidebar.css'
import './styles/login.css'
import { ProjectProvider } from './context/ProjectContext'
import { RoleProvider } from './context/RoleContext'

function App() {
  return (
    <RoleProvider>
      <ProjectProvider>
        <div className="app">
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/dashboard' element={<MainContent/>}/>
            <Route path='/perfil' element={<Perfil/>}/>
          </Routes>
        </div>
      </ProjectProvider>
    </RoleProvider>
  )
}

export default App
