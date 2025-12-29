import axios from 'axios';

const API_URL = '/api/products';

export const getProducts = async (params = {}) => {
  try {
    const res = await axios.get(API_URL, { params });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProduct = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createProduct = async (productData) => {
  try {
    const res = await axios.post(API_URL, productData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, productData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
