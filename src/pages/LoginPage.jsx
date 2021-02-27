/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Mail } from "react-feather";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Amplify, { Auth } from "aws-amplify";
import { login } from "../actions/auth.action";

export default function LoginPage() {
  let history = useHistory();
  const dispatch = useDispatch();

  const login = ({ email, password }) => {
    // console.log({ email, password });

    console.log("===signI in cognito");
    Auth.signIn({
      username: email,
      password,
      attributes: {
        email,
      },
    })
      .then((data) => {
        dispatch(login(data.user));
        history.push("/request-permission");
      })
      .catch((err) => console.log("Error", err)); // TODO: handle validation
  };

  function validateEmail(value) {
    let error;
    if (!value) {
      error = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }
    return error;
  }

  const policyStyle = {
    textDecoration: "underline",
  };

  return (
    <div id="LoginPage">
      <div>
        <div className="row justify-content-center">
          <div className="text-need col-md-5 col-xl-4">
            {/* <p className="text-center">Need to return or donate</p>
            <p className="text-center">purchases made in the past?</p> */}
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
                Sign In With Google
              </button>
            </div>
            <div>
              <p className="line-break">
                <span>or</span>
              </p>
            </div>
            <Formik
              className="form-group-signup"
              //   initialValues={{ email: "", password: "" }}
              //   onSubmit={(values, { setSubmitting }) => {
              //     // signUp(values);
              //     setSubmitting(false);
              //   }}
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
                    validate={validateEmail}
                  />
                  <Field
                    className="form-control form-control-lg"
                    type="password"
                    name="password"
                    placeholder="Your password..."
                  />
                  <button
                    // onClick={signUp}
                    className="btn btn-lg btn-block btn-green mb-3"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <i className="fe fe-mail mr-3">
                      <Mail />
                    </i>
                    Sign in with email
                  </button>
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
              Don't have an account?{" "}
              <Link to="join" className="text-decoration-underline text-login">
                {" "}
                Sign Up
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
