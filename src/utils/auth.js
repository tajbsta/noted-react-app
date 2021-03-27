import { Auth } from "aws-amplify";

export const isAuthenticated = async () => {
    try {
        const session = await Auth.currentSession()
        return session.isValid();
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const getUserSession = async () => {
    const res = await Auth.currentSession();

    const accessToken = res.getAccessToken().getJwtToken();
    const idToken = res.getIdToken().getJwtToken();
    const refreshToken = res.getRefreshToken().getToken();
    const tokenInfo = res.getAccessToken().decodePayload();

    return {
        accessToken,
        idToken,
        refreshToken,
        userId: tokenInfo.username
    }
}

// Cognito userId
export const getUserId = async () => {
    const user = await getUserSession()
    return user.userId
}

export const getUser = async () => {

    const user = await Auth.currentAuthenticatedUser()
    const attributes = await Auth.userAttributes(user)
    console.log({
        attributes
    })

    return user
}

export const updateUserAttributes = async (attributes) => {
    const user = await Auth.currentAuthenticatedUser()

    await Auth.updateUserAttributes(user, attributes)
}