import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoutes from './components/ProtectedRoutes';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path="/dashboard"
          element={
            <ProtectedRoutes>

            </ProtectedRoutes>
          }/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='*' element={<NotFoundPage/>}/>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
