
import { Route, Routes } from 'react-router-dom'
import Login from './components/login'
import Header from './components/header'
import MainContent from './components/mainContent'

function App() {
  return (
    <>
    <Header/>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<MainContent/>}/>
      </Routes>
    </>
  )
}

export default App
