import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoutes from './components/ProtectedRoutes';
import TripPage from './pages/TripPage';
import UpdateTripPage from './pages/UpdateTripPage';
import CreateTripPage from './pages/CreateTripPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'

function Logout() {
  localStorage.clear()
  return <LoginPage/>
}

function LogoutAndRegister(){
  localStorage.clear()
  return <RegisterPage/>
}

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
          <Route path="/trips"
          element={
            <ProtectedRoutes>
              <TripPage/>
            </ProtectedRoutes>
          }/>
          <Route path="/trips/create"
          element={
            <ProtectedRoutes>
              <CreateTripPage/>
            </ProtectedRoutes>
          }/>
          <Route path="/trips/:id"
          element={
            <ProtectedRoutes>
              <UpdateTripPage/>
            </ProtectedRoutes>
          }/>
          
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<LogoutAndRegister/>}/>
          <Route path='/logout' element={<Logout/>}/>
          <Route path='*' element={<NotFoundPage/>}/>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
