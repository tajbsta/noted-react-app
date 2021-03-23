import { api } from "./api";

// Get user accounts
export const getAccounts = async (userId) => {
    const axios = await api();

    const res = await axios.get(`/${userId}/accounts`);
    return res.data.data
}

// Launch scan on user's accounts
export const startAccountsScan = async (userId) => {
    const axios = await api();

    const res = await axios.post(`/${userId}/accounts/start`);
    return res.data.data
}