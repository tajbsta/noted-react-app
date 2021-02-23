import React from 'react';
import { Container, Navbar } from 'react-bootstrap';

const Topnav = () => {
 return (
  <Navbar bg="light" expand="lg">
   <Container>
    <Navbar.Brand href="#home">Noted</Navbar.Brand>
   </Container>
  </Navbar>
 );
};

export default Topnav;
