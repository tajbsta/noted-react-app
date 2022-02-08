import axiosLib from 'axios';
import { STANDARD } from '../constants/addProducts';
import { api } from './api';
import { getUserId, getUserSession } from './auth';

// Get user products
export const getProducts = async ({
  size,
  category,
  sortBy,
  sort,
  nextPageToken,
  search,
  reviewStatus,
  isArchived,
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

  if (reviewStatus) {
    queries.push(`review_status=${reviewStatus}`);
  }

  if (isArchived) {
    queries.push(`isArchived=${isArchived}`);
  }

  const query = queries.join('&');
  const { userId } = await getUserSession();
  const res = await axios.get(`/${userId}/products?${query}`);
  return res.data.data;
};

let cancelTokenSource;

export const calculateMetrics = async (productIds) => {
  const axios = await api();
  const { userId } = await getUserSession();

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

export const donateItem = async (productId) => {
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
};

export const getOtherReturnProducts = async (size = 5, productIds = []) => {
  const axios = await api();
  const { userId } = await getUserSession();

  const res = await axios.post(
    `/${userId}/products/other/returns?size=${size}`,
    { productIds }
  );
  return res.data.data;
};

export const getVendors = async () => {
  const axios = await api();

  let queries = [];
  const { userId } = await getUserSession();
  const query = queries.join('&');
  const res = await axios.get(`/${userId}/vendors?${query}`);
  return res.data.data;
};

export const getDonationOrgs = async () => {
  const axios = await api();
  const { userId } = await getUserSession();
  const res = await axios.get(`/${userId}/products/donate/organizations`);
  return res.data.data;
};

export const uploadImage = async (file) => {
  const userId = await getUserId();

  const axios = await api();
  const res = await axios.post(`${userId}/profile/generatePresigned`, {
    name: file.name,
    type: file.type,
  });

  const { url } = res.data.data;

  const config = {
    headers: {
      'Content-Type': file.type,
      'x-file-upload-header': 'file_upload',
    },
  };

  await axiosLib.put(url, file, config);

  return res.data.data;
};

/**
 *
 * @param {Object} data - Data to send to {userId}/products endpoint
 * @param {String} data.type - Type of manual product upload
 * @param {String} data.merchant - Merchant Code
 * @param {String} data.orderRef - Order Reference of the Receipt
 * @param {String} data.orderDate - Order date of the Receipt
 * @param {String} data.name - Name of Product of the Receipt
 * @param {String} data.price - Price of item on Receipt
 * @param {Array<T>} data.files - Array of files to upload along with product
 * @param {String} data.notes - Any additional notes
 */
export const uploadProduct = async (data) => {
  const fileKeys = await Promise.all(
    data.files.map(async (file) => {
      const res = await uploadImage(file);
      return res.key;
    })
  );
  let dataToSend = {};
  dataToSend.type = data.type;
  dataToSend.merchant = data.merchant;
  dataToSend.files = fileKeys;
  dataToSend.name = data.name;
  dataToSend.price = data.price;
  if (data.type === STANDARD) {
    dataToSend.orderRef = data.orderRef;
    dataToSend.orderDate = data.orderDate;
    dataToSend.notes = data.notes;
  }

  const userId = await getUserId();
  const axios = await api();
  const res = await axios.post(`${userId}/products`, dataToSend);
  return res.data;
};

export const addProductFromScraper = async ({
  orders,
  isScrapeRegular,
  isScrapeOlder,
  accountEmail,
  provider,
}) => {
  const data = {
    isScrapeRegular,
    isScrapeOlder,
    accountEmail,
    provider,
    orders,
  };
  const { userId } = await getUserSession();
  const axios = await api();
  return axios.post(`${userId}/products/scraped`, data);
};

export const toggleArchiveItem = async ({ _id, isArchived }) => {
  try {
    const axios = await api();
    const { userId } = await getUserSession();

    const archiveResponse = await axios.post(
      `${userId}/products/${_id}/archive`,
      {
        isArchived,
      }
    );
    return archiveResponse;
  } catch (error) {
    // console.log(error);
    return false;
  }
};
