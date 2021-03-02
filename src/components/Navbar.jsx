import React, { lazy } from "react";
import { Container, Navbar } from "react-bootstrap";
import ProfileIcon from "../assets/icons/Profile.svg";
import DropwDownIcon from "../assets/icons/InvertedTriangle.svg";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { get } from "lodash";

const BrandLogoSvg = lazy(() => import("./BrandLogoSvg"));

const Topnav = () => {
  const {
    location: { pathname },
  } = useHistory();
  const user = useSelector(({ auth: { user } }) => user);
  const showShadow = pathname === "/" ? "" : "shadow-sm";
  return (
    <Navbar
      expand={`lg navigation-bar ${showShadow}`}
      style={{
        border: "none",
      }}
    >
      <Navbar.Brand href="home" className="ml-4 mr-1">
        <BrandLogoSvg />
      </Navbar.Brand>
      {pathname === "/dashboard" && (
        <>
          <Container className="ml-3">
            <input
              type="name"
              className="form-control search"
              aria-describedby="name"
              placeholder="Search purchases"
            />
          </Container>
          <div className="mr-5">
            <div className="btn p-0">
              <img src={ProfileIcon} />
            </div>
            <div className="btn p-0">
              <img src={DropwDownIcon} />
            </div>
          </div>
        </>
      )}
    </Navbar>
  );
};

export default Topnav;
