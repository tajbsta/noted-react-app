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
    message: "The password you entered is not strong enough",
  },
  {
    code: INVALID_PARAMETER,
    message: "This password does not meet the requirements",
  },
];
