
import React, { useState } from 'react';


import { Outlet } from 'react-router-dom';
import Header from './pages/ClientLayout/Header';
import Footer from './pages/ClientLayout/Footer';

const App =() => {
  return(
    <>
    <Header/>
    <Outlet/>
    <Footer/>

    </>
  );
}
export default App;