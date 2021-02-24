import React, { lazy } from "react";
import { Container, Navbar } from "react-bootstrap";
const BrandLogoSvg = lazy(() => import("./BrandLogoSvg"));

const Topnav = () => {
  return (
    <Navbar expand="lg shadow-sm navigation-bar">
      <Navbar.Brand href="home" className="ml-4 mr-1">
        <BrandLogoSvg />
      </Navbar.Brand>
      <Container className="ml-3">
        <input
          type="email"
          className="form-control search"
          aria-describedby="emailHelp"
          placeholder="Search purchases"
        />
      </Container>
    </Navbar>
  );
};

export default Topnav;
