/* eslint-disable react/prop-types */
import React from 'react';
import { ToastContainer } from 'react-toastify';
import Topnav from '../components/Navbar/Navbar';

const AppLayout = ({ children }) => {
  return (
    <>
      <ToastContainer />
      <Topnav />
      {children}
    </>
  );
};

export default AppLayout;
