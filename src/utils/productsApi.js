import axiosLib from 'axios';
import { DONATE } from '../constants/actions/runtime';

import { api } from './api';
import { getUserSession } from './auth';

// Get user products
export const getProducts = async ({
  userId,
  size,
  category,
  sortBy,
  sort,
  nextPageToken,
  search,
}) => {
  const axios = await api();

  let queries = [];

  if (size) {
    queries.push(`size=${size}`);
  }

  if (category) {
    queries.push(`category=${category}`);
  }

  if (sortBy) {
    queries.push(`sortBy=${sortBy}`);
  }
  if (sort) {
    queries.push(`sort=${sort}`);
  }
  if (nextPageToken) {
    queries.push(`nextPageToken=${nextPageToken}`);
  }

  if (search) {
    queries.push(`search=${search}`);
  }

  const query = queries.join('&');

  const res = await axios.get(`/${userId}/products?${query}`);
  return res.data.data;
};

let cancelTokenSource;

export const calculateMetrics = async (userId, productIds) => {
  const axios = await api();

  if (cancelTokenSource) {
    cancelTokenSource.cancel();
  }

  cancelTokenSource = axiosLib.CancelToken.source();

  const res = await axios.post(
    `/${userId}/products/metrics`,
    { productIds },
    { cancelToken: cancelTokenSource.token }
  );

  return res.data.data;
};

export const setCategory = async (productId, category) => {
  if (category === DONATE) {
    const { idToken, userId } = await getUserSession();
    const axios = await api();
    return axios.post(
      `${userId}/products/${productId}/donate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
  }
};
