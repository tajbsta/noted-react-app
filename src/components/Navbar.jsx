import React, { lazy } from "react";
import { Container, Navbar } from "react-bootstrap";

const BrandLogoSvg = lazy(() => import("./BrandLogoSvg"));

const Topnav = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="home">
          <BrandLogoSvg />
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Topnav;
