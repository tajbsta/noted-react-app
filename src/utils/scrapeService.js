import { scraperApi } from "./api";

// Getting Google code for scraper
export const scraperAuth = async () => {
    const api = await scraperApi();

    return api.get(`google/geturl?callback_url=${process.env.REACT_APP_OAUTH_REDIRECT_SIGN_IN}verify`);
}

export const scraperStart = async (code) => {
    const api = await scraperApi();

    return api.post(`scraper/start`, { code });
}