import { api } from "./api";
import { Auth } from 'aws-amplify';
import axiosLib from 'axios'

export const isAuthenticated = async () => {
  try {
    const session = await Auth.currentSession();
    return session.isValid();
  } catch (error) {
    console.log(error);
    return false;
  }
};

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
    userId: tokenInfo.sub
  }
}

// Cognito userId
export const getUserId = async () => {
  const user = await getUserSession()
  return user.userId
}

export const getUser = async () => {

  const user = await Auth.currentAuthenticatedUser()
  const data = user.attributes

  if (data['custom:created_at']) {
    data.createdAt = parseInt(data['custom:created_at'])
  } else if (data.identities) {
    const identity = JSON.parse(data.identities).pop();

    data.createdAt = identity.dateCreated
  }

  return data
}

export const updateUserAttributes = async (attributes) => {
  const user = await Auth.currentAuthenticatedUser()

  await Auth.updateUserAttributes(user, attributes)
}

export const uploadProfilePic = async (userId, currentProfile = null, file) => {
  console.log(file)

  const axios = await api();

  // pass upload signedurl to s3
  const res = await axios.post(`${userId}/profile/generatePresigned`, {
    "name": file.name,
    "type": file.type
  })

  const { url: putUrl, key: uploadKey } = res.data.data

  const config = {
    headers: {
      'Content-Type': file.type,
      'x-file-upload-header': 'file_upload'
    }
  }

  await axiosLib.put(putUrl, file, config)

  // save new upload file
  let oldKey = ''

  if (currentProfile) {
    // get old profile key
    oldKey = currentProfile.replace(`${process.env.REACT_APP_ASSETS_URL}/`, '')
  }

  const saveResponse = await axios.post(`/${userId}/profile/save`, {
    oldKey,
    key: uploadKey
  })

  const { key } = saveResponse.data.data

  const photoPublicUrl = `${process.env.REACT_APP_ASSETS_URL}/${key}`

  // update user profile cognito attribute
  await updateUserAttributes({
    profile: photoPublicUrl
  })
}