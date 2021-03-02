/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Mail } from "react-feather";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Form } from "react-bootstrap";

export default function ForgotPasswordPage() {
  let history = useHistory();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

  const sendResetLink = () => {
    history.push("/");
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

  return (
    <div id="ForgotPasswordPage">
      <div>
        <div className="row justify-content-center">
          <div className="text-header-title col-md-5 col-xl-4">
            <p className="text-center">Forgot password?</p>
            <p className="text-center">Let's go!</p>
            <div className="text-enter">
              <p>
                Enter the email address you used when you joined and we’ll send
                you instructions to reset your password.
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
              <button
                className="btn btn-lg btn-block btn-green mb-3 btn-submit"
                type="submit"
                disabled={isSubmitting}
                onClick={sendResetLink}
              >
                <i className="fe fe-mail">
                  <Mail />
                </i>
                Send Reset Instructions
              </button>
            </Form>
            <h3 className="text-go-back">
              <Link to="login" className="text-decoration-underline text-link">
                {" "}
                Go back
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
