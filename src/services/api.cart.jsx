// api.cart.jsx
import axios from './axios.customize'; // Đảm bảo axios.customize đã được cấu hình

const fetchAllCartsAPI = (page, limit) => {
  const URL_BACKEND = `/carts?page=${page}&limit=${limit}`;
  return axios.get(URL_BACKEND);
};

const fetchCartByIdAPI = (id) => {
  const URL_BACKEND = `/carts/${id}`;
  return axios.get(URL_BACKEND);
};

// Thêm API để tạo giỏ hàng (nếu backend hỗ trợ)
const createCartAPI = (userId, discountCode) => {
  const URL_BACKEND = `/carts`;
  const data = {
    user: userId,
    discountCode: discountCode
  };
  return axios.post(URL_BACKEND, data);
};

// Thêm API để cập nhật giỏ hàng (ví dụ: áp dụng mã giảm giá)
const updateCartAPI = (id, discountCode) => {
  const URL_BACKEND = `/carts/${id}`;
  const data = {
    discountCode: discountCode
  };
  return axios.patch(URL_BACKEND, data);
};

// Thêm API để xóa giỏ hàng
const deleteCartAPI = (id) => {
  const URL_BACKEND = `/carts/${id}`;
  return axios.delete(URL_BACKEND);
};

export {
    fetchAllCartsAPI,
    fetchCartByIdAPI,
    createCartAPI,
    updateCartAPI,
    deleteCartAPI
};