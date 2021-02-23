import React from 'react';
import Topnav from "../components/Navbar";

const AppLayout = ({ children }) => {
  return (
    <>
      <Topnav />
      {children}
    </>
  );
};

export default AppLayout;
