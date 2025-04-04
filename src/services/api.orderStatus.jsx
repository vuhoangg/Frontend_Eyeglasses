// src/services/api.orderStatus.jsx
import axios from './axios.customize';

const fetchAllOrderStatusAPI = () => {
    const URL_BACKEND = `/order-status`;
    return axios.get(URL_BACKEND);
};

export {
    fetchAllOrderStatusAPI,
};