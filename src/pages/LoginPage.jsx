/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Mail, ArrowRight } from "react-feather";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Form, FormGroup, FormControl } from "react-bootstrap";
import Amplify, { Auth } from "aws-amplify";
import { login, signUp } from "../actions/auth.action";

export default function RegisterPage() {
  let history = useHistory();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

  const register = () => {
    console.log({ email, password });
    setError(null);
    setIsSubmitting(true);

    console.log("===signup in cognito");
    Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
      },
    })
      .then((data) => {
        dispatch(signUp(data.user));
        history.push("/request-permission");
      })
      .catch((error) => {
        console.log("Error", error);
        setError(error.message);
        setIsSubmitting(false);
      }); // TODO: handle validation
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
                onClick={() => Auth.federatedSignIn({ provider: "Google" })}
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
                Continue with Google
              </button>
            </div>
            <div>
              <p className="line-break">
                <span>or</span>
              </p>
            </div>
            <Form>
              {error && <div>{error.message}</div>}
              <Form.Group>
                <Form.Control
                  className="form-control form-control-lg"
                  type="email"
                  name="email"
                  placeholder="Your email..."
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  className="form-control form-control-lg"
                  type="password"
                  name="password"
                  placeholder="Your password..."
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <h3 className="text-forgot">
                <Link to="join" className="text-decoration-underline">
                  Forgot Password?
                </Link>
              </h3>
              <button
                className="btn btn-lg btn-block btn-green mb-3"
                type="submit"
                disabled={isSubmitting}
                onClick={register}
              >
                <i className="fe fe-mail mr-3">
                  <ArrowRight />
                </i>
                Sign In
              </button>
            </Form>
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
              Not a member?{" "}
              <Link to="join" className="text-decoration-underline text-login">
                {" "}
                Sign up now
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
