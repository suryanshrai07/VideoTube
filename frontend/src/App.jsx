import { useState } from 'react'
import Home from './components/Home'
import { Routes,Route,Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

function App() {


  return (
    <div>
      
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/sign-in" element={<SignIn/>} />
      </Routes>
    </div>
  )
}

export default App
