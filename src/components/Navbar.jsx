import React, { lazy } from "react";
import { Container, Navbar } from "react-bootstrap";
const BrandLogoSvg = lazy(() => import("./BrandLogoSvg"));

const Topnav = () => {
  return (
    <Navbar
      expand="lg shadow-sm"
      style={{
        background: "white",
      }}
    >
      <Container>
        <Navbar.Brand href="home">
          <BrandLogoSvg />
        </Navbar.Brand>

        <input
          type="email"
          className="form-control ml-4 search"
          aria-describedby="emailHelp"
          placeholder="Search purchases"
        />
      </Container>
    </Navbar>
  );
};

export default Topnav;
