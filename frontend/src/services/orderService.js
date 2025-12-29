import axios from 'axios';

const API_URL = '/api/orders';

export const createOrder = async (orderData) => {
  try {
    const res = await axios.post(API_URL, orderData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMyOrders = async () => {
  try {
    const res = await axios.get(`${API_URL}/myorders`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getOrder = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllOrders = async (params = {}) => {
  try {
    const res = await axios.get(API_URL, { params });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateOrderStatus = async (id, estado) => {
  try {
    const res = await axios.put(`${API_URL}/${id}/status`, { estado });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const assignDelivery = async (orderId, repartidorId) => {
  try {
    const res = await axios.put(`${API_URL}/${orderId}/assign`, { repartidorId });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAvailableOrders = async () => {
  try {
    const res = await axios.get(`${API_URL}/available`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const takeOrder = async (orderId) => {
  try {
    const res = await axios.put(`${API_URL}/${orderId}/take`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
