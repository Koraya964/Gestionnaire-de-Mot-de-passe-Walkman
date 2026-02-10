import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import RegisterPage from './pages/auth/RegisterPage'
import Home from './pages/Home'
import LoginPage from './pages/auth/LoginPage'
import NavBar from './components/NavBar'
import Footer from './components/Footer'




const App = () => {


  return (

    
  <BrowserRouter>

  <NavBar/>
  
  <Routes>

    <Route path ='/' element = {<Home/>}> </Route>

    <Route path ='/register' element = {<RegisterPage/>}></Route>

     <Route path ='/login' element = {<LoginPage/>}></Route>

     <Route path ='/dashboard' element = {</>}></Route>

  </Routes>
  
  <Footer/>
  
  
  </BrowserRouter>
  )
}

export default App