
import { Route, Routes } from 'react-router-dom'
import Login from './components/login'

function App() {
  return (
    <>
      <Routes>
        <Route path='./components/login.tsx' element={<Login/>}/>
      </Routes>
      <Login/>  
    </>
  )
}

export default App
