// api.cartItems.jsx
import axios from './axios.customize'; // Đảm bảo axios.customize đã được cấu hình

const fetchAllCartItemsAPI = (page, limit) => {
  const URL_BACKEND = `/cart-items?page=${page}&limit=${limit}`;
  return axios.get(URL_BACKEND);
};

const fetchCartItemsByCartIdAPI = (cartId) => {
    const URL_BACKEND = `/cart-items?cart=${cartId}`;  // Giả sử backend hỗ trợ lọc theo cartId
    return axios.get(URL_BACKEND);
};

const fetchCartItemByIdAPI = (id) => {
  const URL_BACKEND = `/cart-items/${id}`;
  return axios.get(URL_BACKEND);
};

const createCartItemAPI = (cartId, productId, quantity, price, color, size) => {
  const URL_BACKEND = `/cart-items`;
  const data = {
    cart: cartId,
    product: productId,
    quantity: quantity,
    price: price,
    color: color,
    size: size,
    isActive: true // Mặc định là active
  };
  return axios.post(URL_BACKEND, data);
};

const updateCartItemAPI = (id, quantity, color, size) => {
  const URL_BACKEND = `/cart-items/${id}`;
  const data = {
    quantity: quantity,
    color: color,
    size: size
  };
  return axios.patch(URL_BACKEND, data);
};

const deleteCartItemAPI = (id) => {
  const URL_BACKEND = `/cart-items/${id}`;
  return axios.delete(URL_BACKEND);
};

export {
    fetchAllCartItemsAPI,
    fetchCartItemsByCartIdAPI,
    fetchCartItemByIdAPI,
    createCartItemAPI,
    updateCartItemAPI,
    deleteCartItemAPI
};