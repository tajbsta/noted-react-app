import React from 'react';
import { Mail } from 'react-feather';

export default function RegisterPage() {
  return (
    <div>
      <div classNameName="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-5 col-xl-4 my-5">
            <h1 className="display-4 text-center mb-3">Sign in</h1>
            <p className="text-center">Need to return or donate</p>
            <p className="text-center">purchases made in the past?</p>
            <p className="text-center">Let's go!</p>
            <form>
              <div className="form-group">
                <input type="email" className="form-control" placeholder="Your email..." />
              </div>
              <button className="btn btn-lg btn-block btn-primary mb-3">
                <i className="fe fe-mail">
                  <Mail />
                </i>
                Join with email
              </button>
              <div className="text-center">
                <small className="text-muted text-center">
                  By joining Noted you agree to our Terms of Service and Privacy. Protected by
                  Google's Privacy and Terms.
                </small>
                <div>
                  <h3>
                    Already a member? <a href="#">Log in</a>
                  </h3>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
