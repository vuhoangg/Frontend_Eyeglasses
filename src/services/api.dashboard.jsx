import axios from './axios.customize';

const fetchUserCountAPI = () => {
    const URL_BACKEND = `/user?limit=1`; // Chỉ cần lấy meta data để đếm total
    return axios.get(URL_BACKEND);
};

const fetchProductCountAPI = () => {
    const URL_BACKEND = `/product?limit=1`;
    return axios.get(URL_BACKEND);
};

const fetchOrderCountAPI = () => {
    const URL_BACKEND = `/orders?limit=1`;
    return axios.get(URL_BACKEND);
};

const fetchBestSellingProductsAPI = () => {
    const URL_BACKEND = `/product/best-selling`;
    return axios.get(URL_BACKEND);
};




const fetchMonthlyRevenueAPI = () => {
    const URL_BACKEND = `/orders/monthly-revenue`;
    return axios.get(URL_BACKEND);
};


export {
    fetchUserCountAPI,
    fetchProductCountAPI,
    fetchOrderCountAPI,
    fetchBestSellingProductsAPI,
    fetchMonthlyRevenueAPI,
};