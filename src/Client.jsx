import React, { useState } from 'react';
import HeaderLayout from './component/layout/header';
import FooterLayout from './component/layout/footer';
import { Outlet } from 'react-router-dom';
import HeaderClientLayout from './component/ClientLayout/headerClientLayout';
import FooterClientLayout from './component/clientLayout/footerClientLayout';

const Client =() => {
  return(
    <>
      <HeaderClientLayout/>
      <div> Client </div>
      <FooterClientLayout/>
   
   
    </>
  );
}
export default Client ;