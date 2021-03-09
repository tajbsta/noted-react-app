import { Auth } from "aws-amplify";

export const getUser = async () => {
    const res = await Auth.currentSession();

    const accessToken = res.getAccessToken().getJwtToken();
    const idToken = res.getIdToken().getJwtToken();
    const refreshToken = res.getRefreshToken().getToken();
    const username = res.getAccessToken().decodePayload().username;

    return {
        accessToken,
        idToken,
        refreshToken,
        username
    }
}