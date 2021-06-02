import { api } from "./api";

// Get user accounts
export const getAccounts = async (userId) => {
    const axios = await api();

    const res = await axios.get(`/${userId}/accounts`);
    return res.data.data
}

export const deleteAccount = async (userId, accountId) => {
    const axios = await api();

    await axios.delete(`/${userId}/accounts/${accountId}`);
}