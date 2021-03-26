import { Auth } from 'aws-amplify';

export const isAuthenticated = async () => {
  try {
    const session = await Auth.currentSession();
    return session.isValid();
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getUser = async () => {
  const res = await Auth.currentSession();
  const accessToken = res.getAccessToken().getJwtToken();
  const idToken = res.getIdToken().getJwtToken();
  const refreshToken = res.getRefreshToken().getToken();
  const tokenInfo = res.getAccessToken().decodePayload();
  return {
    accessToken,
    idToken,
    refreshToken,
    userId: tokenInfo.username,
  };
};

// Cognito userId
export const getUserId = async () => {
  const user = await getUser();
  return user.userId;
};
