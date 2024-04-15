import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import React from 'react';


function App() {

  return (
    <>
    <ToastContainer theme='colored' position='top-center'></ToastContainer>
      <BrowserRouter>
      <Routes>
        <Route path='*' element={<Home/>}></Route>
      </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
