import {
  USERNAME_EXISTS,
  INVALID_PASSWORD,
  INVALID_PARAMETER,
  INVALID_CREDENTIALS,
  LIMIT_EXCEEDED_EXCEPTION,
  EXPIRED_CODE_EXCEPTION,
  CODE_MISMATCH_EXCEPTION,
  ACCOUNT_ALREADY_EXIST,
  INVALID_REQUEST,
  SERVER_ERROR,
  GOOGLE_AUTH_ACCESS_DENIED,
  ORDER_ZIPCODE_INVALID,
  ORDER_PICKUP_SLOT_NOT_AVAILABLE,
  ORDER_CONTAINS_INVALID_PRODUCTS,
  ORDER_INVALID_PICKUP_DATE,
  ORDER_NOT_FOUND,
  ORDER_CANCEL_NOT_AVAILABLE,
  STRIPE_PAYMENT_INSUFFICIENT_FUNDS
} from "../constants/errors/errorCodes";

export const signUpErrors = [
  {
    code: USERNAME_EXISTS,
    message: "An account already exists with this email",
  },
  {
    code: INVALID_PASSWORD,
    message:
      "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
  },
  {
    code: INVALID_PARAMETER,
    message: "Password must contain 8 characters",
  },
];

export const signInErrors = [
  {
    code: INVALID_CREDENTIALS,
    message: "Invalid email or password. Please try again.",
  },
];

export const changePassErrors = [
  {
    code: INVALID_CREDENTIALS,
    message: "Invalid current password. Please try again.",
  },
  {
    code: INVALID_PASSWORD,
    message:
      "New password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
  },
  {
    code: INVALID_PARAMETER,
    message: "Password must contain 8 characters",
  },
  {
    code: LIMIT_EXCEEDED_EXCEPTION,
    message: "Attempt limit exceeded, please try again later.",
  }
];

export const forgotPassErrors = [
  {
    err: "The user is not authenticated",
  }
];

export const resetPassErrors = [
  {
    code: EXPIRED_CODE_EXCEPTION,
    message: "Invalid code provided, please request a code again.",
  },
  {
    code: CODE_MISMATCH_EXCEPTION,
    message: "Invalid code provided.",
  },
  {
    code: LIMIT_EXCEEDED_EXCEPTION,
    message: "Attempt limit exceeded, please try again later.",
  }
];

export const scraperGmailErrors = [
  {
    code: ACCOUNT_ALREADY_EXIST,
    message: "The Gmail account has already been added by an existing user",
  },
  {
    code: INVALID_REQUEST,
    message:
      "Invalid request",
  },
  {
    code: SERVER_ERROR,
    message: "Something went wrong. Please try again later.",
  },
  {
    code: GOOGLE_AUTH_ACCESS_DENIED,
    message: "Access denied"
  }
];

export const orderErrors = [
  {
    code: ORDER_ZIPCODE_INVALID,
    message: "noted service is not yet available in your area",
  },
  {
    code: ORDER_CONTAINS_INVALID_PRODUCTS,
    message:
      "Order contains invalid products",
  },
  {
    code: ORDER_PICKUP_SLOT_NOT_AVAILABLE,
    message: "Selected pickup slot is not available",
  },
  {
    code: ORDER_INVALID_PICKUP_DATE,
    message: "Invalid pickup date",
  },
  {
    code: ORDER_NOT_FOUND,
    message: "Order not found"
  },
  {
    code: ORDER_CANCEL_NOT_AVAILABLE,
    message: "Cannot cancel order at this time"
  },
  {
    code: SERVER_ERROR,
    message: "Cannot cancel order at this time"
  },
  {
    code: STRIPE_PAYMENT_INSUFFICIENT_FUNDS,
    message: "Your payment method does not have enough funds"
  }
];
