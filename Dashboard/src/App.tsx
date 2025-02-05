import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/login'
import AdminDashboard from './components/mainContent'
import AnalystDashboard from './components/mainContent2'
import DeveloperDashboard from './components/mainContent3'
import DesignerDashboard from './components/mainContent4'
import './styles/dashboard.css'
import './styles/sidebar.css'
import './styles/login.css'
import { ProjectProvider } from './context/ProjectContext'
import ProtectedRoute from './components/ProtectedRoute'
import Unasigned from './components/Navbar'
const App: React.FC = () => {
  return (
    <ProjectProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/dashboard2" element={
          <ProtectedRoute allowedRoles={['analyst']}>
            <AnalystDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/dashboard3" element={
          <ProtectedRoute allowedRoles={['developer']}>
            <DeveloperDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/dashboard4" element={
          <ProtectedRoute allowedRoles={['designer']}>
            <DesignerDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/*" element={<Unasigned />} />
      </Routes>
    </ProjectProvider>
  )

}

export default App
