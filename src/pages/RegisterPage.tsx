/* eslint-disable react/no-unescaped-entities */
import React, { FunctionComponent } from "react";
import { Mail } from "react-feather";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

const RegisterPage: FunctionComponent<RouteComponentProps> = () => {
  const responseGoogle = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    console.log(response);
  };

  const policyStyle = {
    textDecoration: "underline",
  };

  return (
    <div id="RegisterPage">
      <div className="container">
        <div className="row justify-content-center">
          <div className="text-need col-md-5 col-xl-4">
            <p className="text-center">Need to return or donate</p>
            <p className="text-center">purchases made in the past?</p>
            <p className="text-center">Let's go!</p>
            <form>
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
                          alt="name"
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
                      alt="icon"
                    />
                  </div>
                  Join With Apple
                </button>
              </div>
              <div>
                <p className="line-break">
                  <span>or</span>
                </p>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Your email..."
                />
              </div>
              <Link to="/request-permission" className="link">
                <button className="btn btn-lg btn-block btn-green mb-3">
                  <i className="fe fe-mail mr-3">
                    <Mail />
                  </i>
                  Join with email
                </button>
              </Link>
              <div className="text-left">
                <small className="text-muted text-left">
                  By joining Noted you agree to our{" "}
                  <a
                    href="https://www.notedreturns.com/terms-and-conditions"
                    style={policyStyle}
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://www.notedreturns.com/privacy-policy"
                    style={policyStyle}
                  >
                    Privacy
                  </a>
                  . Protected by Google's{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    style={policyStyle}
                  >
                    Privacy
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://policies.google.com/terms"
                    style={policyStyle}
                  >
                    Terms
                  </a>
                  .
                </small>
              </div>
            </form>
            <h3 className="text-already">
              Already a member?{" "}
              <Link to="login" className="text-decoration-underline text-login">
                {" "}
                Log in
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
