import { api } from "./api";

// Getting Google code for scraper
export const getGoogleOauthUrl = async () => {
    const axios = await api();

    const res = await axios.get('/auth/google/url');

    return res.data.data.url
}

// Save google auth code
export const saveGoogleAuthCode = async (code, user) => {
    const axios = await api();

    await axios.post(`/auth/google`, { code, user });
}