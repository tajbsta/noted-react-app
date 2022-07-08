import { api } from './api';
import axiosLib from 'axios';
import { getUserSession } from './auth';

export const uploadVendorLogo = async (userId, file) => {
  const axios = await api();

  // pass upload signedurl to s3
  const res = await axios.post(`${userId}/vendors/generatePresigned`, {
    name: file.name,
    type: file.type,
  });

  const { url: putUrl, key: uploadKey } = res.data.data;

  const config = {
    headers: {
      'Content-Type': file.type,
      'x-file-upload-header': 'file_upload',
    },
  };

  await axiosLib.put(putUrl, file, config);

  return `${process.env.REACT_APP_ASSETS_URL}/${uploadKey}`;
};

export const saveVendorReview = async (vendor) => {
  const axios = await api();
  const { userId } = await getUserSession();

  return (await axios.post(`/${userId}/vendors`, vendor)).data;
};
