import { api } from "./api";

// Get user accounts
export const getProducts = async (userId) => {
    const axios = await api();

    const res = await axios.get(`/${userId}/products`);
    return res.data.data
}