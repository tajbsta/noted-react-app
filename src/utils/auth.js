import { Auth } from "aws-amplify";

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
        username: tokenInfo.username
    }
}

export const getUsername = async () => {
    const user = await getUser()
    return user.username
}