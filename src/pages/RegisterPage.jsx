/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Mail } from "react-feather";
import GoogleLogin from "react-google-login";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const responseGoogle = (response) => {
    console.log(response);
  };
  return (
    <div>
      <div classNameName="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-5 col-xl-4 my-5">
            <p className="text-center">Need to return or donate</p>
            <p className="text-center">purchases made in the past?</p>
            <p className="text-center">Let's go!</p>
            <form className="mb-3">
              <GoogleLogin
                clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                render={() => (
                  <div
                    className="form-group"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      className="btn btn-md btn-block"
                      style={{
                        background: "white",
                        boxShadow: "0px 0px 4px 0.5px rgba(0,0,0,0.1)",
                        color: "#690098",
                        fontWeight: "normal",
                      }}
                    >
                      <div className="avatar avatar-xs mr-2">
                        <img
                          className="avatar-img"
                          src="https://i.pinimg.com/originals/39/21/6d/39216d73519bca962bd4a01f3e8f4a4b.png"
                        />
                      </div>
                      Join With Google
                    </button>
                  </div>
                )}
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
              />
              <div
                className="form-group"
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  className="btn btn-md btn-block"
                  style={{
                    background: "white",
                    boxShadow: "0px 0px 4px 0.5px rgba(0,0,0,0.1)",
                    color: "#690098",
                    fontWeight: "normal",
                  }}
                >
                  <div className="avatar avatar-xs mr-2">
                    <img
                      className="avatar-img"
                      src="https://i.pinimg.com/originals/39/21/6d/39216d73519bca962bd4a01f3e8f4a4b.png"
                    />
                  </div>
                  Join With Apple
                </button>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Your email..."
                />
              </div>
              <button className="btn btn-lg btn-block btn-success mb-3">
                <i className="fe fe-mail mr-3">
                  <Mail />
                </i>
                Join with email
              </button>
              <div className="text-center">
                <small className="text-muted text-center">
                  By joining Noted you agree to our Terms of Service and
                  Privacy. Protected by Google's Privacy and Terms.
                </small>
              </div>
            </form>
            <h3>
              Already a member?
              <Link
                to="login"
                className="text-success text-decoration-underline"
                style={{}}
              >
                Log in
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
