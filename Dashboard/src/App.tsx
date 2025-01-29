
import { Route, Routes } from 'react-router-dom'
import Login from './components/login'
import Header from './components/header'

function App() {
  return (
    <>
      <Routes>
        <Route path='./components/header.tsx' element={<Header/>}/>
        <Route path='./components/login.tsx' element={<Login/>}/>
      </Routes>
      <Login/>  
    </>
  )
}

export default App
