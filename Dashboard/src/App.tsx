import { Route, Routes } from 'react-router-dom'
import Login from './components/login'
import MainContent from './components/mainContent'
import './styles/dashboard.css'
import './styles/sidebar.css'
import './styles/login.css'
import { ProjectProvider } from './context/ProjectContext'
import DeveloperDashboard from './components/mainContent3'
import DesignerDashboard from './components/mainContent4'
import MainContent2 from './components/mainContent2'

function App() {
  return (
      <ProjectProvider>
        <div className="app">
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/dashboard' element={<MainContent/>}/>
            <Route path='/dashboard2' element={<MainContent2/>}/>
            <Route path='/dashboard3' element={<DeveloperDashboard/>}/>
            <Route path='/dashboard4' element={<DesignerDashboard/>}/>
            <Route path='/perfil' element={<MainContent/>}/>
          </Routes>
        </div>
      </ProjectProvider>
  )
}

export default App
