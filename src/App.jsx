
import React, { useState } from 'react';
import HeaderLayout from './component/layout/header';
import FooterLayout from './component/layout/footer';
import { Outlet } from 'react-router-dom';

const App =() => {
  return(
    <>
    <HeaderLayout />
    <Outlet/>
    <FooterLayout/>
    </>
  );
}
export default App;