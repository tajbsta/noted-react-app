import {
  USERNAME_EXISTS,
  INVALID_PASSWORD,
  INVALID_PARAMETER,
} from "../constants/errors/errorCodes";

export const signUpErrors = [
  {
    code: USERNAME_EXISTS,
    message: "An account already exists with this email",
  },
  {
    code: INVALID_PASSWORD,
    message: "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
  },
  {
    code: INVALID_PARAMETER,
    message: "Password must contain 8 characters",
  },
];

export const signInErrors = [
  {
    code: INVALID_PASSWORD,
    message: "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
  },
  {
    code: INVALID_PARAMETER,
    message: "Password must contain 8 characters",
  },
];

