export const timeout = ({ duration }) =>
  new Promise(function (resolve) {
    setTimeout(resolve, duration);
  });
