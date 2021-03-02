/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Form } from "react-bootstrap";

export default function ForgotPasswordPage() {
  let history = useHistory();
  const [error, setError] = useState(null);
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
    <div id="ResetPasswordPage">
      <div>
        <div className="row justify-content-center">
          <div className="text-header-title col-md-5 col-xl-4">
            <p className="text-center">Reset your password</p>
            <div className="text-choose">
              <p>Please choose your new password</p>
            </div>
            <Form>
              {error && <div>{error.message}</div>}
              <Form.Group>
                <Form.Control
                  className="form-control form-control-lg"
                  type="password"
                  name="password"
                  placeholder="Enter your new password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  className="form-control form-control-lg"
                  type="password"
                  name="password"
                  placeholder="Confirm your new password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <button
                className="btn btn-lg btn-block btn-green mb-3 btn-submit"
                type="submit"
                disabled={isSubmitting}
                onClick={sendResetLink}
              >
                Save New Password
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
