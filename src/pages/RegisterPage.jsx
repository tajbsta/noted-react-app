/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Mail } from "react-feather";
import { Link, useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Amplify, { Auth } from "aws-amplify";

export default function RegisterPage() {
  let history = useHistory();

  const signUp = ({ email, password }) => {
    console.log("===signup in cognito");
    Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
      },
    })
      .then((user) => console.log("Success", user))
      .catch((err) => history.push("/request-permission"));
  };

  const policyStyle = {
    textDecoration: "underline",
  };

  return (
    <div id="RegisterPage">
      <div>
        <div className="row justify-content-center">
          <div className="text-need col-md-5 col-xl-4">
            <p className="text-center">Need to return or donate</p>
            <p className="text-center">purchases made in the past?</p>
            <p className="text-center">Let's go!</p>
            <div
              className="form-group"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                className="btn btn-md btn-block btn-google"
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
            {/* <div
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
            </div> */}
            <div>
              <p className="line-break">
                <span>or</span>
              </p>
            </div>
            <Formik
              className="form-group-signup"
              initialValues={{ email: "", password: "" }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  // errors.email = "Required";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  // errors.email = "Invalid email address";
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                console.log("values", values);
                setTimeout(() => {
                  // alert(JSON.stringify(values, null, 2));
                  signUp(values);
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <ErrorMessage name="email" component="h3" />
                  <ErrorMessage name="password" component="h3" />
                  <Field
                    className="form-control form-control-lg"
                    type="email"
                    name="email"
                    placeholder="Your email..."
                  />
                  <Field
                    className="form-control form-control-lg"
                    type="password"
                    name="password"
                    placeholder="Your password..."
                  />
                  {/* <Link to="/request-permission" className="link"> */}
                  <button
                    onClick={signUp}
                    className="btn btn-lg btn-block btn-green mb-3"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <i className="fe fe-mail mr-3">
                      <Mail />
                    </i>
                    Join with email
                  </button>
                  {/* </Link> */}
                </Form>
              )}
            </Formik>
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
                <a href="https://policies.google.com/terms" style={policyStyle}>
                  Terms
                </a>
                .
              </small>
            </div>
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
}
